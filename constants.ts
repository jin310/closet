
import { MainCategory, CategoryDefinition } from './types.ts';

export const CATEGORIES: CategoryDefinition[] = [
  {
    type: MainCategory.TOPS,
    icon: '👕',
    subCategories: ['T恤', '衬衫', '毛衣', '夹克', '大衣', '卫衣']
  },
  {
    type: MainCategory.BOTTOMS,
    icon: '👖',
    subCategories: ['牛仔裤', '休闲裤', '短裤', '裙子', '西裤']
  },
  {
    type: MainCategory.SHOES,
    icon: '👟',
    subCategories: ['运动鞋', '靴子', '乐福鞋', '凉鞋', '皮鞋']
  },
  {
    type: MainCategory.BAGS,
    icon: '👜',
    subCategories: ['单肩包', '斜挎包', '手提包', '双肩包', '托特包']
  },
  {
    type: MainCategory.ACCESSORIES,
    icon: '🧣',
    subCategories: ['皮带', '帽子', '首饰', '围巾', '眼镜']
  }
];

export const MOCK_ITEMS: any[] = [
  {
    id: 'm1',
    name: '简约白色纯棉T恤',
    mainCategory: MainCategory.TOPS,
    subCategory: 'T恤',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    color: '白色',
    style: '简约',
    brand: 'Uniqlo',
    price: '99',
    purchaseDate: '2024-01-15',
    size: 'M',
    createdAt: Date.now() - 1000000
  },
  {
    id: 'm2',
    name: '复古高腰牛仔长裙',
    mainCategory: MainCategory.BOTTOMS,
    subCategory: '裙子',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
    color: '丹宁蓝',
    style: '复古',
    brand: 'Levi\'s',
    price: '499',
    purchaseDate: '2024-02-20',
    size: 'S',
    createdAt: Date.now() - 900000
  },
  {
    id: 'm3',
    name: '垂坠感直筒休闲裤',
    mainCategory: MainCategory.BOTTOMS,
    subCategory: '休闲裤',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
    color: '黑色',
    style: '通勤',
    brand: 'ZARA',
    price: '299',
    purchaseDate: '2024-03-05',
    size: 'L',
    createdAt: Date.now() - 800000
  },
  {
    id: 'm4',
    name: '经典款宽檐草帽',
    mainCategory: MainCategory.ACCESSORIES,
    subCategory: '帽子',
    imageUrl: 'https://images.unsplash.com/photo-1533441801552-47526839564d?q=80&w=800&auto=format&fit=crop',
    color: '米黄色',
    style: '度假',
    brand: 'Muji',
    price: '159',
    purchaseDate: '2023-07-12',
    size: '均码',
    createdAt: Date.now() - 700000
  },
  {
    id: 'm5',
    name: '真皮手提托特包',
    mainCategory: MainCategory.BAGS,
    subCategory: '托特包',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    color: '焦糖色',
    style: '极简',
    brand: 'Coach',
    price: '2400',
    purchaseDate: '2023-11-11',
    size: '中号',
    createdAt: Date.now() - 600000
  },
  {
    id: 'm6',
    name: '低帮复古运动鞋',
    mainCategory: MainCategory.SHOES,
    subCategory: '运动鞋',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    color: '红色',
    style: '街头',
    brand: 'Nike',
    price: '799',
    purchaseDate: '2024-04-01',
    size: '42',
    createdAt: Date.now() - 500000
  }
];
