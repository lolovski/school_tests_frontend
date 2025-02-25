// src/routes/user/LogoutPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const LogoutPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-gray-800 p-8 rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4">Выход из аккаунта</h1>
                <p className="mb-4">Вы уверены, что хотите выйти из аккаунта?</p>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default LogoutPage;