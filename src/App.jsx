// src/App.jsx
import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Sidebar from './components/UI/Sidebar.jsx';
import {useAuth} from "./context/AuthContext.jsx";

const App = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <div className="flex">
            <Sidebar {...{ user, logout, navigate }} />
            <div className="flex-1 ml-16">
                <Outlet />
            </div>
        </div>
    );
};

export default App;