import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {categoryService} from "../../api/categories";

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };

        fetchCategories();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-gray-800">
                        SHIRTSO
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden text-gray-600 focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {showMobileMenu ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Desktop menu */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>

                        {/* Categories dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                                className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                            >
                                Categories
                                <svg
                                    className="ml-1 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showCategoryMenu && (
                                <div className="absolute z-10 mt-2 py-2 w-48 bg-white rounded-md shadow-lg">
                                    {categories.map(category => (
                                        <Link
                                            key={category.categoryId}
                                            to={`/products?categoryId=${category.categoryId}`}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowCategoryMenu(false)}
                                        >
                                            {category.categoryName}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/products" className="text-gray-600 hover:text-gray-900">
                            All Products
                        </Link>

                        {/* Authentication links */}
                        {currentUser ? (
                            <>
                                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                                    My Account
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                                    Login
                                </Link>
                                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                                    Register
                                </Link>
                            </>
                        )}

                        {/* Cart icon */}
                        <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
                            )}
                        </Link>
                    </nav>
                </div>

                {/* Mobile menu */}
                {showMobileMenu && (
                    <nav className="mt-4 md:hidden">
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/products"
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                All Products
                            </Link>

                            {/* Categories in mobile menu */}
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-gray-500 mb-2">Categories</p>
                                {categories.map(category => (
                                    <Link
                                        key={category.categoryId}
                                        to={`/products?categoryId=${category.categoryId}`}
                                        className="block py-2 text-gray-600 hover:text-gray-900"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {category.categoryName}
                                    </Link>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                {currentUser ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="block py-2 text-gray-600 hover:text-gray-900"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            My Account
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowMobileMenu(false);
                                            }}
                                            className="block py-2 text-gray-600 hover:text-gray-900 w-full text-left"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block py-2 text-gray-600 hover:text-gray-900"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block py-2 text-gray-600 hover:text-gray-900"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}

                                <Link
                                    to="/cart"
                                    className="flex items-center py-2 text-gray-600 hover:text-gray-900"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <span>Shopping Cart</span>
                                    {totalItems > 0 && (
                                        <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {totalItems}
                    </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Navbar;
