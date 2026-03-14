import aloeVeraJuice from '@/assets/products/aloe-vera-juice.jpg';
import amlaJuice from '@/assets/products/amla-juice.jpg';
import ashwagandhaPowder from '@/assets/products/ashwagandha-powder.jpg';
import giloyJuice from '@/assets/products/giloy-juice.jpg';
import painReliefOil from '@/assets/products/pain-relief-oil.jpg';
import faceWash from '@/assets/products/face-wash.jpg';
import triphalaPowder from '@/assets/products/triphala-powder.jpg';
import wheatgrassJuice from '@/assets/products/wheatgrass-juice.jpg';
import hairOil from '@/assets/products/hair-oil.jpg';
import herbalTablets from '@/assets/products/herbal-tablets.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  type: string;
  healthCategory: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  badge?: string;
}

export const healthCategories = [
  'Immunity Wellness', 'Digestive Wellness', 'Diabetic Wellness', 'Cardiac Wellness',
  'Liver Wellness', 'Kidney Wellness', 'Brain Wellness', 'Eye Wellness',
  'Pain Relief', 'Skin Wellness', 'Hair Wellness', 'Blood Purifier',
  'Energy Booster', 'General Wellness', "Men's Wellness", "Women's Wellness"
];

export const productTypes = [
  'Wellness Juices', 'Herbal Powders', 'Tablets', 'Herbal Oils',
  'Skin Care', 'Combos', 'Syrup / Tonic', 'Herbal Soap'
];

