from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from django.db.models import Q
from decimal import Decimal

from .models import Category, Product, Order, OrderItem
from .forms import RegistrationForm, LoginForm, CheckoutForm, ProfileForm
from .cart import Cart


def home(request):
    """Modern home page showcasing featured products and top categories."""
    featured_products = Product.objects.filter(is_available=True).order_by('-created_at')[:8]
    categories = Category.objects.all()
    return render(request, 'home.html', {
        'featured_products': featured_products,
        'categories': categories,
    })


def product_list(request):
    """
    Product listing page with responsive grid, search by name/description,
    and filtering by category.
    """
    category_slug = request.GET.get('category', '').strip()
    search_query = request.GET.get('q', '').strip()

    products = Product.objects.filter(is_available=True)
    selected_category = None

    if category_slug:
        selected_category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=selected_category)

    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | Q(description__icontains=search_query)
        )

    categories = Category.objects.all()

    return render(request, 'product_list.html', {
        'products': products,
        'categories': categories,
        'selected_category': selected_category,
        'search_query': search_query,
        'total_count': products.count(),
    })


def product_detail(request, slug):
    """
    Detailed product view with availability, stock count, quantity selector,
    and related items from the same category.
    """
    product = get_object_or_404(Product, slug=slug)
    related_products = Product.objects.filter(
        category=product.category,
        is_available=True
    ).exclude(id=product.id)[:4]

    return render(request, 'product_detail.html', {
        'product': product,
        'related_products': related_products,
    })


def cart_detail(request):
    """
    Shopping cart summary page displaying items, quantities, item totals,
    and overall subtotal calculated server-side.
    """
    cart = Cart(request)
    cart_items = cart.get_items()
    subtotal = cart.get_total_price()
    return render(request, 'cart.html', {
        'cart_items': cart_items,
        'subtotal': subtotal,
        'total_items': len(cart),
    })


def cart_add(request, product_id):
    """Add a product to the session-based shopping cart with strict stock validation."""
    product = get_object_or_404(Product, id=product_id)

    if not product.in_stock:
        messages.error(request, f"Sorry, '{product.name}' is currently out of stock.")
        return redirect(request.POST.get('next') or product.get_absolute_url())

    try:
        quantity = int(request.POST.get('quantity', 1))
    except (ValueError, TypeError):
        quantity = 1

    if quantity < 1:
        quantity = 1

    cart = Cart(request)
    new_qty, msg = cart.add(product, quantity=quantity)

    if new_qty > 0:
        messages.success(request, msg)
    else:
        messages.error(request, msg)

    redirect_url = request.POST.get('next') or 'store:cart_detail'
    if redirect_url.startswith('/'):
        return redirect(redirect_url)
    return redirect('store:cart_detail')


def cart_update(request, product_id):
    """Update item quantity in session cart with server-side bounds enforcement."""
    if request.method == 'POST':
        product = get_object_or_404(Product, id=product_id)
        try:
            quantity = int(request.POST.get('quantity', 1))
        except (ValueError, TypeError):
            quantity = 1

        cart = Cart(request)
        new_qty, msg = cart.update(product, quantity)
        if new_qty > 0:
            messages.success(request, msg)
        else:
            messages.info(request, msg)

    return redirect('store:cart_detail')


def cart_remove(request, product_id):
    """Remove a product completely from session cart."""
    product = get_object_or_404(Product, id=product_id)
    cart = Cart(request)
    success, msg = cart.remove(product)
    if success:
        messages.success(request, msg)
    else:
        messages.warning(request, msg)
    return redirect('store:cart_detail')


def cart_clear(request):
    """Clear all items from session cart."""
    cart = Cart(request)
    cart.clear()
    messages.info(request, "Your shopping cart has been emptied.")
    return redirect('store:cart_detail')


