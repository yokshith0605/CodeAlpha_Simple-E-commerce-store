from decimal import Decimal
from .models import Product


class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get('cart')
        if cart is None:
            cart = self.session['cart'] = {}
        self.cart = cart

    def add(self, product, quantity=1, override_quantity=False):
        product_id = str(product.id)
        if product.stock <= 0 or not product.is_available:
            return 0, "Product is currently out of stock."

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            quantity = 1

        if quantity < 1:
            quantity = 1

        current_qty = self.cart.get(product_id, 0)
        if override_quantity:
            new_qty = quantity
        else:
            new_qty = current_qty + quantity

        # Stock bounds check
        if new_qty > product.stock:
            new_qty = product.stock
            self.cart[product_id] = new_qty
            self.save()
            return new_qty, f"Only {product.stock} items available in stock. Cart updated to maximum available."

        self.cart[product_id] = new_qty
        self.save()
        return new_qty, "Product added to cart successfully."

    def update(self, product, quantity):
        product_id = str(product.id)
        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            quantity = 1

        if quantity <= 0:
            return self.remove(product)

        if quantity > product.stock:
            self.cart[product_id] = product.stock
            self.save()
            return product.stock, f"Only {product.stock} units available in stock."

        self.cart[product_id] = quantity
        self.save()
        return quantity, "Cart updated successfully."

    def remove(self, product):
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()
            return True, "Item removed from cart."
        return False, "Item was not in cart."

    def clear(self):
        self.session['cart'] = {}
        self.session.modified = True

    def save(self):
        self.session.modified = True

    def __iter__(self):
        product_ids = [int(pid) for pid in self.cart.keys() if pid.isdigit()]
        products = Product.objects.filter(id__in=product_ids)
        product_map = {p.id: p for p in products}

        for pid_str, quantity in list(self.cart.items()):
            try:
                pid = int(pid_str)
                product = product_map.get(pid)
                if product:
                    item_total = product.price * quantity
                    yield {
                        'product': product,
                        'quantity': quantity,
                        'price': product.price,
                        'total_price': item_total,
                    }
                else:
                    # Clean up deleted product
                    del self.cart[pid_str]
                    self.save()
            except (ValueError, TypeError):
                continue

    def get_items(self):
        return list(self.__iter__())

    def __len__(self):
        return sum(qty for qty in self.cart.values() if isinstance(qty, int))

    def get_total_price(self):
        total = Decimal('0.00')
        for item in self:
            total += item['total_price']
        return total