export const products: Product[] = [
  {
    id: '1', name: 'Aloe Vera Juice', price: 299, originalPrice: 399,
    image: aloeVeraJuice, rating: 4.5, reviews: 234,
    category: 'Wellness Juices', type: 'Juice', healthCategory: 'Digestive Wellness',
    description: 'Pure Aloe Vera juice for digestive health and skin glow. Made from organically grown Aloe Vera leaves.',
    ingredients: ['Aloe Vera Extract', 'Citric Acid', 'Sodium Benzoate'],
    benefits: ['Improves digestion', 'Boosts immunity', 'Promotes skin health', 'Detoxifies body'],
    usage: 'Take 30ml twice daily before meals with water.', badge: 'Bestseller'
  },
  {
    id: '2', name: 'Amla Juice', price: 249, originalPrice: 349,
    image: amlaJuice, rating: 4.7, reviews: 312,
    category: 'Wellness Juices', type: 'Juice', healthCategory: 'Immunity Wellness',
    description: 'Rich in Vitamin C, Amla Juice strengthens immunity and promotes overall wellness.',
    ingredients: ['Indian Gooseberry (Amla) Extract', 'Purified Water'],
    benefits: ['Rich in Vitamin C', 'Strengthens immunity', 'Improves hair health', 'Anti-aging properties'],
    usage: 'Take 20ml twice daily on an empty stomach.', badge: 'Popular'
  },
  {
    id: '3', name: 'Ashwagandha Powder', price: 349, originalPrice: 449,
    image: ashwagandhaPowder, rating: 4.8, reviews: 456,
    category: 'Herbal Powders', type: 'Powder', healthCategory: 'Energy Booster',
    description: 'Premium Ashwagandha root powder for stress relief and vitality.',
    ingredients: ['Withania Somnifera Root Powder'],
    benefits: ['Reduces stress & anxiety', 'Boosts energy', 'Improves sleep quality', 'Enhances muscle strength'],
    usage: 'Mix 1 teaspoon in warm milk and consume before bedtime.', badge: 'Top Rated'
  },
  {
    id: '4', name: 'Giloy Juice', price: 279, originalPrice: 379,
    image: giloyJuice, rating: 4.4, reviews: 189,
    category: 'Wellness Juices', type: 'Juice', healthCategory: 'Immunity Wellness',
    description: 'Giloy juice for boosting immunity and fighting infections naturally.',
    ingredients: ['Tinospora Cordifolia Extract', 'Purified Water'],
    benefits: ['Boosts immunity', 'Fights fever', 'Purifies blood', 'Manages diabetes'],
    usage: 'Take 20ml twice daily with equal amount of water.'
  },
  {
    id: '5', name: 'Pain Relief Oil', price: 199, originalPrice: 299,
    image: painReliefOil, rating: 4.3, reviews: 567,
    category: 'Herbal Oils', type: 'Oil', healthCategory: 'Pain Relief',
    description: 'Ayurvedic pain relief oil with eucalyptus and camphor for joint and muscle pain.',
    ingredients: ['Eucalyptus Oil', 'Camphor', 'Wintergreen Oil', 'Sesame Oil'],
    benefits: ['Relieves joint pain', 'Reduces muscle soreness', 'Anti-inflammatory', 'Improves blood circulation'],
    usage: 'Apply on affected area and massage gently. Use 2-3 times daily.', badge: 'Best Value'
  },
  {
    id: '6', name: 'Herbal Face Wash', price: 179, originalPrice: 249,
    image: faceWash, rating: 4.6, reviews: 345,
    category: 'Skin Care', type: 'Face Wash', healthCategory: 'Skin Wellness',
    description: 'Gentle herbal face wash with neem and tea tree for clear, radiant skin.',
    ingredients: ['Neem Extract', 'Tea Tree Oil', 'Aloe Vera', 'Turmeric'],
    benefits: ['Deep cleansing', 'Controls acne', 'Brightens skin', 'Natural antibacterial'],
    usage: 'Apply on wet face, massage gently, and rinse with water. Use twice daily.'
  },
  {
    id: '7', name: 'Triphala Powder', price: 229, originalPrice: 329,
    image: triphalaPowder, rating: 4.5, reviews: 278,
    category: 'Herbal Powders', type: 'Powder', healthCategory: 'Digestive Wellness',
    description: 'Traditional Triphala churna for digestive health and body detoxification.',
    ingredients: ['Haritaki', 'Bibhitaki', 'Amalaki'],
    benefits: ['Aids digestion', 'Natural detox', 'Improves eye health', 'Boosts metabolism'],
    usage: 'Mix 1 teaspoon in warm water. Take before bedtime.'
  },
  {
    id: '8', name: 'Wheatgrass Juice', price: 329, originalPrice: 429,
    image: wheatgrassJuice, rating: 4.6, reviews: 198,
    category: 'Wellness Juices', type: 'Juice', healthCategory: 'Blood Purifier',
    description: 'Fresh wheatgrass juice packed with chlorophyll for blood purification.',
    ingredients: ['Triticum Aestivum (Wheatgrass) Extract'],
    benefits: ['Purifies blood', 'Rich in chlorophyll', 'Boosts hemoglobin', 'Detoxifies liver'],
    usage: 'Take 30ml on empty stomach in the morning.', badge: 'New'
  },
  {
    id: '9', name: 'Herbal Hair Oil', price: 259, originalPrice: 359,
    image: hairOil, rating: 4.7, reviews: 423,
    category: 'Herbal Oils', type: 'Oil', healthCategory: 'Hair Wellness',
    description: 'Nourishing herbal hair oil with hibiscus, coconut, and bhringraj.',
    ingredients: ['Coconut Oil', 'Hibiscus Extract', 'Bhringraj', 'Amla Oil'],
    benefits: ['Reduces hair fall', 'Promotes growth', 'Prevents dandruff', 'Adds natural shine'],
    usage: 'Apply warm oil on scalp, massage for 10 minutes. Leave for 1 hour before washing.'
  },
  {
    id: '10', name: 'Immunity Tablets', price: 399, originalPrice: 549,
    image: herbalTablets, rating: 4.4, reviews: 167,
    category: 'Tablets', type: 'Tablet', healthCategory: 'Immunity Wellness',
    description: 'Ayurvedic immunity booster tablets with Tulsi, Giloy, and Ashwagandha.',
    ingredients: ['Tulsi Extract', 'Giloy Extract', 'Ashwagandha', 'Black Pepper'],
    benefits: ['Strengthens immunity', 'Fights infections', 'Reduces fatigue', 'Rich in antioxidants'],
    usage: 'Take 2 tablets twice daily after meals with water.', badge: 'Exclusive'
  },
];
