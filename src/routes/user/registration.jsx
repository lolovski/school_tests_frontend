import { Form, redirect, useNavigate, useActionData } from "react-router-dom";
import authService from "../../services/auth.service";
import React, { useEffect, useState } from "react";
import { HomeButton } from "../../components/UI/buttons/BackButton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export async function action({ request }) {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    try {
        await authService.register(values);
        return redirect('/login');
    } catch (error) {
        return { error: error.message || 'ФИО должно содержать только кириллицу, пароль должен быть сложным' };
    }
}

export default function Registration() {
    const navigate = useNavigate();
    const actionData = useActionData();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        last_name: '',
        first_name: '',
        middle_name: '',
        class_id: '',
        email: '',
        password: '',
    });

    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch(`http://localhost:8000/class/`);
                const data = await response.json();
                setClasses(data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };
        fetchClasses();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight dark:text-white">Регистрация</h2>
                {actionData?.error && (
                    <div className="mt-4 p-2 text-center text-red-600 border border-red-600 rounded">
                        {actionData.error}
                    </div>
                )}
                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <Form method="post" className="space-y-6">
                        {/* Last Name Field */}
                        <div>
                            <label htmlFor="last_name" className="block text-xl font-medium leading-6 dark:text-white">Фамилия</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите вашу фамилию"
                                    required
                                />
                            </div>
                        </div>

                        {/* First Name Field */}
                        <div>
                            <label htmlFor="first_name" className="block text-xl font-medium leading-6 dark:text-white">Имя</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите ваше имя"
                                    required
                                />
                            </div>
                        </div>

                        {/* Middle Name Field */}
                        <div>
                            <label htmlFor="middle_name" className="block text-xl font-medium leading-6 dark:text-white">Отчество</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="middle_name"
                                    name="middle_name"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите ваше отчество"
                                    required
                                />
                            </div>
                        </div>

                        {/* Class Select */}
                        <div>
                            <label htmlFor="class_id" className="block text-xl font-medium leading-6 dark:text-white">Класс</label>
                            <div className="mt-2">
                                <select
                                    id="class_id"
                                    name="class_id"
                                    value={formData.class_id}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    required
                                >
                                    <option value="">Выберите класс</option>
                                    {classes.map((classItem) => (
                                        <option key={classItem.id} value={classItem.id}>
                                            {classItem.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-xl font-medium leading-6 dark:text-white">Почта</label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите вашу почту"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-xl font-medium leading-6 dark:text-white">Пароль</label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите пароль"
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex items-center gap-10'>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Регистрация
                            </button>
                            <HomeButton />
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}