# 🛍️ MemuStore - E-commerce Application

Welcome to MemuStore - Your Premium Fashion Destination

A full-stack e-commerce application built with React, Node.js, and MongoDB.

## 📂 Quick Navigation
- [Backend Code](./Structured/Backend/) - Node.js/Express API
- [Frontend Code](./Structured/Frontend/) - React Application
- [Sample Data](./sampleProducts.js) - Product seed data

## 🚀 Features

- ✅ User Authentication (Register/Login)
- ✅ Product Catalog with Search & Filter
- ✅ Shopping Cart Management
- ✅ Wishlist Functionality
- ✅ Order Management System
- ✅ Razorpay Payment Integration
- ✅ Mobile Responsive Design
- ✅ Admin Panel for Product Management

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Redux Toolkit (State Management)
- CSS3 with Responsive Design

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Razorpay Payment Gateway

## 📁 Project Structure

```
E-commerce/
├── Structured/
│   ├── Backend/
│   │   ├── config/          # Configuration files
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── uploads/         # Image uploads
│   │   └── server.js        # Main server file
│   └── Frontend/
│       ├── public/          # Public assets
│       ├── src/
│       │   ├── components/  # Reusable components
│       │   ├── pages/       # Page components
│       │   ├── store/       # Redux store & slices
│       │   └── utils/       # Utility functions
│       └── package.json
└── sampleProducts.js        # Sample data
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mehar-mex/E-commerece.git
   cd E-commerce
   ```

2. **Backend Setup**
   ```bash
   cd Structured/Backend
   npm install
   ```
   
   Create a `.env` file in the Backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Run the Application**
   
   Start Backend (from Backend directory):
   ```bash
   npm start
   ```
   
   Start Frontend (from Frontend directory):
   ```bash
   npm start
   ```

5. **Seed Sample Data** (Optional)
   ```bash
   cd Structured/Backend
   node seed.js
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

## 🎨 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mehar**
- GitHub: [@mehar-mex](https://github.com/mehar-mex)

## 🙏 Acknowledgments

- Thanks to all contributors who helped with this project
- Inspired by modern e-commerce platforms
- Built with love for the developer community

---

⭐ Star this repository if you found it helpful!