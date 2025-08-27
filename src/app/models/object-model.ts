export interface product {
  id: number | string;
  name: string;
  uploadPhoto: string;
  productDesc: string;
  category:string;
  price: number;
  sellerId: number | string;
}

export interface cart{
 id: number | string;
  product: product;  
  quantity: number;
  userId: number | string;   
  appliedPromoCode?: string;
  discountAmount?: number;
}

export interface promoCode {
  id: number | string;
  code: string;
  discountPercentage: number;
  validFrom: Date;
  validUntil: Date;
  maxUses: number;
  currentUses: number;
  sellerId: number | string;
  isActive: boolean;
}

export interface order {
  id?: number | string; 
  email: string;
  address: string;
  contact: string;
  totalPrice: number;
  userId: number | string;
  items: cart[];
  paymentMethod: string;
  orderDate?: string; 
  status?: string; 
}

export interface wishlist{
  id: number | string;
  product: product;  
  userId: number | string;  
}

