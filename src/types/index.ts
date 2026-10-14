export type PostType = 'surplus' | 'request';

export type PosterType =
  | 'restaurant'
  | 'mess'
  | 'darshini'
  | 'sweetstall'
  | 'resident'
  | 'mandi';

export type PricingType = 'free' | 'discount';

export type Category =
  | 'Home Cooked Meals'
  | 'Tiffin & Breakfast'
  | 'Rotis & Breads'
  | 'Mandi Sabzi & Fruits'
  | 'Dairy & Ration'
  | 'Mithai & Snacks'
  | 'Puja Prasadam'
  | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountType: 'resident' | 'restaurant' | 'mess' | 'darshini' | 'sweetstall' | 'mandi';
  locality: string;
  city: string;
  phone?: string;
  bringDabbaDefault?: boolean;
  createdAt: string;
}

export interface FoodListing {
  id: string;
  type: PostType;
  title: string;
  description: string;
  posterType: PosterType;
  posterName: string;
  posterRole: string;
  verifiedBusiness: boolean;
  price: number; // 0 for free, in INR (₹)
  originalPrice?: number;
  category: Category;
  quantity: string;
  quantityRemaining: number;
  initialQuantity: number;
  unit: string;
  imageUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  pickupWindow: string;
  expiresAt: string; // ISO string
  dietaryTags: string[]; // e.g. 'Pure Veg', 'Jain', 'Eggetarian', 'Halal', 'Vegan'
  storageInfo?: string;
  createdAt: string;
  claimedCount: number;
  urgency?: 'Immediate' | 'Today' | 'Flexible';
  contactPhone?: string;
  bringDabbaRecommended?: boolean;
}

export interface Claim {
  id: string;
  listingId: string;
  listingTitle: string;
  quantity: number;
  claimCode: string;
  claimedAt: string;
  pickupWindow: string;
  locationName: string;
  posterName: string;
  price: number;
  status: 'active' | 'collected' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  listingId: string;
  sender: 'user' | 'poster';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface NeighborhoodLocation {
  id: string;
  name: string;
  subdistrict: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
