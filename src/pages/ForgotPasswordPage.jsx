import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/AuthService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await forgotPassword(email);
            setSuccessMessage('Password reset instructions have been sent to your email. Please check your inbox.');
            setEmail('');
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

                <p className="text-gray-600 mb-6 text-center">
                    Enter your email address and we'll send you instructions to reset your password.
                </p>

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
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth={true}
                        disabled={loading}
                        loading={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPasswordPage;