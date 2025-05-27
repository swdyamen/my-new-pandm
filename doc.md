# Project Documentation: P and M Admin

## 1. Project Overview

P and M Admin is a web application designed for managing customers, their associated jobs, and potentially products and orders. It provides a user-friendly interface for administrators to perform CRUD (Create, Read, Update, Delete) operations and track various business activities.

**Key Technologies Used:**

*   **Frontend:** React (with Vite)
*   **Styling:** Tailwind CSS
*   **Backend & Database:** Firebase (Authentication, Firestore)
*   **Routing:** React Router DOM

## 2. Features

The application provides the following key features:

*   **User Authentication:**
    *   Login for existing users.
    *   Logout functionality.
    *   (Password Reset and User Registration functions are available in `src/firebase/auth.js` but may not be fully integrated into the UI flow yet).
*   **Dashboard (`src/pages/dashboard.jsx`):**
    *   Displays an overview of key metrics (e.g., Total Products, Pending Orders, Monthly Revenue, Total Customers).
    *   Shows a list of recent orders.
    *   *Currently, this section uses mock data.*
*   **Customer Management (`src/pages/Customers.jsx`):**
    *   View a list of all customers with pagination.
    *   Create new customers.
    *   Edit existing customer details.
    *   Delete customers.
    *   Search and filter customers by name, phone, location, and post code.
    *   Navigate to view jobs associated with a specific customer.
*   **Job Management (via `src/pages/CustomerJobs.jsx`):**
    *   View jobs associated with a specific customer.
    *   Create, update, and delete jobs for a customer (functionality provided by `src/hooks/useJobsData.js` and `src/services/jobService.js`).
*   **Product Management (`src/pages/Products.jsx`):**
    *   *This section is currently a placeholder and not yet implemented.*
*   **Order Management (`src/pages/Orders.jsx`):**
    *   *This section is currently a placeholder and not yet implemented.*
*   **Settings (`src/pages/Settings.jsx`):**
    *   *This section is currently a placeholder and not yet implemented.*

## 3. Project Structure

The project follows a standard React application structure. Key directories include:

*   **`public/`**: Contains static assets like `vite.svg` and the main `index.html` file.
*   **`src/`**: Contains the majority of the application's source code.
    *   **`components/`**: Contains reusable UI components.
        *   `Layout.jsx`: Defines the main application layout (sidebar and content area).
        *   `Sidebar.jsx`: Implements the navigation sidebar.
        *   `AuthGuard.jsx`: Protects routes based on authentication status.
        *   `common/`: Contains generic, reusable components like modals and pagination.
        *   `customers/`: Components specific to customer management (forms, tables).
        *   `jobs/`: Components specific to job management.
    *   **`context/`**: (Appears to contain `FirebaseContext.jsx`, though not explored in detail, likely provides Firebase instances through React context).
    *   **`firebase/`**: Contains Firebase configuration and helper modules.
        *   `config.js`: Initializes Firebase and exports auth, db (Firestore), and storage instances.
        *   `auth.js`: Provides functions for Firebase authentication (login, logout, register, password reset).
        *   `firestore.js`: Contains generic helper functions for Firestore database interactions.
    *   **`hooks/`**: Contains custom React hooks to encapsulate stateful logic.
        *   `useAuth.js`: Manages user authentication state.
        *   `useCustomerData.js`: Handles CRUD operations, filtering, and pagination for customer data.
        *   `useJobsData.js`: Manages CRUD operations for job data related to a customer.
    *   **`icons/`**: Contains SVG icon components used throughout the application.
    *   **`pages/`**: Contains top-level components that represent different pages/views of the application (e.g., `Login.jsx`, `Dashboard.jsx`, `Customers.jsx`).
    *   **`services/`**: Contains modules responsible for making API calls or interacting with backend services (specifically Firebase/Firestore).
        *   `customerService.js`: Handles direct Firestore operations for customers.
        *   `jobService.js`: Handles direct Firestore operations for jobs.
    *   **`utils/`**: Contains utility functions.
        *   `firebaseBackup.js`: (Not explored, but likely related to backing up Firebase data).
        *   `formatters.js`: (Not explored, but likely contains data formatting functions).
    *   `App.jsx`: The main application component that sets up routing.
    *   `main.jsx`: The entry point of the React application.
*   **`.env.production`**: Environment variable configuration file for production (firebase keys etc.). A corresponding `.env` or `.env.local` would be used for development.
*   **`package.json`**: Lists project dependencies and scripts.
*   **`vite.config.js`**: Configuration file for the Vite build tool.
*   **`tailwind.config.js`**: Configuration file for Tailwind CSS.

## 4. Setup and Running the Project

To set up and run the P and M Admin application locally, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies:**
    Ensure you have Node.js and npm (or yarn) installed. Then, install the project dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set Up Environment Variables:**
    The application uses Firebase for backend services, which requires API keys and other configuration details. These are managed through environment variables.
    *   Create a `.env` file in the root of the project (you can copy `.env.production` if it exists and adapt it for development, but ensure your actual development keys are used and not production keys).
    *   Add the following Firebase configuration variables to your `.env` file, replacing the placeholder values with your actual Firebase project credentials:
        ```env
        VITE_PUBLIC_FIREBASE_API_KEY_PM="YOUR_API_KEY"
        VITE_PUBLIC_FIREBASE_AUTH_DOMAIN_PM="YOUR_AUTH_DOMAIN"
        VITE_PUBLIC_FIREBASE_PROJECT_ID_PM="YOUR_PROJECT_ID"
        VITE_PUBLIC_FIREBASE_STORAGE_BUCKET_PM="YOUR_STORAGE_BUCKET"
        VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PM="YOUR_MESSAGING_SENDER_ID"
        VITE_PUBLIC_FIREBASE_APP_ID_PM="YOUR_APP_ID"
        VITE_PUBLIC_FIREBASE_MEASUREMENT_ID_PM="YOUR_MEASUREMENT_ID" # Optional
        ```
    *   You also need to set the base URL for the application, if it's not running at the root of the domain:
        ```env
        VITE_BASE_URL="/your-base-path/" # e.g., /pandm/ or / if running at root
        ```
        (The application defaults to `/pandm/` if `VITE_BASE_URL` is not set, as seen in `src/App.jsx`).

4.  **Run the Development Server:**
    Once dependencies are installed and environment variables are set, you can start the Vite development server:
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    This will typically start the application on `http://localhost:5173` (or another port if 5173 is busy).

5.  **Available Scripts:**
    *   `npm run dev`: Starts the development server.
    *   `npm run build`: Builds the application for production.
    *   `npm run lint`: Lints the codebase using ESLint.
    *   `npm run preview`: Serves the production build locally for preview.
