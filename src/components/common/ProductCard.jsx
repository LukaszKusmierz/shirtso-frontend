import React from "react";
import useCart from "../../hooks/useCart";
import {Link} from "react-router-dom";

const ProductCard = ({product}) => {
    const {addToCart} = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            productId: product.id,
            productName: product.name,
            price: product.price,
            currency: product.currency,
            imageId: product.imageId,
            size: product.size
        });
    };

    const getStockStatus = () => {
        if (product.stock <= 0) {
            return { label: 'Out of Stock', color: 'bg-red-500' };
        } else if (product.stock < 3) {
            return { label: 'Low Stock', color: 'bg-yellow-500' };
        } else {
            return { label: 'In Stock', color: 'bg-green-500' };
        }
    };

    const stockStatus = getStockStatus();

    return (
        <Link to={`/products/${product.productId}`} className="group">
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg">
                {/* Product Image */}
                <div className="relative h-64 bg-gray-200">
                    <img
                        src={`/api/placeholder/${400}/${320}`}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                    />

                    {/* Stock Status Badge */}
                    <div className={`absolute top-2 right-2 ${stockStatus.color} text-white text-xs px-2 py-1 rounded`}>
                        {stockStatus.label}
                    </div>

                    {/* Size Badge */}
                    <div className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        {product.size}
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.productName}</h3>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 h-10">
                        {product.description}
                    </p>

                    <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">
                            {product.price.toFixed(2)} {product.currency}
                        </p>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className={`px-3 py-1 text-sm rounded ${
                                product.stock > 0
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
