export interface Service {
  id: number;
  name: string;
  description: string;
  depedensOnArea: number | null;
  featuredImage: CleanImage | null;
  images: CleanImage[];
  price: number;
  time: number;
  type: string | null;
  requirments: ServiceRequirements[];
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

export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  username: string;
  phone: string;
}

export interface Customer extends User {
  address: string;
}

export interface Cleaner extends User {
  rating: number;
  experience: number;
}

export type AnyUser = User | Customer | Cleaner;
