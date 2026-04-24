import { CartLine } from "@/lib/store/cartStore";

export interface Service {
  id: number;
  name: string;
  categories: Category[];
  description: string;
  depedensOnArea: number | null;
  priceForAdditionalMeter: number | null;
  featuredImage: CleanImage | null;
  images: CleanImage[];
  price: number;
  time: number;
  type: string | null;
  requirments: ServiceRequirements[];
}

export interface Category {
  id: number;
  name: string;
}

export interface CleanImage {
  id: number;
  filename: string;
  url: string;
  alt: string;
}

export interface Inventory {
  id: number;
  featuredImage: CleanImage | null;
  name: string;
  description: string;
  unit: string;
  amount: number;
}

export interface ServiceRequirements {
  id: number;
  service?: Service;
  inventory?: Inventory;
  requiredAmount: number;
}
export interface UserAuthData {
  token: string;
  user: AnyUser;
}

export interface Person {
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string;
}

export interface User extends Person {
  id: number;
  username: string;
  roles: Role[];
}

export type Role = "ROLE_USER" | "ROLE_ADMIN" | "ROLE_CLEANER";

export interface Customer extends User {
  address: string;
}

export interface Cleaner extends User {
  rating: number;
  experience: number;
}

export type AnyUser = User | Customer | Cleaner;

export interface CleanerAvailabilitySlot {
  start: string;
  end: string;
  availableCleaners: number;
  totalPrice: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Order {
  id: number;
  customer: Customer;
  status: OrderStatus;
  totalPrice: number;
  totalTime: number;
  appointmentDate: string;
  items: CartLine[];
  cleaners: Cleaner[];
  requestedCleanerCount: number;
  address: string;
}

export interface TotalStatistics {
  title: string;
  subtitle: string;
}

export interface MonthlyOrders {
  month: string;
  orderCount: number;
}
