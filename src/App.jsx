import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';
// import {useAuth} from "./hooks/useAuth";

// const ProtectedRoute = ({ children }) => {
//     const { currentUser, loading } = useAuth();
//
//     if (loading) {
//         return <div>Loading...</div>; // Or a spinner
//     }
//
//     return currentUser ? children : <Navigate to="/login" replace />;
// };

const App = () => {
  return (
      <Router>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              {/*<Route path="/products" element={*/}
              {/*    <ProtectedRoute>*/}
              {/*        <ProductsPage />*/}
              {/*    </ProtectedRoute>*/}
              {/*}*/}
              {/*/>*/}
              {/*<Route path="/products/:id" element={*/}
              {/*    <ProtectedRoute>*/}
              {/*        <ProductDetailPage />*/}
              {/*    </ProtectedRoute>*/}
              {/*}*/}
              {/*/>*/}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </Router>
  );
};

export default App;
