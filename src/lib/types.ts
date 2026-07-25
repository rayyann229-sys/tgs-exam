export type Role = 'admin' | 'staff' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  addons?: string[];
  notes?: string;
}

export type OrderType = 'Delivery' | 'Takeaway' | 'Dine-In';
export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'JazzCash' | 'EasyPaisa' | 'Card';
export type PaymentStatus = 'Pending' | 'Paid';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MenuCategory = 
  | 'Burgers' 
  | 'Shawarma & Rolls' 
  | 'Pizza' 
  | 'Loaded Fries' 
  | 'Fried Chicken & Broast' 
  | 'Beverages & Chai' 
  | 'Desserts & Waffles';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // PKR
  category: MenuCategory;
  image: string;
  isAvailable: boolean;
  isBestseller?: boolean;
  spicyLevel?: number; // 0 to 3
  preparationTime?: number; // minutes
  addons?: { name: string; price: number }[];
  createdAt: string;
  updatedAt: string;
}

export type SeatingArea = 'Main Hall' | 'Family Section' | 'VIP Lounge' | 'Outdoor Terrace';
export type ReservationStatus = 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled';

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestCount: number;
  reservationDate: string;
  reservationTime: string;
  seatingArea: SeatingArea;
  specialRequests?: string;
  status: ReservationStatus;
  tableNumber?: string;
  createdAt: string;
}

export type StaffRole = 'Manager' | 'Head Chef' | 'Cashier' | 'Delivery Rider' | 'Waiter';
export type StaffStatus = 'Active' | 'On Leave' | 'Inactive';
export type ShiftType = 'Morning' | 'Evening' | 'Night';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  salary: number; // PKR
  status: StaffStatus;
  shift: ShiftType;
  joinedDate: string;
}

export type InventoryCategory = 'Meat & Poultry' | 'Dairy' | 'Bakery' | 'Beverages' | 'Produce' | 'Packaging';

export interface InventoryItem {
  id: string;
  itemName: string;
  category: InventoryCategory;
  quantity: number;
  unit: 'kg' | 'packs' | 'liters' | 'units' | 'boxes';
  minThreshold: number;
  costPerUnit: number; // PKR
  supplier: string;
  lastRestocked: string;
}

export type ReviewStatus = 'Published' | 'Pending' | 'Hidden';

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  reviewText: string;
  favoriteItem?: string;
  verifiedPurchase: boolean;
  status: ReviewStatus;
  replyText?: string;
  createdAt: string;
}

export interface CafeInfo {
  isOpen: boolean;
  announcement: string;
  contactPhone: string;
  whatsappPhone: string;
  address: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  openingHours: string;
}

export interface DatabaseSchema {
  cafeInfo: CafeInfo;
  users: User[];
  menuItems: MenuItem[];
  orders: Order[];
  reservations: Reservation[];
  staff: StaffMember[];
  inventory: InventoryItem[];
  reviews: Review[];
}
