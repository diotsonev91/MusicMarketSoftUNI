import { Categories } from './ad_enums/categories.enum';
import { SubCategories } from './ad_enums/subCategories.enum';
import { DeliveryType } from './ad_enums/delivery-type.enum';
import { Condition } from './ad_enums/condition.enum';


export interface AdData {
    _id: string;
    title: string;
    description: string;
    adRate: number | null;
    price: number;
    deliveryType: DeliveryType;
    condition: Condition;
    category: Categories;
    subCategory: SubCategories;
    images: string[];
    instrument: string;
    userId: string;
    userName: string; 
    rating: number;
    createdAt: null;
    likes: null;
    location?: string;
  }