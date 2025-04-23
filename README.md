# 🛒 E-Commerce React App

This is a full-stack e-commerce application built using **React (class components)**, **Tailwind CSS**, **React Router**, and **Node.js/Express API** for the backend. It supports features like login/registration, product browsing, cart management, placing orders, and more.

---

## 🚀 Features

- **User Authentication**
  - Login and registration using JWT stored in cookies
- **Product Catalog**
  - Display all products
  - Categorization (e.g., vegetables, fruits, etc.)
- **Cart System**
  - Add to cart
  - Modify quantity
  - Persist cart to backend
- **Protected Routes**
  - Only authenticated users can access cart, orders, and product listings
- **Order Management**
  - Confirm and place orders
  - Track order placement status
- **Popup Invoice Preview**
  - Dynamic checkout modal before placing order
- **Stylized UI with Tailwind CSS**

---

## 🗂️ Project Structure

```
├── /public
├── /src
│   ├── /components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── AllProductsPage.jsx
│   │   ├── Cart.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── DeliveringDetails.jsx
│   │   └── ProceedToBuy.jsx
│   ├── /context
│   │   └── CartContext.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 🧠 Tech Stack

- **Frontend**: React (class-based), Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB (for APIs)
- **Auth**: JWT (stored in cookies)
- **Popup UI**: `reactjs-popup`

---

## 🌐 Routing Overview

| Route                | Component           | Access    |
| -------------------- | ------------------- | --------- |
| `/login`             | `LoginPage`         | Public    |
| `/register`          | `RegisterPage`      | Public    |
| `/`                  | `HomePage`          | Protected |
| `/products`          | `AllProductsPage`   | Protected |
| `/cart`              | `Cart`              | Protected |
| `/orders`            | `OrdersPage`        | Protected |
| `/deliveringDetails` | `DeliveringDetails` | Protected |

Routes are protected using a custom `ProtectedRoute` component which checks for the presence of `jwt_token` in cookies.

---

## 🛠️ Backend API Endpoints

| Method | Endpoint                        | Description                        |
| ------ | ------------------------------- | ---------------------------------- |
| POST   | `/api/users/login`              | Login user                         |
| POST   | `/api/users/register`           | Register new user                  |
| POST   | `/api/products/setCartProducts` | Save user's cart in DB             |
| POST   | `/api/products/getCartProducts` | Retrieve user's cart from DB       |
| POST   | `/api/orders/placeOrder`        | Submit order with cart + user data |

---

## 📦 Cart Functionality

- Cart data is stored in React class component state.
- Context API is used (`CartContext`) to share cart across the app.
- Functions provided:
  - `addCartItem({product, quantity})`
  - `increaseQuantity(productId)`
  - `decreaseQuantity(productId)`
  - `deleteCartItem(productId)`
  - `emptyCart()`

---

## 🧾 Order Workflow

1. User fills delivery and payment info.
2. Clicks `Proceed to Buy`.
3. `reactjs-popup` opens with invoice summary.
4. On confirm, order is submitted to backend and cart is cleared.
5. Success/failure screen is shown.

---

## 🎨 UI Styling

- All styling is handled with Tailwind CSS.
- Responsive layout with smooth transitions and animations.
- Modals, buttons, forms, and invoices follow a modern card-based layout.

---

## 📦 Installation & Setup

1. Clone this repo:

   ```bash
   git clone https://github.com/yourusername/ecommerce-react-app.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run frontend:

   ```bash
   npm start
   ```

4. (If using local backend) Run server in `/server`:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing

- Manual testing via UI.
- Simulate multiple cart actions, order scenarios, and login flows.

---

## 🙌 Contributing

Pull requests and feature suggestions are welcome! Open an issue to discuss.

## Credentials

### Username :- malepatignanadeep@gmail.com

### password :- Shiva@2005
