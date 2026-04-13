# Carverse

Carverse is a full-stack automotive marketplace web application that allows users to browse, list, and explore cars for sale in a clean and intuitive interface. Built with the MERN stack (MongoDB, Express.js, React, Node.js), the platform is designed to deliver a seamless experience for both buyers and sellers in the used car market.

The application features a dynamic car listing system where sellers can post vehicles with detailed specifications, pricing, and images. Buyers can browse listings and easily find what they are looking for using built-in options — sorting by price ascending, and filtering by category (such as sedan, hatchback, electric, etc.) — bypassing the noise of traditional classified platforms. Furthermore, users can directly order vehicles through the application instead of relying on external contact information.

On the backend, the API is built with Node.js and Express.js, with MongoDB serving as the database for flexible and efficient storage of vehicle data and user information. Authentication is handled securely using JWT-based authorization, ensuring that only verified users can post or manage listings. The frontend is built with React, offering a fast and responsive UI with a component-driven architecture that keeps the codebase clean and maintainable.

The project was built with a focus on real-world usability — mimicking the core functionality of platforms like CarDekho or OLX Autos — and served as a deep dive into building production-grade full-stack applications with proper API design, database modeling, and state management. Carverse reflects my ability to take a real-world problem, architect a solution from scratch, and ship a complete, working product independently.

## Features & Core Functionalities

Carverse includes three primary user roles: **Admin**, **Dealer (Seller)**, and **User (Buyer)**.

### 🚗 For Buyers (Users)
- **Extensive Inventory:** Browse through a dynamically updated inventory of cars.
- **Filtering & Sorting:** Filter vehicles by category (e.g., sedan, hatchback, electric) and sort by price ascending.
- **Detailed Vehicle Profiles:** View comprehensive vehicle details, including high-quality images and full technical specifications.
- **User Authentication:** Secure signup/login to manage your profile and save your data.
- **Direct Orders:** Easily place direct orders for vehicles through the platform rather than contacting the seller.

### 🏢 For Sellers (Dealers)
- **Dealer Dashboard:** An intuitive dashboard with key metrics and insights.
- **Inventory Management:** Effortlessly add, update, and remove vehicles from your listings.
- **Order Management:** Track and manage customer vehicle orders efficiently directly from the platform.
- **Sales Tracking:** Dedicated interface for managing sold inventory.

### 🛡️ For Administrators
- **Admin Dashboard:** High-level platform statistics and management tools.
- **User & Dealer Management:** Monitor, approve, or ban users/dealers to maintain platform integrity.
- **Platform-wide Inventory Control:** Admins have the capability to oversee all active and sold listings.
- **Messages & Settings:** Handle platform-wide messages and system configurations.

## 🛠️ Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide React (Icons), jsPDF (Document Exportation)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication & Security:** JWT (JSON Web Tokens), bcrypt for password hashing
- **File Uploads:** Multer (handling local image uploads)

## 🏗️ Architecture

The project is structured into three main components:

- **client**: The frontend application encompassing all React components, views, and routing.
- **server**: The REST API backend, models (Schemas), controllers, and authentication middleware.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a remote Atlas cluster URI)

### Backend (Server) Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install necessary dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `server` directory and configure the environment variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the development server (uses `nodemon` for auto-restarting):
   ```bash
   npm start
   ```

### Frontend (Client) Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts Overview

- **Frontend:**
  - `npm run dev`: Starts the Vite development server.
  - `npm run build`: Compiles the application for production.
  - `npm run lint`: Runs ESLint to identify and report on patterns in your code.
- **Backend:**
  - `npm start`: Runs the server continuously using `nodemon`.