@login_required
def checkout(request):
    """
    Checkout view requiring user authentication. Validates cart content,
    re-checks live product stock atomically, deducts inventory, creates Order & OrderItems,
    and clears the cart safely.
    """
    cart = Cart(request)
    cart_items = cart.get_items()

    if not cart_items:
        messages.warning(request, "Your cart is empty. Please add products before checking out.")
        return redirect('store:cart_detail')

    subtotal = cart.get_total_price()

    if request.method == 'POST':
        form = CheckoutForm(request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():
                    # Re-validate stock atomically for all cart items
                    for item in cart_items:
                        prod = Product.objects.select_for_update().get(id=item['product'].id)
                        if prod.stock < item['quantity']:
                            messages.error(
                                request,
                                f"Insufficient stock for '{prod.name}'. Only {prod.stock} left. Please adjust your cart."
                            )
                            return redirect('store:cart_detail')

                    # Create Order record
                    order = form.save(commit=False)
                    order.user = request.user
                    order.total_amount = subtotal
                    order.status = 'Pending'
                    order.save()

                    # Create OrderItem records & deduct stock
                    for item in cart_items:
                        prod = Product.objects.select_for_update().get(id=item['product'].id)
                        OrderItem.objects.create(
                            order=order,
                            product=prod,
                            quantity=item['quantity'],
                            price=prod.price  # Locked at purchase time!
                        )
                        prod.stock -= item['quantity']
                        if prod.stock == 0:
                            prod.is_available = False
                        prod.save()

                    # Clear cart after successful order creation
                    cart.clear()

                messages.success(request, f"Order #{order.order_number} placed successfully!")
                return redirect('store:order_success', order_number=order.order_number)

            except Exception as e:
                messages.error(request, f"An unexpected error occurred during checkout: {str(e)}")
                return redirect('store:checkout')
        else:
            messages.error(request, "Please correct the errors in the shipping form below.")
    else:
        # Pre-populate form with authenticated user details if available
        initial_data = {
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'email': request.user.email,
        }
        form = CheckoutForm(initial=initial_data)

    return render(request, 'checkout.html', {
        'form': form,
        'cart_items': cart_items,
        'subtotal': subtotal,
        'total_items': len(cart),
    })


@login_required
def order_success(request, order_number):
    """Order confirmation page showing order number, summary, status, and shipping info."""
    order = get_object_or_404(Order, order_number=order_number, user=request.user)
    return render(request, 'order_success.html', {
        'order': order,
    })


@login_required
def order_list(request):
    """Display user's previous order history, strictly filtered by request.user."""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'orders.html', {
        'orders': orders,
    })


@login_required
def order_detail(request, order_number):
    """
    Detailed view of a specific order.
    Strict security check: user can only see their own order.
    """
    order = get_object_or_404(Order, order_number=order_number, user=request.user)
    return render(request, 'order_detail.html', {
        'order': order,
    })


@login_required
def profile(request):
    """User profile page allowing updates to first name, last name, and email."""
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Your profile has been updated successfully.")
            return redirect('store:profile')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = ProfileForm(instance=request.user)

    order_count = Order.objects.filter(user=request.user).count()

    return render(request, 'profile.html', {
        'form': form,
        'order_count': order_count,
    })


def register(request):
    """User registration view using Django's built-in User model and password hashing."""
    if request.user.is_authenticated:
        return redirect('store:home')

    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            User.objects.create_user(
                username=form.cleaned_data['username'],
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password'],
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
            )
            messages.success(request, "Account created successfully! You can now log in.")
            return redirect('store:login')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = RegistrationForm()

    return render(request, 'register.html', {'form': form})


def user_login(request):
    """User login view using Django authentication system."""
    if request.user.is_authenticated:
        return redirect('store:home')

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome back, {user.first_name or user.username}!")
                next_url = request.GET.get('next') or 'store:home'
                return redirect(next_url)
            else:
                messages.error(request, "Invalid username or password. Please try again.")
        else:
            messages.error(request, "Please provide both username and password.")
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})


def user_logout(request):
    """Log the current user out and redirect to the home page with a friendly message."""
    logout(request)
    messages.info(request, "You have been successfully logged out.")
    return redirect('store:home')


def about(request):
    """Educational / Academic explanation page of the e-commerce architecture."""
    return render(request, 'about.html')
