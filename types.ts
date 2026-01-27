
export enum MainCategory {
  TOPS = '上装',
  BOTTOMS = '下装',
  SHOES = '鞋子',
  BAGS = '包包',
  ACCESSORIES = '配饰'
}

export interface ClosetItem {
  id: string;
  name: string;
  mainCategory: MainCategory;
  subCategory: string;
  imageUrl: string;
  color?: string;
  style?: string;
  brand?: string;
  price?: string;
  purchaseDate?: string;
  purchaseChannel?: string;
  size?: string;
  tags?: string[];
  createdAt: number;
}

export interface OutfitItemPosition {
  itemId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[]; 
  positions?: OutfitItemPosition[];
  imageUrl?: string;
  createdAt: number;
}

export interface CategoryDefinition {
  type: MainCategory;
  subCategories: string[];
  icon: string;
}

export interface BodyProfile {
  height?: string;
  weight?: string;
  shoulder?: string;
  chest?: string;
  waist?: string;
  hips?: string;
}
