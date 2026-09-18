import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Code, Database, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActivePage } = useStore();
  const [activeCodeTab, setActiveCodeTab] = useState<'models' | 'atomic_checkout' | 'session_cart'>('models');

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <Layers className="w-3.5 h-3.5" /> Full-Stack Architecture Documentation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Django Model-View-Template (MVT) Architecture
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          An in-depth explanation of how this e-commerce system is structured, from normalized relational schemas and session-backed carts to database concurrency row-locking during checkout.
        </p>
      </div>

      {/* 1. MVT Three-Tier Architecture */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>1. The MVT (Model-View-Template) Pattern</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Model Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              M
            </div>
            <h3 className="font-bold text-slate-900 text-base">Model (Data Layer)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Defines the data structure, foreign key relationships, and database constraints.
              Maps directly to database tables via Django's Object-Relational Mapper (ORM).
            </p>
            <div className="pt-2 text-[11px] font-mono bg-slate-50 p-2 rounded text-slate-700">
              Category &bull; Product &bull; Order &bull; OrderItem
            </div>
          </div>

          {/* View Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              V
            </div>
            <h3 className="font-bold text-slate-900 text-base">View (Business Logic)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receives HTTP requests, executes business rules, queries models, handles transactions, and prepares the context dictionary.
            </p>
            <div className="pt-2 text-[11px] font-mono bg-slate-50 p-2 rounded text-slate-700">
              product_list &bull; cart_add &bull; checkout &bull; order_detail
            </div>
          </div>

          {/* Template Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              T
            </div>
            <h3 className="font-bold text-slate-900 text-base">Template (Presentation)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Renders dynamic HTML using Django Template Language tags (<code>&#123;% for %&#125;</code>, <code>&#123;&#123; product.price &#125;&#125;</code>).
              Inherits from a common <code>base.html</code>.
            </p>
            <div className="pt-2 text-[11px] font-mono bg-slate-50 p-2 rounded text-slate-700">
              base.html &bull; home.html &bull; cart.html &bull; checkout.html
            </div>
          </div>
        </div>
      </section>

      {/* 2. Concurrency & Race Condition Safety */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6 shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Critical Enterprise Requirement
        </div>

        <h2 className="text-2xl font-bold">
          Preventing Race Conditions: Atomic Concurrency Control
        </h2>

        <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-3xl">
          In high-volume e-commerce, when multiple customers attempt to purchase the last available item simultaneously, standard ORM queries can read stale inventory before the write occurs, resulting in negative stock (overselling).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Flawed Pattern */}
          <div className="bg-slate-800/80 rounded-xl p-5 border border-rose-500/40 space-y-3">
            <div className="text-rose-400 font-bold text-sm flex items-center gap-1.5">
              <span>✕ The Naive Approach (Prone to Race Conditions)</span>
            </div>
            <pre className="text-[11px] font-mono bg-black/40 p-3 rounded text-rose-200 overflow-x-auto">
{`# ⚠️ DANGEROUS: Two threads read stock = 1 simultaneously
product = Product.objects.get(id=product_id)
if product.stock >= qty:
    # Context switch occurs here!
    product.stock -= qty
    product.save() # Both succeed, stock becomes -1!`}
            </pre>
            <p className="text-[11px] text-slate-400">
              Between the read (<code className="text-rose-300">.get()</code>) and write (<code className="text-rose-300">.save()</code>), another transaction reads the same unreserved quantity.
            </p>
          </div>

          {/* Secure Pattern */}
          <div className="bg-slate-800/80 rounded-xl p-5 border border-emerald-500/40 space-y-3">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              <span>✓ Atomic Isolation with Row Locks</span>
            </div>
            <pre className="text-[11px] font-mono bg-black/40 p-3 rounded text-emerald-200 overflow-x-auto">
{`from django.db import transaction

# Safe: Row locked until transaction commits
with transaction.atomic():
    product = Product.objects.select_for_update().get(id=product_id)
    if product.stock < qty:
        raise ValidationError("Insufficient inventory")
    product.stock -= qty
    product.save()`}
            </pre>
            <p className="text-[11px] text-slate-400">
              <code className="text-emerald-300">select_for_update()</code> issues a <code className="text-emerald-300">SELECT ... FOR UPDATE</code> SQL statement, holding an exclusive database lock on that product row.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Database Schema Diagram */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>2. Relational Database Schema & Foreign Keys</span>
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Category Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>Category</span>
                <span className="text-[10px] text-slate-400">Table</span>
              </div>
              <div className="p-3 space-y-1 text-slate-600 bg-white">
                <div className="text-blue-600 font-semibold">PK id: UUID/Int</div>
                <div>name: CharField(100)</div>
                <div>slug: SlugField(unique)</div>
                <div>icon: CharField(20)</div>
                <div>description: TextField</div>
              </div>
            </div>

            {/* Product Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>Product</span>
                <span className="text-[10px] text-slate-400">Table</span>
              </div>
              <div className="p-3 space-y-1 text-slate-600 bg-white">
                <div className="text-blue-600 font-semibold">PK id: UUID/Int</div>
                <div className="text-amber-600 font-semibold">FK category_id</div>
                <div>name: CharField(200)</div>
                <div>price: DecimalField</div>
                <div>stock: PositiveIntField</div>
                <div>is_available: Boolean</div>
              </div>
            </div>

            {/* Order Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>Order</span>
                <span className="text-[10px] text-slate-400">Table</span>
              </div>
              <div className="p-3 space-y-1 text-slate-600 bg-white">
                <div className="text-blue-600 font-semibold">PK id: UUID/Int</div>
                <div>order_number: Char(20)</div>
                <div>first_name: CharField</div>
                <div>total_amount: Decimal</div>
                <div>status: Char(Choice)</div>
                <div>created_at: DateTime</div>
              </div>
            </div>

            {/* OrderItem Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>OrderItem</span>
                <span className="text-[10px] text-slate-400">Table</span>
              </div>
              <div className="p-3 space-y-1 text-slate-600 bg-white">
                <div className="text-blue-600 font-semibold">PK id: UUID/Int</div>
                <div className="text-amber-600 font-semibold">FK order_id</div>
                <div className="text-amber-600 font-semibold">FK product_id</div>
                <div>quantity: PositiveInt</div>
                <div>price: DecimalField</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Referential Integrity:</strong> Deleting a category can cascade or protect products, while OrderItems freeze the snapshot price at checkout to ensure accounting history cannot change if product prices fluctuate later.
            </span>
          </div>
        </div>
      </section>

      {/* 4. Interactive Code Snippet Tabs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          <span>3. Source Code Implementation Reference</span>
        </h2>

        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-slate-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-900/80 px-4 pt-2 gap-2 text-xs">
            <button
              onClick={() => setActiveCodeTab('models')}
              className={`px-4 py-2.5 rounded-t-lg font-mono font-medium transition-colors ${
                activeCodeTab === 'models' 
                  ? 'bg-slate-950 text-blue-400 border-t-2 border-blue-500' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              store/models.py
            </button>
            <button
              onClick={() => setActiveCodeTab('atomic_checkout')}
              className={`px-4 py-2.5 rounded-t-lg font-mono font-medium transition-colors ${
                activeCodeTab === 'atomic_checkout' 
                  ? 'bg-slate-950 text-emerald-400 border-t-2 border-emerald-500' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              store/views.py (atomic checkout)
            </button>
            <button
              onClick={() => setActiveCodeTab('session_cart')}
              className={`px-4 py-2.5 rounded-t-lg font-mono font-medium transition-colors ${
                activeCodeTab === 'session_cart' 
                  ? 'bg-slate-950 text-amber-400 border-t-2 border-amber-500' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              store/cart.py (session cart)
            </button>
          </div>

          {/* Code Body */}
          <div className="p-6 font-mono text-xs overflow-x-auto leading-relaxed text-slate-300">
            {activeCodeTab === 'models' && (
              <pre>
{`from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=20, default='📦')
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def in_stock(self):
        return self.stock > 0 and self.is_available`}
              </pre>
            )}

            {activeCodeTab === 'atomic_checkout' && (
              <pre>
{`from django.db import transaction
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Product, Order, OrderItem
import uuid

def checkout(request):
    cart = Cart(request)
    if len(cart) == 0:
        return redirect('product_list')

    if request.method == 'POST':
        try:
            # Atomic block with select_for_update row lock
            with transaction.atomic():
                order = Order.objects.create(
                    order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
                    first_name=request.POST.get('first_name'),
                    last_name=request.POST.get('last_name'),
                    email=request.POST.get('email'),
                    total_amount=cart.get_total_price(),
                    status='Pending'
                )

                for item in cart:
                    # Exclusive DB Lock on product record
                    product = Product.objects.select_for_update().get(id=item['product_id'])
                    
                    if product.stock < item['quantity']:
                        raise ValueError(f"Sorry, {product.name} is no longer in stock.")
                    
                    # Decrement inventory safely
                    product.stock -= item['quantity']
                    product.save()

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        price=item['price'],
                        quantity=item['quantity']
                    )

                cart.clear()
                return redirect('order_success', order_id=order.id)

        except ValueError as err:
            messages.error(request, str(err))
            return redirect('cart')`}
              </pre>
            )}

            {activeCodeTab === 'session_cart' && (
              <pre>
{`class Cart:
    """
    Session-backed shopping cart utility.
    Stores items in request.session['cart'] dictionary.
    """
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get('cart')
        if not cart:
            cart = self.session['cart'] = {}
        self.cart = cart

    def add(self, product, quantity=1):
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {
                'quantity': 0,
                'price': str(product.price)
            }
        self.cart[product_id]['quantity'] += quantity
        self.save()

    def remove(self, product_id):
        product_id = str(product_id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    def clear(self):
        del self.session['cart']
        self.save()`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* CTA: Browse Catalog */}
      <div className="text-center pt-4">
        <button
          onClick={() => setActivePage('products')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
        >
          <span>Explore Working Store Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
