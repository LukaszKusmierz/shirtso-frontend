import React from 'react';
import { Link } from 'react-router-dom';
import {getStockStatusColor} from "../../utils/helpers";

const ProductCard = ({ product }) => {
    const { productId, productName, price, currency, description, stock, size } = product;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:scale-105">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-4xl">
          <i className="fas fa-tshirt"></i>
        </span>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{productName}</h3>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">{description}</p>

                <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-lg">
            {price} {currency}
          </span>
                    <span className="text-sm">Size: {size}</span>
                </div>

                <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${getStockStatusColor(stock)}`}>
            {stock === 0 ? 'Out of stock' : `${stock} in stock`}
          </span>

                    <Link
                        to={`/products/${productId}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;