import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword, validateResetToken } from '../services/AuthService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            if (!token) {
                setError('Invalid or missing reset token');
                setValidatingToken(false);
                return;
            }

            try {
                await validateResetToken(token);
                setTokenValid(true);
            } catch (err) {
                console.error('Token validation error:', err);
                setError('This password reset link is invalid or has expired. Please request a new one.');
                setTokenValid(false);
            } finally {
                setValidatingToken(false);
            }
        };

        checkToken();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.newPassword) {
            setError('Please enter a new password');
            return false;
        }

        if (formData.newPassword.length < 12) {
            setError('Password must be at least 12 characters long');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            await resetPassword(token, formData.newPassword);
            setSuccessMessage('Your password has been successfully reset. Redirecting to login...');

            setTimeout(() => {
                navigate('/login', {
                    state: { message: 'Password reset successful! Please login with your new password.' }
                });
            }, 2000);
        } catch (err) {
            console.error('Reset password error:', err);
            setError(err.message || 'Failed to reset password. Please try again or request a new reset link.');
        } finally {
            setLoading(false);
        }
    };

    if (validatingToken) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <div className="flex flex-col items-center justify-center py-8">
                        <Spinner size="lg" />
                        <p className="mt-4 text-gray-600">Validating reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Invalid Reset Link</h2>

                    <Alert
                        type="error"
                        message={error || 'This password reset link is invalid or has expired.'}
                        dismissible={false}
                        className="mb-6"
                    />

                    <div className="text-center space-y-4">
                        <Link
                            to="/forgot-password"
                            className="block text-blue-600 hover:underline"
                        >
                            Request a new password reset link
                        </Link>
                        <Link
                            to="/login"
                            className="block text-blue-600 hover:underline"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        dismissible={true}
                        onDismiss={() => setError(null)}
                        className="mb-4"
                    />
                )}

                {successMessage && (
                    <Alert
                        type="success"
                        message={successMessage}
                        dismissible={false}
                        className="mb-4"
                    />
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="newPassword">
                            New Password (at least 12 characters)
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                            minLength={12}
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth={true}
                        disabled={loading}
                        loading={loading}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-blue-600 hover:underline">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;