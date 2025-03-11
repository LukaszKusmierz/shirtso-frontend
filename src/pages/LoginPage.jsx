import React from 'react';
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;