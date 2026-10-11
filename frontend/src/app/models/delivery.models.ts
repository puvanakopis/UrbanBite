import { Order } from './order.models';
import { User } from './auth.models';

export interface DeliveryAssignment {
  id: number;
  order: Order;
  deliveryPartner: User;
  status: 'ASSIGNED' | 'ACCEPTED' | 'AT_RESTAURANT' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'DECLINED';
  assignedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface EarningsSummary {
  completedDeliveries: number;
  totalEarnings: number;
  ratePerDelivery: number;
  activeTasks: number;
}
