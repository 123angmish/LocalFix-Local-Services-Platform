export type Role = 'CUSTOMER' | 'PROVIDER' | 'VENDOR' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export interface VendorProfile {
  id: number;
  user: User;
  businessName: string;
  description?: string;
  city: string;
  address?: string;
  approved: boolean;
  rating: number;
  totalReviews: number;
}

export type BookingStatus =
  | 'REQUESTED'
  | 'MATCHING'
  | 'QUOTES_RECEIVED'
  | 'PROVIDER_SELECTED'
  | 'PENDING'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface Booking {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone?: string;
  vendorId: number;
  vendorBusinessName: string;
  serviceTitle: string;
  categoryName: string;
  bookingDate: string;
  timeSlot: string;
  address: string;
  notes?: string;
  status: BookingStatus;
  totalAmount: number;
  verificationCode?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  reviewed?: boolean;
}

export interface AIRecommendResponse {
  aiAvailable: boolean;
  statusMessage?: string;
  recommendedCategory?: string;
  likelyIssue?: string;
  possibleCauses?: string[];
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  recommendedTechnician?: string;
  estimatedDuration?: string;
  estimatedPriceRange?: string;
  reason?: string;
  disclaimer?: string;
}

export interface Appliance {
  id: number;
  name: string;
  brand?: string;
  model?: string;
  purchaseYear?: number;
  serialNumber?: string;
  createdAt: string;
}

export interface RepairPassport {
  id: number;
  appliance: Appliance;
  diagnosisSummary?: string;
  workSummary: string;
  totalSpent: number;
  partsReplacedCount: number;
  createdAt: string;
}

export interface WorkProof {
  id: number;
  bookingId: number;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  workPerformedNotes: string;
  labourCharge: number;
  partsCharge: number;
  createdAt: string;
}

export interface Warranty {
  id: number;
  bookingId: number;
  serviceName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'CLAIMED';
}

export interface Dispute {
  id: number;
  bookingId: number;
  reason: string;
  description: string;
  evidenceUrl?: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}
