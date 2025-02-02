// src/routes/teacher/class/ClassRoot.jsx
import React, { useEffect, useState } from 'react';
import { Form, Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { HomeButton } from "../../../components/UI/buttons/BackButton.jsx";
import classService from "../../../services/class.service.jsx";

export default function ClassRoot() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const [classes, setClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            if (user.status_id !== 2) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchClasses = async () => {
            const classesData = await classService.getClasses();
            setClasses(classesData);
        };
        fetchClasses();
    }, []);

    const handleEditClass = (classId) => {
        navigate(`/teacher/class/${classId}/edit/`);
    };

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">
            <div className="w-3/4 p-10">
                <HomeButton />
                <h1 className="text-sky-600 text-5xl font-medium pb-10">Управление классами</h1>
                <div className="flex justify-between items-center mb-10">
                    <Form action='add'>
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300">
                            Создать новый класс
                        </button>
                    </Form>
                    <input
                        type="text"
                        placeholder="Поиск по классам"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-1/3 p-2 border rounded"
                    />
                </div>
                <ul className="pl-5 pb-10">
                    {filteredClasses.map((cls) => (
                        <li key={cls.id} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                            <h2 className="text-2xl font-medium pb-5">{cls.name}</h2>
                            <button
                                onClick={() => handleEditClass(cls.id)}
                                className="px-8 py-4 mt-5 bg-blue-500 text-white rounded"
                            >
                                Редактировать класс
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-1/4 p-5">
                <div>
                    <label htmlFor="category_id" className="block text-xl font-medium leading-6 dark:text-white">Категории</label>
                    {/* Здесь можно добавить логику для фильтрации по категориям, если необходимо */}
                </div>
            </div>
        </div>
    );
}