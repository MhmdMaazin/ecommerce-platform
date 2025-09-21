import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD3p0tGO2YepuKW0FuYUU5YImIkmRiFXCE',
  authDomain: 'ecommerce-platform-fbe6d.firebaseapp.com',
  projectId: 'ecommerce-platform-fbe6d',
  storageBucket: 'ecommerce-platform-fbe6d.firebasestorage.app',
  messagingSenderId: '567373239374',
  appId: '1:567373239374:web:74384c3880dc315a95df1f'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample seed data matching the Product type structure
const sampleProducts = [
  {
    title: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    currency: 'USD',
    images: ['https://res.cloudinary.com/dixrov4zs/image/upload/v1758431079/samples/ecommerce/leather-bag-gray.jpg'],
    variants: { sizes: ['One Size'], colors: ['Black', 'White'] },
    stock: 100,
    vendorId: 'vendor1',
    category: 'Electronics',
  },
  {
    title: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt',
    price: 19.99,
    currency: 'USD',
    images: ['https://res.cloudinary.com/dixrov4zs/image/upload/v1758431079/samples/ecommerce/leather-bag-gray.jpg'],
    variants: { sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Blue', 'Green'] },
    stock: 50,
    vendorId: 'vendor2',
    category: 'Men',
  },
  {
    title: 'Coffee Mug',
    description: 'Ceramic coffee mug with unique design',
    price: 12.99,
    currency: 'USD',
    images: ['https://res.cloudinary.com/dixrov4zs/image/upload/v1758431085/samples/smile.jpg'],
    variants: { sizes: [], colors: ['White', 'Black'] },
    stock: 75,
    vendorId: 'vendor3',
    category: 'Home',
  },
  {
    title: 'Winter Jacket',
    description: 'Warm winter jacket for cold weather',
    price: 79.99,
    currency: 'USD',
    images: ['https://res.cloudinary.com/dixrov4zs/image/upload/v1758431085/samples/smile.jpg'],
    variants: { sizes: ['S', 'M', 'L'], colors: ['Black', 'Blue', 'Red'] },
    stock: 30,
    vendorId: 'vendor4',
    category: 'Women',
  },
  {
    title: 'Running Shoes',
    description: 'Comfortable running shoes for athletes',
    price: 89.99,
    currency: 'USD',
    images: ['https://res.cloudinary.com/dixrov4zs/image/upload/v1758431085/samples/smile.jpg'],
    variants: { sizes: ['8', '9', '10', '11'], colors: ['Black', 'White', 'Blue'] },
    stock: 40,
    vendorId: 'vendor5',
    category: 'Men',
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Add products to Firestore
    const productsCollection = collection(db, 'products');
    
    for (const product of sampleProducts) {
      const productRef = doc(productsCollection);
      await setDoc(productRef, { ...product, id: productRef.id });
      console.log(`Added product: ${product.title}`);
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();