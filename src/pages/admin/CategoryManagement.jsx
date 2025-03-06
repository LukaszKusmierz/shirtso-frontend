import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../../api/categories';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getCategoriesWithSubcategories();
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories. Please try again.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">Categories</h3>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate('/admin/categories/add-subcategory')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Subcategory
                    </button>
                    <button
                        onClick={() => navigate('/admin/categories/add-category')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Category
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {categories.map(category => (
                        <li key={category.categoryId}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-medium text-blue-600">{category.categoryName}</h4>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <button
                                            onClick={() => navigate(`/admin/categories/edit-category/${category.categoryId}`)}
                                            className="mr-3 text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="text-sm font-medium text-gray-700">Subcategories</h5>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {category.subcategories?.length > 0 ? (
                                            category.subcategories.map(subcategory => (
                                                <div
                                                    key={subcategory.subcategoryId}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                                                >
                                                    {subcategory.subcategoryName}
                                                    <button
                                                        onClick={() => navigate(`/admin/categories/edit-subcategory/${subcategory.subcategoryId}`)}
                                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">No subcategories found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const CategoryForm = ({ initialData, onSubmit, isEditing = false }) => {
    const [formData, setFormData] = useState({ categoryName: '' });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (initialData && isEditing) {
            setFormData({ categoryName: initialData.categoryName || '' });
        }
    }, [initialData, isEditing]);

    const handleChange = (e) => {
        setFormData({ categoryName: e.target.value });
        setFormError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.categoryName.trim()) {
            setFormError('Category name is required');
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                    Category Name
                </label>
                <input
                    type="text"
                    id="categoryName"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                        formError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {formError && (
                    <p className="mt-1 text-sm text-red-600">{formError}</p>
                )}
            </div>

            <div className="flex justify-end space-x-3">
                <Link
                    to="/admin/categories"
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isEditing ? 'Update Category' : 'Add Category'}
                </button>
            </div>
        </form>
    );
};

const SubcategoryForm = ({ initialData, onSubmit, isEditing = false }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        subcategoryName: '',
        categoryId: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialData && isEditing) {
            setFormData({
                subcategoryName: initialData.subcategoryName || '',
                categoryId: initialData.categoryId ? initialData.categoryId.toString() : ''
            });
        }
    }, [initialData, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.subcategoryName.trim()) {
            errors.subcategoryName = 'Subcategory name is required';
        }

        if (!formData.categoryId) {
            errors.categoryId = 'Category is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                ...formData,
                categoryId: parseInt(formData.categoryId)
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700">
                    Subcategory Name
                </label>
                <input
                    type="text"
                    id="subcategoryName"
                    name="subcategoryName"
                    value={formData.subcategoryName}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                        formErrors.subcategoryName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.subcategoryName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.subcategoryName}</p>
                )}
            </div>

            <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                    Parent Category
                </label>
                <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`mt-1 block w-full bg-white border ${
                        formErrors.categoryId ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
                {formErrors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
                )}
            </div>

            <div className="flex justify-end space-x-3">
                <Link
                    to="/admin/categories"
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isEditing ? 'Update Subcategory' : 'Add Subcategory'}
                </button>
            </div>
        </form>
    );
};

const AddCategory = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            // Call your API to add the category
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 800));
            navigate('/admin/categories');
        } catch (error) {
            console.error('Error adding category:', error);
            // Handle error
        }
    };

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Add New Category</h3>
            <CategoryForm onSubmit={handleSubmit} />
        </div>
    );
};

const EditCategory = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching category data
        const fetchCategory = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 600));

                setCategory({
                    categoryId: 1,
                    categoryName: 'Sample Category'
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching category:', error);
                setError('Failed to load category details');
                setLoading(false);
            }
        };

        fetchCategory();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            // Call your API to update the category
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 800));
            navigate('/admin/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            // Handle error
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Edit Category</h3>
            {category && <CategoryForm initialData={category} onSubmit={handleSubmit} isEditing={true} />}
        </div>
    );
};

const AddSubcategory = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            // Call your API to add the subcategory
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 800));
            navigate('/admin/categories');
        } catch (error) {
            console.error('Error adding subcategory:', error);
            // Handle error
        }
    };

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Add New Subcategory</h3>
            <SubcategoryForm onSubmit={handleSubmit} />
        </div>
    );
};

const EditSubcategory = () => {
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching subcategory data
        const fetchSubcategory = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 600));

                setSubcategory({
                    subcategoryId: 1,
                    subcategoryName: 'Sample Subcategory',
                    categoryId: 2
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching subcategory:', error);
                setError('Failed to load subcategory details');
                setLoading(false);
            }
        };

        fetchSubcategory();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            // Call your API to update the subcategory
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 800));
            navigate('/admin/categories');
        } catch (error) {
            console.error('Error updating subcategory:', error);
            // Handle error
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Edit Subcategory</h3>
            {subcategory && <SubcategoryForm initialData={subcategory} onSubmit={handleSubmit} isEditing={true} />}
        </div>
    );
};

const CategoryManagement = () => {
    return (
        <Routes>
            <Route path="/" element={<CategoryList />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/edit-category/:id" element={<EditCategory />} />
            <Route path="/add-subcategory" element={<AddSubcategory />} />
            <Route path="/edit-subcategory/:id" element={<EditSubcategory />} />
        </Routes>
    );
};

export default CategoryManagement;
