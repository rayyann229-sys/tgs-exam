import fs from 'fs';
import path from 'path';
import { DatabaseSchema, MenuItem, Order, Reservation, StaffMember, InventoryItem, Review, CafeInfo } from './types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const INITIAL_DATA: DatabaseSchema = {
  cafeInfo: {
    isOpen: true,
    announcement: "🔥 Midnight Craving Sale! Open until 2:00 AM daily in Pasrur. Free delivery on orders over Rs. 1,500!",
    contactPhone: "+92 327 7552400",
    whatsappPhone: "+92 327 7552400",
    address: "Main Pasrur-Sialkot Road, Near Govt College",
    city: "Pasrur",
    district: "Sialkot",
    province: "Punjab",
    postalCode: "51480",
    openingHours: "12:00 PM – 2:00 AM Daily"
  },
  users: [
    {
      id: "usr_admin",
      email: "admin@ifficafe.pk",
      name: "Iftikhar 'Iffi' Ahmad",
      role: "admin",
      phone: "+92 327 7552400",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
    },
    {
      id: "usr_cashier",
      email: "cashier@ifficafe.pk",
      name: "Usman Raza",
      role: "staff",
      phone: "+92 324 5588771",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
    },
    {
      id: "usr_customer",
      email: "customer@ifficafe.pk",
      name: "Chaudhry Hamza",
      role: "customer",
      phone: "+92 300 6842190",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250"
    }
  ],
  menuItems: [
    {
      id: "menu-01",
      name: "Iffi Special Beef Smash Burger",
      description: "Juicy double beef patty smashed to perfection with melted cheddar, caramelized onions, jalapeños, and signature Iffi secret sauce on a toasted brioche bun.",
      price: 850,
      category: "Burgers",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 1,
      preparationTime: 15,
      addons: [
        { name: "Extra Cheddar Slice", price: 90 },
        { name: "Double Patty Booster", price: 320 },
        { name: "Crispy Bacon Bite (Halal)", price: 120 }
      ],
      createdAt: "2026-07-01T10:00:00.000Z",
      updatedAt: "2026-07-01T10:00:00.000Z"
    },
    {
      id: "menu-02",
      name: "Pasrur Crunch Zinger Burger",
      description: "Extra crispy hand-breaded spiced chicken fillet, fresh iceberg lettuce, and garlic mayo served on a toasted sesame brioche bun.",
      price: 550,
      category: "Burgers",
      image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 2,
      preparationTime: 12,
      addons: [
        { name: "Extra Cheese", price: 80 },
        { name: "Jalapeno Sauce Shot", price: 50 }
      ],
      createdAt: "2026-07-01T10:00:00.000Z",
      updatedAt: "2026-07-01T10:00:00.000Z"
    },
    {
      id: "menu-03",
      name: "Crown Crust Chicken Tikka Pizza (Large)",
      description: "Signature Pasrur pizza loaded with spicy chicken tikka chunks, bell peppers, onions, mozzarella, and a delicious cheese-filled crown crust.",
      price: 1350,
      category: "Pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 2,
      preparationTime: 20,
      addons: [
        { name: "Extra Mozzarella Cheese", price: 200 },
        { name: "Dip Sauce (Garlic Mayo / Ranch)", price: 70 }
      ],
      createdAt: "2026-07-02T10:00:00.000Z",
      updatedAt: "2026-07-02T10:00:00.000Z"
    },
    {
      id: "menu-04",
      name: "Arabian Special Chicken Shawarma",
      description: "Authentic slow-roasted shredded chicken, authentic Lebanese toum garlic sauce, and pickles folded in fresh warm pita bread.",
      price: 280,
      category: "Shawarma & Rolls",
      image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 1,
      preparationTime: 8,
      addons: [
        { name: "Extra Chicken", price: 90 },
        { name: "Cheese Slice", price: 60 }
      ],
      createdAt: "2026-07-02T10:00:00.000Z",
      updatedAt: "2026-07-02T10:00:00.000Z"
    },
    {
      id: "menu-05",
      name: "Fiery Jalapeno Cheese Loaded Fries",
      description: "Crispy crinkle fries loaded with warm liquid cheddar, sliced jalapeños, crispy tender chicken chunks, and chipotle ranch drizzle.",
      price: 480,
      category: "Loaded Fries",
      image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 2,
      preparationTime: 10,
      addons: [
        { name: "Extra Cheese Lava", price: 120 },
        { name: "Extra Jalapeño Slices", price: 50 }
      ],
      createdAt: "2026-07-03T10:00:00.000Z",
      updatedAt: "2026-07-03T10:00:00.000Z"
    },
    {
      id: "menu-06",
      name: "Crispy Fried Chicken Broast (2 Pcs)",
      description: "Two crispy Golden Broast chicken pieces (Leg & Thigh) served with signature garlic dip, fresh dinner roll, and salted fries.",
      price: 590,
      category: "Fried Chicken & Broast",
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: false,
      spicyLevel: 1,
      preparationTime: 18,
      addons: [
        { name: "Extra Garlic Dip", price: 50 },
        { name: "Dinner Roll", price: 40 }
      ],
      createdAt: "2026-07-03T10:00:00.000Z",
      updatedAt: "2026-07-03T10:00:00.000Z"
    },
    {
      id: "menu-07",
      name: "Special Zinger Cheese Paratha Roll",
      description: "Golden crispy zinger strip wrapped inside a flaky layered paratha with mint chutney, mayo, and shredded cabbage.",
      price: 380,
      category: "Shawarma & Rolls",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 2,
      preparationTime: 10,
      addons: [
        { name: "Extra Cheese", price: 60 }
      ],
      createdAt: "2026-07-04T10:00:00.000Z",
      updatedAt: "2026-07-04T10:00:00.000Z"
    },
    {
      id: "menu-08",
      name: "Karak Doodh Patti Chai",
      description: "Pasrur's favorite slow-brewed cardamom tea prepared with fresh buffalo milk and premium tea leaves.",
      price: 150,
      category: "Beverages & Chai",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 0,
      preparationTime: 5,
      addons: [
        { name: "Gur (Jaggery) Twist", price: 30 }
      ],
      createdAt: "2026-07-04T10:00:00.000Z",
      updatedAt: "2026-07-04T10:00:00.000Z"
    },
    {
      id: "menu-09",
      name: "Fresh Mint Margarita Mocktail",
      description: "Chilled blended ice drink made with fresh mint leaves, lemon juice, black salt, and sparkling soda.",
      price: 320,
      category: "Beverages & Chai",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 0,
      preparationTime: 5,
      createdAt: "2026-07-05T10:00:00.000Z",
      updatedAt: "2026-07-05T10:00:00.000Z"
    },
    {
      id: "menu-10",
      name: "Nutella Belgian Waffle Supreme",
      description: "Freshly baked golden waffle loaded with real Nutella spread, crushed hazelnuts, and topped with a scoop of creamy vanilla ice cream.",
      price: 580,
      category: "Desserts & Waffles",
      image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: true,
      spicyLevel: 0,
      preparationTime: 12,
      addons: [
        { name: "Extra Scoop Vanilla Ice Cream", price: 100 }
      ],
      createdAt: "2026-07-05T10:00:00.000Z",
      updatedAt: "2026-07-05T10:00:00.000Z"
    },
    {
      id: "menu-11",
      name: "Cold Coffee with Ice Cream",
      description: "Rich double espresso shot blended with ice, milk, cocoa powder, and topped with chocolate fudge sauce and vanilla scoop.",
      price: 390,
      category: "Beverages & Chai",
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: false,
      spicyLevel: 0,
      preparationTime: 6,
      createdAt: "2026-07-06T10:00:00.000Z",
      updatedAt: "2026-07-06T10:00:00.000Z"
    },
    {
      id: "menu-12",
      name: "Cheesy Fajita Pizza (Medium)",
      description: "Smoky grilled fajita chicken, sweet corn, onions, green pepper, and melted mozzarella cheese.",
      price: 980,
      category: "Pizza",
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=600",
      isAvailable: true,
      isBestseller: false,
      spicyLevel: 1,
      preparationTime: 18,
      createdAt: "2026-07-06T10:00:00.000Z",
      updatedAt: "2026-07-06T10:00:00.000Z"
    }
  ],
  orders: [
    {
      id: "ORD-8401",
      customerName: "Muhammad Usman",
      customerPhone: "0300-6842190",
      orderType: "Delivery",
      deliveryAddress: "House 42, College Road, Near Govt College, Pasrur",
      items: [
        {
          menuItemId: "menu-02",
          name: "Pasrur Crunch Zinger Burger",
          quantity: 2,
          unitPrice: 550,
          addons: ["Extra Cheese"]
        },
        {
          menuItemId: "menu-09",
          name: "Fresh Mint Margarita Mocktail",
          quantity: 2,
          unitPrice: 320
        }
      ],
      subtotal: 1740,
      tax: 0,
      deliveryFee: 100,
      totalAmount: 1840,
      status: "Completed",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      notes: "Please deliver near main gate.",
      createdAt: "2026-07-25T14:10:00.000Z",
      updatedAt: "2026-07-25T14:40:00.000Z"
    },
    {
      id: "ORD-8402",
      customerName: "Chaudhry Hamza",
      customerPhone: "0321-7481920",
      orderType: "Dine-In",
      tableNumber: "Table 4",
      items: [
        {
          menuItemId: "menu-01",
          name: "Iffi Special Beef Smash Burger",
          quantity: 1,
          unitPrice: 850,
          addons: ["Extra Cheddar Slice"]
        },
        {
          menuItemId: "menu-05",
          name: "Fiery Jalapeno Cheese Loaded Fries",
          quantity: 1,
          unitPrice: 480
        }
      ],
      subtotal: 1420,
      tax: 0,
      deliveryFee: 0,
      totalAmount: 1420,
      status: "Preparing",
      paymentMethod: "Cash",
      paymentStatus: "Pending",
      notes: "Extra sauce on burger please.",
      createdAt: "2026-07-25T15:00:00.000Z",
      updatedAt: "2026-07-25T15:05:00.000Z"
    },
    {
      id: "ORD-8403",
      customerName: "Ayesha Malik",
      customerPhone: "0312-5593810",
      orderType: "Takeaway",
      items: [
        {
          menuItemId: "menu-03",
          name: "Crown Crust Chicken Tikka Pizza (Large)",
          quantity: 1,
          unitPrice: 1350
        },
        {
          menuItemId: "menu-11",
          name: "Cold Coffee with Ice Cream",
          quantity: 2,
          unitPrice: 390
        }
      ],
      subtotal: 2130,
      tax: 0,
      deliveryFee: 0,
      totalAmount: 2130,
      status: "Ready",
      paymentMethod: "JazzCash",
      paymentStatus: "Paid",
      notes: "Customer arriving in 10 mins.",
      createdAt: "2026-07-25T15:15:00.000Z",
      updatedAt: "2026-07-25T15:25:00.000Z"
    },
    {
      id: "ORD-8404",
      customerName: "Zain Ali",
      customerPhone: "0333-8120033",
      orderType: "Delivery",
      deliveryAddress: "Street 3, Circular Road, Housing Colony, Pasrur",
      items: [
        {
          menuItemId: "menu-04",
          name: "Arabian Special Chicken Shawarma",
          quantity: 3,
          unitPrice: 280
        },
        {
          menuItemId: "menu-08",
          name: "Karak Doodh Patti Chai",
          quantity: 3,
          unitPrice: 150
        }
      ],
      subtotal: 1290,
      tax: 0,
      deliveryFee: 100,
      totalAmount: 1390,
      status: "Pending",
      paymentMethod: "EasyPaisa",
      paymentStatus: "Pending",
      notes: "Make tea extra strong.",
      createdAt: "2026-07-25T15:30:00.000Z",
      updatedAt: "2026-07-25T15:30:00.000Z"
    }
  ],
  reservations: [
    {
      id: "RES-201",
      customerName: "Bilal Ahmad",
      customerPhone: "0302-8812903",
      customerEmail: "bilal.pasrur@gmail.com",
      guestCount: 4,
      reservationDate: "2026-07-25",
      reservationTime: "20:30",
      seatingArea: "Family Section",
      specialRequests: "Anniversary dinner table arrangement.",
      status: "Confirmed",
      tableNumber: "F-2",
      createdAt: "2026-07-24T18:00:00.000Z"
    },
    {
      id: "RES-202",
      customerName: "Dr. Tariq Mahmood",
      customerPhone: "0322-9901122",
      customerEmail: "tariq.m@yahoo.com",
      guestCount: 6,
      reservationDate: "2026-07-25",
      reservationTime: "21:00",
      seatingArea: "VIP Lounge",
      specialRequests: "Quiet corner table for guest delegation.",
      status: "Checked-In",
      tableNumber: "VIP-1",
      createdAt: "2026-07-25T11:00:00.000Z"
    },
    {
      id: "RES-203",
      customerName: "Sadaf Rehan",
      customerPhone: "0345-4421098",
      guestCount: 2,
      reservationDate: "2026-07-26",
      reservationTime: "19:00",
      seatingArea: "Outdoor Terrace",
      specialRequests: "High table near outdoor lights.",
      status: "Confirmed",
      tableNumber: "T-5",
      createdAt: "2026-07-25T13:20:00.000Z"
    }
  ],
  staff: [
    {
      id: "STF-01",
      name: "Iftikhar 'Iffi' Ahmad",
      role: "Manager",
      phone: "+92 327 7552400",
      email: "iffi@ifficafe.pk",
      salary: 120000,
      status: "Active",
      shift: "Evening",
      joinedDate: "2023-01-15"
    },
    {
      id: "STF-02",
      name: "Shahid Iqbal",
      role: "Head Chef",
      phone: "0301-4433211",
      email: "shahid.chef@ifficafe.pk",
      salary: 65000,
      status: "Active",
      shift: "Evening",
      joinedDate: "2023-05-10"
    },
    {
      id: "STF-03",
      name: "Usman Raza",
      role: "Cashier",
      phone: "0324-5588771",
      email: "usman.pos@ifficafe.pk",
      salary: 40000,
      status: "Active",
      shift: "Night",
      joinedDate: "2024-02-01"
    },
    {
      id: "STF-04",
      name: "Ali Nawaz",
      role: "Delivery Rider",
      phone: "0315-7766221",
      email: "ali.rider@ifficafe.pk",
      salary: 35000,
      status: "Active",
      shift: "Evening",
      joinedDate: "2024-06-15"
    }
  ],
  inventory: [
    {
      id: "INV-01",
      itemName: "Boneless Chicken Breast",
      category: "Meat & Poultry",
      quantity: 42,
      unit: "kg",
      minThreshold: 15,
      costPerUnit: 780,
      supplier: "Sialkot Fresh Poultry Farms",
      lastRestocked: "2026-07-24"
    },
    {
      id: "INV-02",
      itemName: "Mozzarella & Cheddar Blend",
      category: "Dairy",
      quantity: 26,
      unit: "kg",
      minThreshold: 10,
      costPerUnit: 1850,
      supplier: "Gourmet Dairy Pasrur",
      lastRestocked: "2026-07-22"
    },
    {
      id: "INV-03",
      itemName: "Sesame Brioche Burger Buns",
      category: "Bakery",
      quantity: 110,
      unit: "packs",
      minThreshold: 30,
      costPerUnit: 190,
      supplier: "Pasrur Craft Bakers",
      lastRestocked: "2026-07-25"
    },
    {
      id: "INV-04",
      itemName: "Fresh Mint & Lemons",
      category: "Produce",
      quantity: 8,
      unit: "kg",
      minThreshold: 3,
      costPerUnit: 240,
      supplier: "Pasrur Fruit & Vegetable Market",
      lastRestocked: "2026-07-25"
    },
    {
      id: "INV-05",
      itemName: "Premium Tea Leaves (Karak Blend)",
      category: "Beverages",
      quantity: 14,
      unit: "kg",
      minThreshold: 5,
      costPerUnit: 1250,
      supplier: "Punjab Tea Merchants",
      lastRestocked: "2026-07-20"
    },
    {
      id: "INV-06",
      itemName: "Pure Buffalo Milk",
      category: "Dairy",
      quantity: 6,
      unit: "liters",
      minThreshold: 10,
      costPerUnit: 220,
      supplier: "Chaudhry Dairy Farm Pasrur",
      lastRestocked: "2026-07-25"
    }
  ],
  reviews: [
    {
      id: "REV-101",
      customerName: "Dr. Kashif Saeed",
      rating: 5,
      reviewText: "Best Zinger burger and Mint Margarita in Pasrur hands down! Clean environment, prompt service, and amazing taste.",
      favoriteItem: "Pasrur Crunch Zinger Burger",
      verifiedPurchase: true,
      status: "Published",
      replyText: "Thank you Dr. Kashif! Always a pleasure serving you at Iffi Cafe Pasrur.",
      createdAt: "2026-07-20T19:30:00.000Z"
    },
    {
      id: "REV-102",
      customerName: "Maryam Fatima",
      rating: 5,
      reviewText: "The Crown Crust Pizza was piping hot, loaded with chicken tikka, and super cheesy. Excellent family dining section!",
      favoriteItem: "Crown Crust Chicken Tikka Pizza",
      verifiedPurchase: true,
      status: "Published",
      replyText: "JazakAllah Maryam! So happy your family enjoyed the dining experience.",
      createdAt: "2026-07-22T20:15:00.000Z"
    },
    {
      id: "REV-103",
      customerName: "Hamza Gujjar",
      rating: 5,
      reviewText: "The Smash burger is loaded with flavor! And having Karak Chai available at 1:00 AM in Pasrur is a lifesaver.",
      favoriteItem: "Iffi Special Beef Smash Burger",
      verifiedPurchase: true,
      status: "Published",
      replyText: "Thanks Hamza! We're open till 2 AM every night for late night cravings!",
      createdAt: "2026-07-24T23:45:00.000Z"
    }
  ]
};

// Ensure database directory exists
function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Read database
export function getDb(): DatabaseSchema {
  try {
    ensureDirectoryExistence(DB_FILE);
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    if (!raw.trim()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    return JSON.parse(raw) as DatabaseSchema;
  } catch (error) {
    console.error('Database read error, falling back to initial data:', error);
    return INITIAL_DATA;
  }
}

// Save database
export function saveDb(data: DatabaseSchema): void {
  try {
    ensureDirectoryExistence(DB_FILE);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Database write error:', error);
  }
}
