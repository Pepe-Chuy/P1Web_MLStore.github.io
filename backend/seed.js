const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample products
const products = [
  {
    name: 'SVM Masterclass',
    description: 'Comprehensive course on Support Vector Machines: theory and implementation.',
    price: 299.00,
    stock: 100,
    category: 'Algorithms',
    image: 'https://media.datacamp.com/legacy/image/upload/f_auto,q_auto:best/v1526288453/index3_souoaz.png'
  },
  {
    name: 'K-Nearest Neighbors Toolkit',
    description: 'Python library with optimized KNN algorithms for various applications.',
    price: 99.50,
    stock: 150,
    category: 'Algorithms',
    image: 'https://db0dce98.rocketcdn.me/es/files/2020/11/Illu-2-KNN-1024x492.jpg'
  },
  {
    name: 'Deep Learning Foundation Bundle',
    description: 'Essential algorithms for neural networks: perceptrons, backpropagation, and more.',
    price: 499.00,
    stock: 75,
    category: 'Algorithms',
    image: 'https://www.profesionalonline.com/blog/wp-content/uploads/2021/11/que-es-machine-learning-header.jpg'
  },
  {
    name: 'Decision Tree Pro',
    description: 'Advanced decision tree and random forest algorithms for classification and regression.',
    price: 149.99,
    stock: 120,
    category: 'Algorithms',
    image: 'https://miro.medium.com/v2/resize:fit:1200/1*kwCh2-U02xf-EWaTt3Xr4w.png'
  },
  {
    name: 'Clustering Essentials Pack',
    description: 'Implementation of popular clustering algorithms: K-Means, DBSCAN, Hierarchical Clustering.',
    price: 79.00,
    stock: 200,
    category: 'Algorithms',
    image: 'https://developers.google.com/static/machine-learning/clustering/images/clustering_example.png'
  }
];

// Sample users
const users = [
  {
    name: 'Admin1',
    email: 'admin@mlshop.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'User1',
    email: 'user@mlshop.com',
    password: 'password123',
    role: 'client'
  }
];

// Seed the database
const seedDB = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`Added ${createdProducts.length} products`);
    
    // Insert new users - using save() to trigger the password hashing middleware
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Added ${createdUsers.length} users`);
    console.log('Admin user: admin@mlshop.com / password123');
    console.log('Normal user: user@mlshop.com / password123');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
};

// Run the seeding function
seedDB();
