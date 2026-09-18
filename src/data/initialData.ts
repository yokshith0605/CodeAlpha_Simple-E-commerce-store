import { Category, Product, UserAccount } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Smart devices, audio equipment, chargers, and premium personal tech accessories.',
    icon: '📱'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Comfortable everyday apparel, high-quality cotton tees, and stylish casual wear.',
    icon: '👕'
  },
  {
    id: 'books',
    name: 'Books',
    slug: 'books',
    description: 'Educational guides, computer science books, algorithms, and practical programming manuals.',
    icon: '📚'
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Modern living essentials, ceramic drinkware, desk lamps, and hydration bottles.',
    icon: '☕'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Everyday carry items, durable backpacks, smart wearables, and phone stands.',
    icon: '🎒'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Electronics
  {
    id: 1,
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    categoryId: 'electronics',
    categoryName: 'Electronics',
    description: 'High-fidelity over-ear Bluetooth headphones with active noise cancelling, plush memory foam earcups, and 30-hour battery life.',
    price: 89.99,
    stock: 25,
    isAvailable: true,
    rating: 4.8,
    badge: 'Best Seller',
    specs: ['Bluetooth 5.3', '30-Hour Battery', 'Active Noise Cancelling', 'USB-C Fast Charging']
  },
  {
    id: 2,
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    categoryId: 'electronics',
    categoryName: 'Electronics',
    description: 'Portable IPX7 waterproof Bluetooth speaker delivering 360-degree sound with deep bass and 15-hour playback on a single charge.',
    price: 49.99,
    stock: 30,
    isAvailable: true,
    rating: 4.6,
    specs: ['IPX7 Waterproof', '15-Hour Playtime', '360° Omnidirectional Audio', 'Built-in Mic']
  },
  {
    id: 3,
    name: 'USB-C Charger',
    slug: 'usb-c-charger',
    categoryId: 'electronics',
    categoryName: 'Electronics',
    description: '65W GaN dual-port fast wall charger with Power Delivery 3.0, compatible with laptops, tablets, and smartphones.',
    price: 19.99,
    stock: 50,
    isAvailable: true,
    rating: 4.9,
    specs: ['65W GaN Technology', 'Dual USB-C & USB-A', 'Power Delivery 3.0', 'Foldable Plug']
  },
  {
    id: 4,
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    categoryId: 'electronics',
    categoryName: 'Electronics',
    description: 'Ergonomic 2.4GHz wireless optical mouse with whisper-quiet clicks, adjustable DPI up to 2400, and long battery standby.',
    price: 29.99,
    stock: 40,
    isAvailable: true,
    rating: 4.5,
    specs: ['2.4GHz Wireless & Bluetooth', 'Adjustable 800-2400 DPI', 'Silent Click Switches', '18-Month Battery']
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    categoryId: 'electronics',
    categoryName: 'Electronics',
    description: 'Tenkeyless mechanical gaming and typing keyboard with tactile switches, customizable white LED backlighting, and durable PBT keycaps.',
    price: 79.99,
    stock: 18,
    isAvailable: true,
    rating: 4.7,
    badge: 'Popular',
    specs: ['Tactile Brown Switches', 'TKL 87-Key Layout', 'Double-shot PBT Keycaps', 'Detachable Type-C Cable']
  },

  // Clothing
  {
    id: 6,
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    categoryId: 'clothing',
    categoryName: 'Clothing',
    description: '100% premium combed organic cotton crewneck t-shirt. Breathable, pre-shrunk fabric tailored for all-day comfort.',
    price: 24.99,
    stock: 60,
    isAvailable: true,
    rating: 4.7,
    specs: ['100% Organic Combed Cotton', 'Pre-shrunk Fabric', 'Ribbed Crewneck', 'Machine Wash Safe']
  },
  {
    id: 7,
    name: 'Casual Hoodie',
    slug: 'casual-hoodie',
    categoryId: 'clothing',
    categoryName: 'Clothing',
    description: 'Heavyweight fleece hooded sweatshirt with kangaroo pocket, double-lined hood, and matching ribbed cuffs and waistband.',
    price: 49.99,
    stock: 35,
    isAvailable: true,
    rating: 4.8,
    badge: 'Trending',
    specs: ['350 GSM Heavy Fleece', 'Double-Layered Hood', 'Roomy Front Pocket', 'Pre-washed Finish']
  },
  {
    id: 8,
    name: 'Denim Jeans',
    slug: 'denim-jeans',
    categoryId: 'clothing',
    categoryName: 'Clothing',
    description: 'Classic straight-fit stretch denim jeans crafted with 98% cotton and 2% elastane for optimal flexibility and durability.',
    price: 59.99,
    stock: 28,
    isAvailable: true,
    rating: 4.4,
    specs: ['98% Cotton / 2% Elastane', 'Reinforced Rivets', 'Straight Leg Cut', 'Brass YKK Zipper']
  },
  {
    id: 9,
    name: 'Classic Oxford Shirt',
    slug: 'classic-oxford-shirt',
    categoryId: 'clothing',
    categoryName: 'Clothing',
    description: 'Versatile button-down long sleeve Oxford shirt in clean solid weave, perfect for professional or casual occasions.',
    price: 44.99,
    stock: 22,
    isAvailable: true,
    rating: 4.6,
    specs: ['100% Oxford Pinpoint Weave', 'Button-Down Collar', 'Adjustable Cuffs', 'Wrinkle Resistant']
  },

  // Books
  {
    id: 10,
    name: 'Python Programming',
    slug: 'python-programming',
    categoryId: 'books',
    categoryName: 'Books',
    description: 'A comprehensive beginner to intermediate guide to Python syntax, object-oriented concepts, data structures, and web development with Django.',
    price: 39.99,
    stock: 45,
    isAvailable: true,
    rating: 4.9,
    badge: 'Recommended',
    specs: ['520 Pages', 'Includes Full Django Tutorial', 'Code Downloads Available', 'Paperback 2nd Edition']
  },
  {
    id: 11,
    name: 'Machine Learning Basics',
    slug: 'machine-learning-basics',
    categoryId: 'books',
    categoryName: 'Books',
    description: 'Clear, hands-on introduction to statistical learning, regression, classification, neural networks, and modern AI algorithms.',
    price: 49.99,
    stock: 30,
    isAvailable: true,
    rating: 4.8,
    specs: ['440 Pages', 'Hands-on Python & PyTorch', 'Full-Color Math Diagrams', 'Practice Problem Sets']
  },
  {
    id: 12,
    name: 'Web Development Guide',
    slug: 'web-development-guide',
    categoryId: 'books',
    categoryName: 'Books',
    description: 'Master frontend and backend web architecture, modern HTML5 semantics, responsive CSS3 grids, vanilla JavaScript, and REST APIs.',
    price: 34.99,
    stock: 25,
    isAvailable: true,
    rating: 4.7,
    specs: ['480 Pages', 'Semantic HTML5 & Modern CSS', 'REST API Architecture', 'Complete Capstone Projects']
  },
  {
    id: 13,
    name: 'Data Structures & Algorithms',
    slug: 'data-structures-algorithms',
    categoryId: 'books',
    categoryName: 'Books',
    description: 'Essential algorithmic thinking, big-O complexity analysis, linked lists, trees, graphs, sorting, and dynamic programming.',
    price: 42.99,
    stock: 20,
    isAvailable: true,
    rating: 4.9,
    specs: ['600 Pages', 'Step-by-Step Proofs & Traces', 'Interview Question Prep', 'Hardcover Edition']
  },

  // Home & Kitchen
  {
    id: 14,
    name: 'Coffee Mug',
    slug: 'coffee-mug',
    categoryId: 'home-kitchen',
    categoryName: 'Home & Kitchen',
    description: '14oz handcrafted ceramic coffee mug with comfortable curved handle, matte ceramic glaze, and microwave/dishwasher-safe build.',
    price: 12.99,
    stock: 75,
    isAvailable: true,
    rating: 4.8,
    specs: ['14 oz / 415 ml Capacity', 'Lead-Free Stoneware Ceramic', 'Dishwasher Safe', 'Microwave Safe']
  },
  {
    id: 15,
    name: 'Water Bottle',
    slug: 'water-bottle',
    categoryId: 'home-kitchen',
    categoryName: 'Home & Kitchen',
    description: '32oz double-wall vacuum insulated stainless steel water bottle. Keeps drinks icy cold for 24 hours or piping hot for 12 hours.',
    price: 18.99,
    stock: 55,
    isAvailable: true,
    rating: 4.7,
    specs: ['32 oz / 950 ml', '18/8 Pro Grade Stainless Steel', 'Cold 24h / Hot 12h', 'BPA-Free Leakproof Lid']
  },
  {
    id: 16,
    name: 'Table Lamp',
    slug: 'table-lamp',
    categoryId: 'home-kitchen',
    categoryName: 'Home & Kitchen',
    description: 'Minimalist Nordic desk lamp with touch-sensitive dimming, 3 color temperatures, and eye-caring warm diffused illumination.',
    price: 32.99,
    stock: 15,
    isAvailable: true,
    rating: 4.6,
    specs: ['3 Color Temperatures (3000K-6000K)', 'Touch Stepless Dimming', 'USB Charging Port Base', 'Flicker-Free Eye Care']
  },

  // Accessories
  {
    id: 17,
    name: 'Backpack',
    slug: 'backpack',
    categoryId: 'accessories',
    categoryName: 'Accessories',
    description: 'Water-resistant city commuter backpack featuring a padded 15.6-inch laptop compartment, hidden anti-theft pocket, and luggage strap.',
    price: 54.99,
    stock: 32,
    isAvailable: true,
    rating: 4.9,
    badge: 'Staff Pick',
    specs: ['Fits up to 15.6" Laptop', 'Water-Repellent Oxford Fabric', 'Anti-Theft Hidden Pocket', 'External USB Port']
  },
  {
    id: 18,
    name: 'Smart Watch',
    slug: 'smart-watch',
    categoryId: 'accessories',
    categoryName: 'Accessories',
    description: 'Fitness and activity smartwatch with optical heart-rate monitoring, sleep tracking, pedometer, and 7-day battery endurance.',
    price: 129.99,
    stock: 20,
    isAvailable: true,
    rating: 4.5,
    specs: ['1.4" AMOLED Display', 'Heart-Rate & SpO2 Tracking', '5ATM Water Resistance', '7-Day Battery Life']
  },
  {
    id: 19,
    name: 'Phone Stand',
    slug: 'phone-stand',
    categoryId: 'accessories',
    categoryName: 'Accessories',
    description: 'Adjustable aerospace-grade aluminum desktop smartphone and tablet stand with anti-slip silicone pads and cable pass-through.',
    price: 14.99,
    stock: 80,
    isAvailable: true,
    rating: 4.8,
    specs: ['Solid Aluminum Alloy', '270° Dual-Hinge Rotation', 'Anti-Slip Silicone Pads', 'Cable Routing Slot']
  }
];

export const DEMO_USERS: UserAccount[] = [
  {
    id: 'user-demo-1',
    username: 'demo',
    email: 'demo@example.com',
    firstName: 'Alex',
    lastName: 'Morgan',
    role: 'customer',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704'
  },
  {
    id: 'user-admin-1',
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'Manager',
    role: 'admin',
    phone: '+1 (555) 999-0000',
    address: '100 University Plaza, Dept CS',
    city: 'Cambridge',
    state: 'MA',
    postalCode: '02138'
  }
];
