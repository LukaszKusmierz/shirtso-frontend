import React from 'react';

const Spinner = () => {
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </div>
    );
};

export default Spinner;