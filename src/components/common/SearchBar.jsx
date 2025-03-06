import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productService } from '../../api/products';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const resultsRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        // Initialize search term from URL if present
        const queryParam = searchParams.get('q');
        if (queryParam) {
            setSearchTerm(queryParam);
        }
    }, [searchParams]);

    useEffect(() => {
        // Handle clicks outside the search results to close the dropdown
        const handleClickOutside = (event) => {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(event.target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce search to avoid too many API calls
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                performSearch();
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const performSearch = async () => {
        if (!searchTerm.trim()) return;

        setIsLoading(true);

        try {
            const response = await productService.getProductsByName(searchTerm);
            setSearchResults(response.data.slice(0, 5)); // Limit to 5 results for dropdown
            setShowResults(true);
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowResults(true);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setShowResults(false);
            navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleResultClick = (productId) => {
        setShowResults(false);
        navigate(`/products/${productId}`);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSearchSubmit} className="flex w-full md:w-64 lg:w-96">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        ref={searchInputRef}
                        className="w-full px-4 py-2 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-2.5">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-r-md"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
                <div
                    ref={resultsRef}
                    className="absolute z-10 w-full mt-2 bg-white shadow-lg rounded-md overflow-hidden"
                >
                    <ul className="divide-y divide-gray-200">
                        {searchResults.map((product) => (
                            <li key={`${product.productId}-${product.size}`}>
                                <button
                                    type="button"
                                    onClick={() => handleResultClick(product.productId)}
                                    className="w-full px-4 py-3 flex items-center hover:bg-gray-50 text-left"
                                >
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded">
                                        <div className="h-10 w-10 rounded flex items-center justify-center text-gray-500">
                                            {product.imageId}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                                        <p className="text-sm text-gray-500">
                                            {product.price.toFixed(2)} {product.currency} - {product.size}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}

                        <li>
                            <button
                                type="button"
                                onClick={handleSearchSubmit}
                                className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 text-center"
                            >
                                View all results
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {showResults && searchTerm && searchResults.length === 0 && !isLoading && (
                <div className="absolute z-10 w-full mt-2 bg-white shadow-lg rounded-md overflow-hidden">
                    <div className="px-4 py-3 text-sm text-gray-700">
                        No products found for "{searchTerm}"
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;

// To use the SearchBar component, add it to your Navbar.jsx:
// import SearchBar from './SearchBar';
// Then add it within the navigation elements:
/*
<nav className="hidden md:flex items-center space-x-8">
  <Link to="/" className="text-gray-600 hover:text-gray-900">
    Home
  </Link>
  <SearchBar />
  ...
</nav>
*/