Shirtso - Men's Fashion E-Commerce Frontend
Shirtso is a comprehensive React-based frontend for a men's fashion e-commerce platform. It connects to a Spring Boot backend API to provide a complete shopping experience with product browsing, cart management, user authentication, and an admin dashboard.
Features

User Authentication - JWT-based login/registration system
Product Browsing - View products with filtering by category, size, and availability
Product Search - Search functionality with autocomplete results
Shopping Cart - Add, remove, and update product quantities
User Profile - Manage account settings and view order history
Checkout Process - Complete purchase flow with shipping and payment options
Admin Dashboard - Manage products, categories, and view orders
Responsive Design - Mobile-friendly interface using TailwindCSS

Tech Stack

React 18
React Router 6
Axios for API requests
TailwindCSS for styling
JWT for authentication
Recharts for data visualization

Prerequisites

Node.js (v16+)
npm or yarn
Access to the Shirtso backend API (running on port 8080 by default)

Installation

Clone the repository:
git clone https://github.com/your-username/shirtso-frontend.git
cd shirtso-frontend

Install dependencies:
npm install

Create a .env file in the root directory with the following content:
REACT_APP_API_URL=http://localhost:8080/api

Start the development server:
npm start

The application will open in your browser at http://localhost:3000

## Project Structure

```bash

shirtso-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── api/
│   │   ├── axios.js           # Axios instance with interceptors
│   │   ├── auth.js            # Authentication API
│   │   ├── products.js        # Products API
│   │   └── categories.js      # Categories API
│   ├── components/
│   │   ├── common/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── products/          # Product display components
│   │   ├── cart/              # Shopping cart components
│   │   └── admin/             # Admin dashboard components
│   ├── context/
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── CartContext.jsx    # Shopping cart state
│   ├── hooks/
│   │   ├── useAuth.js         # Auth context hook
│   │   └── useCart.js         # Cart context hook
│   ├── pages/                 # Application pages
│   ├── utils/                 # Helper functions
│   ├── App.jsx                # Main component with routing
│   └── index.jsx              # Entry point
└── package.json
```


API Integration
The frontend is designed to work with the Shirtso backend API. The API endpoints are:

Authentication

POST /auth/login - User login
POST /auth/register - User registration


Products

GET /products - List all products
GET /products?subcategoryId={id} - Filter by subcategory
GET /products?size={size} - Filter by size
GET /products/in-stock - Get products in stock
GET /products?productName={name} - Search products by name
POST /products - Create a new product (admin)


Categories

GET /categories - List all categories
GET /categories/subcategories - Get categories with subcategories
GET /subcategories/{categoryId} - Get subcategories by category



Authentication
The application uses JWT tokens for authentication. The token is stored in localStorage and automatically included in API requests via an Axios interceptor.
Admin Access
To access the admin dashboard, you need to log in with a user that has the USER_WRITE role.
Default admin credentials:

Email: admin@mail.com
Password: adminsecret

Available Scripts

npm start - Runs the app in development mode
npm build - Builds the app for production
npm test - Runs tests

Deployment
To build the application for production:
npm run build
This creates an optimized production build in the build folder that can be deployed to any static hosting service.
Roadmap

Add email verification for new users
Implement password reset functionality
Add product reviews and ratings
Integrate payment gateways
Add order tracking functionality
Implement wishlist feature