```

## 5. Core Components and Logic

This section details some of the core architectural aspects of the application.

### 5.1. Authentication

*   **Route Protection:** The `src/components/AuthGuard.jsx` component is used to protect routes that require authentication. It checks the user's auth state and redirects to the login page if the user is not authenticated.
*   **Auth Hook:** The `src/hooks/useAuth.js` hook provides the current authentication state (user object and loading status) by subscribing to Firebase's `onAuthStateChanged`.
*   **Firebase Auth Service:** All Firebase authentication operations (login, logout, registration, password reset) are encapsulated in functions within `src/firebase/auth.js`. These functions interact directly with the Firebase Authentication service.
*   **Login Page:** The `src/pages/Login.jsx` component handles the user login form and uses the authentication functions from `src/firebase/auth.js`.

### 5.2. Routing

*   **Router Setup:** `src/App.jsx` is the central place where application routes are defined using `react-router-dom`. It maps URL paths to specific page components found in `src/pages/`.
*   **Layout and Navigation:**
    *   `src/components/Layout.jsx`: Provides the main application structure, typically including a sidebar and a main content area where page components are rendered via `<Outlet />`.
    *   `src/components/Sidebar.jsx`: Renders the navigation links for different sections of the application (Dashboard, Customers, Products, etc.) and handles user logout.

### 5.3. Data Management

The application primarily uses Firebase Firestore for its database, with a combination of services and custom hooks to manage data flow.

*   **Firebase Configuration:**
    *   `src/firebase/config.js`: Initializes the Firebase app with credentials from environment variables and exports instances of Firebase services like Firestore (`db`) and Auth (`auth`).
    *   `src/firebase/firestore.js`: Provides a set of generic helper functions for common Firestore operations (e.g., `addDocument`, `getDocument`, `updateDocument`, `deleteDocument`, `queryDocuments`). These are used by the more specific service files.

*   **Customer Data:**
    *   **Page Component:** `src/pages/Customers.jsx` is responsible for displaying the customer list, handling user interactions (add, edit, delete, search), and managing the customer form modal.
    *   **Custom Hook:** `src/hooks/useCustomerData.js` abstracts the logic for fetching, creating, updating, deleting, filtering, and paginating customer data. It directly interacts with Firestore functions (from `firestore.js` or by using Firestore SDK methods) to perform these operations. It also manages local state for customers, loading status, errors, and pagination.
    *   **Service (Legacy/Alternative):** `src/services/customerService.js` also contains functions for customer CRUD operations. The `useCustomerData` hook appears to be the primary method used by the `Customers.jsx` page, but this service provides similar functionalities and might be used elsewhere or represent an older pattern. It demonstrates direct interaction with Firestore for querying and data manipulation, including server timestamps and lowercase fields for searching.

*   **Job Data:**
    *   **Page Component:** `src/pages/CustomerJobs.jsx` (or a similar component) would be responsible for displaying jobs related to a specific customer.
    *   **Custom Hook:** `src/hooks/useJobsData.js` manages fetching, creating, updating, and deleting job data. It takes a `customerId` as a parameter to manage jobs for that specific customer.
    *   **Service:** `src/services/jobService.js` contains the actual Firestore interaction logic for jobs (CRUD operations), ensuring that jobs are correctly associated with a `customerId` and stored in the `jobs` collection.

### 5.4. Styling

*   **Tailwind CSS:** The application uses Tailwind CSS for utility-first styling.
*   **Configuration:** Tailwind is configured in `tailwind.config.js`.
*   **Global Styles:** Global styles and Tailwind directives are typically included in `src/index.css`.
*   **Component-Specific Styles:** Most styling is applied directly within React components using Tailwind utility classes. Some components might have their own CSS files (e.g., `src/App.css`) for more complex or component-specific styles not easily achieved with utility classes alone.

## 6. Placeholder and Mock Data Areas

It's important to note the following sections of the application are either placeholders or use mock data as of the last review:

*   **Dashboard Data (`src/pages/dashboard.jsx`):**
    *   The statistics cards (Total Products, Pending Orders, etc.) and the "Recent Orders" table on the Dashboard page currently display **mock data**. This data is hardcoded within the `dashboard.jsx` component and does not reflect live information from the database.

*   **Product Management (`src/pages/Products.jsx`):**
    *   This page is a **placeholder**. While a route and navigation link exist, the component itself (`src/pages/Products.jsx`) currently renders an empty `<div>` and does not contain any functionality for managing products.

*   **Order Management (`src/pages/Orders.jsx`):**
    *   Similar to Product Management, this page is a **placeholder**. The component (`src/pages/Orders.jsx`) is an empty `<div>` with no implemented features.

*   **Settings (`src/pages/Settings.jsx`):**
    *   This page is also a **placeholder**. The component (`src/pages/Settings.jsx`) consists of an empty `<div>` and lacks any settings-related functionality.

These sections will require further development to implement their intended features and connect to real data where applicable.

## 7. Other Notes

*   A file named `note.md` exists in the root of the repository. This file was not reviewed but might contain additional notes or context from the development process.

This documentation provides a snapshot of the application's structure and functionality as of the last review.
