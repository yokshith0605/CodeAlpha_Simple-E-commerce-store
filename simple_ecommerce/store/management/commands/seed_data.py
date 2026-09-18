from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils.text import slugify
from store.models import Category, Product


class Command(BaseCommand):
    help = 'Seeds initial sample categories and products into the database for testing and demonstration.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting database seeding...")

        # 1. Categories
        categories_data = [
            {
                'name': 'Electronics',
                'description': 'Smart devices, audio equipment, chargers, and premium personal tech accessories.'
            },
            {
                'name': 'Clothing',
                'description': 'Comfortable everyday apparel, high-quality cotton tees, and stylish casual wear.'
            },
            {
                'name': 'Books',
                'description': 'Educational guides, computer science books, algorithms, and practical programming manuals.'
            },
            {
                'name': 'Home & Kitchen',
                'description': 'Modern living essentials, ceramic drinkware, desk lamps, and hydration bottles.'
            },
            {
                'name': 'Accessories',
                'description': 'Everyday carry items, durable backpacks, smart wearables, and phone stands.'
            },
        ]

        created_categories = {}
        for cat in categories_data:
            category_obj, created = Category.objects.get_or_create(
                name=cat['name'],
                defaults={
                    'slug': slugify(cat['name']),
                    'description': cat['description']
                }
            )
            created_categories[cat['name']] = category_obj
            status_text = "Created" if created else "Found"
            self.stdout.write(f"  [{status_text}] Category: {category_obj.name}")

        # 2. Products (At least 15 sample products)
        products_data = [
            # Electronics
            {
                'name': 'Wireless Headphones',
                'category': 'Electronics',
                'description': 'High-fidelity over-ear Bluetooth headphones with active noise cancelling, plush memory foam earcups, and 30-hour battery life.',
                'price': Decimal('89.99'),
                'stock': 25,
            },
            {
                'name': 'Bluetooth Speaker',
                'category': 'Electronics',
                'description': 'Portable IPX7 waterproof Bluetooth speaker delivering 360-degree sound with deep bass and 15-hour playback on a single charge.',
                'price': Decimal('49.99'),
                'stock': 30,
            },
            {
                'name': 'USB-C Charger',
                'category': 'Electronics',
                'description': '65W GaN dual-port fast wall charger with Power Delivery 3.0, compatible with laptops, tablets, and smartphones.',
                'price': Decimal('19.99'),
                'stock': 50,
            },
            {
                'name': 'Wireless Mouse',
                'category': 'Electronics',
                'description': 'Ergonomic 2.4GHz wireless optical mouse with whisper-quiet clicks, adjustable DPI up to 2400, and long battery standby.',
                'price': Decimal('29.99'),
                'stock': 40,
            },
            {
                'name': 'Mechanical Keyboard',
                'category': 'Electronics',
                'description': 'Tenkeyless mechanical gaming and typing keyboard with tactile switches, customizable white LED backlighting, and durable PBT keycaps.',
                'price': Decimal('79.99'),
                'stock': 18,
            },

            # Clothing
            {
                'name': 'Cotton T-Shirt',
                'category': 'Clothing',
                'description': '100% premium combed organic cotton crewneck t-shirt. Breathable, pre-shrunk fabric tailored for all-day comfort.',
                'price': Decimal('24.99'),
                'stock': 60,
            },
            {
                'name': 'Casual Hoodie',
                'category': 'Clothing',
                'description': 'Heavyweight fleece hooded sweatshirt with kangaroo pocket, double-lined hood, and matching ribbed cuffs and waistband.',
                'price': Decimal('49.99'),
                'stock': 35,
            },
            {
                'name': 'Denim Jeans',
                'category': 'Clothing',
                'description': 'Classic straight-fit stretch denim jeans crafted with 98% cotton and 2% elastane for optimal flexibility and durability.',
                'price': Decimal('59.99'),
                'stock': 28,
            },
            {
                'name': 'Classic Oxford Shirt',
                'category': 'Clothing',
                'description': 'Versatile button-down long sleeve Oxford shirt in clean solid weave, perfect for professional or casual occasions.',
                'price': Decimal('44.99'),
                'stock': 22,
            },

            # Books
            {
                'name': 'Python Programming',
                'category': 'Books',
                'description': 'A comprehensive beginner to intermediate guide to Python syntax, object-oriented concepts, data structures, and web development with Django.',
                'price': Decimal('39.99'),
                'stock': 45,
            },
            {
                'name': 'Machine Learning Basics',
                'category': 'Books',
                'description': 'Clear, hands-on introduction to statistical learning, regression, classification, neural networks, and modern AI algorithms.',
                'price': Decimal('49.99'),
                'stock': 30,
            },
            {
                'name': 'Web Development Guide',
                'category': 'Books',
                'description': 'Master frontend and backend web architecture, modern HTML5 semantics, responsive CSS3 grids, vanilla JavaScript, and REST APIs.',
                'price': Decimal('34.99'),
                'stock': 25,
            },
            {
                'name': 'Data Structures & Algorithms',
                'category': 'Books',
                'description': 'Essential algorithmic thinking, big-O complexity analysis, linked lists, trees, graphs, sorting, and dynamic programming.',
                'price': Decimal('42.99'),
                'stock': 20,
            },

            # Home & Kitchen
            {
                'name': 'Coffee Mug',
                'category': 'Home & Kitchen',
                'description': '14oz handcrafted ceramic coffee mug with comfortable curved handle, matte ceramic glaze, and microwave/dishwasher-safe build.',
                'price': Decimal('12.99'),
                'stock': 75,
            },
            {
                'name': 'Water Bottle',
                'category': 'Home & Kitchen',
                'description': '32oz double-wall vacuum insulated stainless steel water bottle. Keeps drinks icy cold for 24 hours or piping hot for 12 hours.',
                'price': Decimal('18.99'),
                'stock': 55,
            },
            {
                'name': 'Table Lamp',
                'category': 'Home & Kitchen',
                'description': 'Minimalist Nordic desk lamp with touch-sensitive dimming, 3 color temperatures, and eye-caring warm diffused illumination.',
                'price': Decimal('32.99'),
                'stock': 15,
            },

            # Accessories
            {
                'name': 'Backpack',
                'category': 'Accessories',
                'description': 'Water-resistant city commuter backpack featuring a padded 15.6-inch laptop compartment, hidden anti-theft pocket, and luggage strap.',
                'price': Decimal('54.99'),
                'stock': 32,
            },
            {
                'name': 'Smart Watch',
                'category': 'Accessories',
                'description': 'Fitness and activity smartwatch with optical heart-rate monitoring, sleep tracking, pedometer, and 7-day battery endurance.',
                'price': Decimal('129.99'),
                'stock': 20,
            },
            {
                'name': 'Phone Stand',
                'category': 'Accessories',
                'description': 'Adjustable aerospace-grade aluminum desktop smartphone and tablet stand with anti-slip silicone pads and cable pass-through.',
                'price': Decimal('14.99'),
                'stock': 80,
            },
        ]

        for p_data in products_data:
            cat_obj = created_categories[p_data['category']]
            prod_obj, created = Product.objects.get_or_create(
                name=p_data['name'],
                category=cat_obj,
                defaults={
                    'slug': slugify(p_data['name']),
                    'description': p_data['description'],
                    'price': p_data['price'],
                    'stock': p_data['stock'],
                    'is_available': True,
                }
            )
            status_text = "Created" if created else "Found"
            self.stdout.write(f"  [{status_text}] Product: {prod_obj.name} (${prod_obj.price})")

        # 3. Create a Demo Test User for immediate evaluation
        demo_user, created_user = User.objects.get_or_create(
            username='demo',
            defaults={
                'email': 'demo@example.com',
                'first_name': 'Alex',
                'last_name': 'Morgan',
                'is_active': True,
            }
        )
        if created_user:
            demo_user.set_password('demo12345')
            demo_user.save()
            self.stdout.write(self.style.SUCCESS("  [Created] Demo user: 'demo' (password: 'demo12345')"))
        else:
            self.stdout.write("  [Found] Demo user: 'demo'")

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded database! Total categories: {Category.objects.count()}, Total products: {Product.objects.count()}"
        ))
