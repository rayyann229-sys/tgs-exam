import { User, Role } from './types';

export const DEMO_USERS: User[] = [
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
];

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('iffi_cafe_user');
  if (!stored) {
    // Default to admin for convenient evaluation or customer if browsing
    return DEMO_USERS[0]; 
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEMO_USERS[0];
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('iffi_cafe_user', JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('iffi_cafe_user');
}
