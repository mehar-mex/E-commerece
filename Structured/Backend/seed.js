const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Designer Dress',
    description: 'Beautiful designer dress perfect for any occasion',
    price: 1299.99,
    image: '/uploads/image/image1.jpg',
    category: 'Dress',
    stock: 10,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Elegant Evening Gown',
    description: 'Stunning evening gown for special occasions',
    price: 1899.99,
    image: '/uploads/image/image2.jpg',
    category: 'Dress',
    stock: 8,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Casual Summer Dress',
    description: 'Light and comfortable dress for summer days',
    price: 849.99,
    image: '/uploads/image/image3.webp',
    category: 'Dress',
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Silk Saree Collection',
    description: 'Premium silk saree with intricate designs',
    price: 1589.99,
    image: '/uploads/image/image5.webp',
    category: 'Saree',
    stock: 6,
    sizes: ['One Size']
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket for casual wear',
    price: 979.99,
    image: '/uploads/image/image6.avif',
    category: 'Jacket',
    stock: 20,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Pleated Mini Skirt',
    description: 'Trendy pleated skirt perfect for young fashion',
    price: 645.99,
    image: '/uploads/image/image7.jpg',
    category: 'Skirt',
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    name: 'Crop Top Set',
    description: 'Stylish crop top with matching accessories',
    price: 535.99,
    image: '/uploads/image/image8.webp',
    category: 'Top',
    stock: 25,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'A-Line Skirt',
    description: 'Classic A-line skirt suitable for any occasion',
    price: 752.99,
    image: '/uploads/image/image11.webp',
    category: 'Skirt',
    stock: 21,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Bomber Jacket',
    description: 'Trendy bomber jacket for street style fashion',
    price: 1195.99,
    image: '/uploads/image/image22.avif',
    category: 'Jacket',
    stock: 16,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Wrap Dress',
    description: 'Flattering wrap dress that suits all body types',
    price: 1008.99,
    image: '/uploads/image/image33.jpg',
    category: 'Dress',
    stock: 12,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Georgette Saree',
    description: 'Lightweight georgette saree with beautiful drape',
    price: 1245.99,
    image: '/uploads/image/image34.jpg',
    category: 'Saree',
    stock: 8,
    sizes: ['One Size']
  },
  {
    name: 'Peplum Top',
    description: 'Stylish peplum top that accentuates the waist',
    price: 642.99,
    image: '/uploads/image/image44.webp',
    category: 'Top',
    stock: 23,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Anarkali Kurti',
    description: 'Traditional Anarkali kurti with flowing silhouette',
    price: 888.99,
    image: '/uploads/image/image55.png',
    category: 'Kurti',
    stock: 10,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Pencil Skirt',
    description: 'Professional pencil skirt for office wear',
    price: 758.99,
    image: '/uploads/image/image66.jpeg',
    category: 'Skirt',
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Trench Coat',
    description: 'Classic trench coat for sophisticated style',
    price: 1589.99,
    image: '/uploads/image/image77.png',
    category: 'Jacket',
    stock: 7,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Shift Dress',
    description: 'Simple and elegant shift dress for versatile wear',
    price: 876.99,
    image: '/uploads/image/image88.webp',
    category: 'Dress',
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Banarasi Saree',
    description: 'Traditional Banarasi saree with gold thread work',
    price: 1949.99,
    image: '/uploads/image/image99.webp',
    category: 'Saree',
    stock: 3,
    sizes: ['One Size']
  },
  {
    name: 'Off-Shoulder Top',
    description: 'Trendy off-shoulder top for casual outings',
    price: 538.99,
    image: '/uploads/image/image111.jpeg',
    category: 'Top',
    stock: 26,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Straight Kurti',
    description: 'Simple straight-cut kurti for everyday comfort',
    price: 748.99,
    image: '/uploads/image/image222.webp',
    category: 'Kurti',
    stock: 20,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Moto Jacket',
    description: 'Edgy moto jacket with zipper details',
    price: 1335.99,
    image: '/uploads/image/images333.jpeg',
    category: 'Jacket',
    stock: 9,
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();