// src/components/UI/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BrightStar, Code, CreditCards, LogIn, LogOut, TaskList } from "iconoir-react/regular";
import { CheckCircle, HomeAlt } from "iconoir-react";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="fixed left-0 top-0 h-full w-16 flex flex-col bg-gray-800 text-white transition-all duration-300 hover:w-64 group z-50">
            <div className="p-4">
                <Link to="/" className="block p-2 rounded hover:bg-gray-700">
                    <HomeAlt />
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Главная</span>
                </Link>
                {user && (user.status_id === 2 || user.status_id === 3) && (
                    <>
                    </>
                )}
                {user && (user.status_id !== 2 && user.status_id !== 3) && (
                    <>
                        <Link to="/cards" className="block p-2 rounded hover:bg-gray-700">
                            <CreditCards />
                            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Карточки</span>
                        </Link>
                        <Link to="/tasks" className="block p-2 rounded hover:bg-gray-700">
                            <TaskList />
                            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Задания</span>
                        </Link>
                        <Link to="/problems" className="block p-2 rounded hover:bg-gray-700">
                            <Code />
                            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Проблемы</span>
                        </Link>
                    </>
                )}
            </div>
            <div className="mt-auto p-4">
                {user ? (
                    <Link to="/logout" className="block p-2 rounded hover:bg-gray-700">
                        <LogOut />
                        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Выход</span>
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="block p-2 rounded hover:bg-gray-700">
                            <LogIn />
                            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Вход</span>
                        </Link>
                        <Link to="/registration" className="block p-2 rounded hover:bg-gray-700">
                            <CheckCircle />
                            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Регистрация</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;