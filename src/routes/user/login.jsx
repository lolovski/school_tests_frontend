import React, { useState } from 'react';
import { Form, useNavigate } from "react-router-dom";
import { HomeButton, RoleRadio } from "../../components/UI/buttons/BackButton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const values = Object.fromEntries(formData);
        try {
            await login(values);
            navigate(values.status_id === 2 ? '/teacher' : values.status_id === 3 ? '/admin' : '/');
        } catch (error) {
            setErrorMessage(error.message || 'Произошла ошибка при входе');
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight dark:text-white">Войти</h2>

            <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                <Form onSubmit={handleSubmit} className="space-y-6">

                    {errorMessage && (
                        <div className=" border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Ошибка!</strong>
                            <span className="block sm:inline"> {errorMessage}</span>
                        </div>
                    )}
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-xl font-medium leading-6 dark:text-white">Почта</label>
                        <div className="mt-2">
                            <input
                                type="email"
                                id="email"
                                name="email"
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
                                className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                placeholder="Введите пароль"
                                required
                            />
                        </div>
                    </div>

                    <div className='flex items-center gap-10'>
                        <button type="submit" className="px-8 p-4">
                            Войти
                        </button>
                        <HomeButton />
                    </div>
                </Form>
            </div>
        </div>
    );
}