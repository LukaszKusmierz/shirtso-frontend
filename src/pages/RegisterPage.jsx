import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto">
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;