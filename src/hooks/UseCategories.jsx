import { useState, useEffect } from 'react';
import { getAllCategories, getSubcategoriesByCategory } from '../services/CategoryService';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
                setError(null);
            } catch (err) {
                setError('Failed to load categories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const getSubcategories = async (categoryId) => {
        try {
            return await getSubcategoriesByCategory(categoryId);
        } catch (err) {
            console.error('Failed to load subcategories:', err);
            return [];
        }
    };

    return { categories, loading, error, getSubcategories };
};