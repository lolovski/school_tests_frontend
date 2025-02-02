// src/routes/teacher/class/ClassAdd.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classService from "../../../services/class.service.jsx";
import { BackButton } from "../../../components/UI/buttons/BackButton.jsx";

export default function ClassAdd() {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await classService.createClass({ name });
            navigate('/teacher/class');
        } catch (error) {
            console.error("Error creating class:", error);
        }
    };

    return (
        <div className='m-10'>
            <BackButton />
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Добавить класс</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Название класса
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Введите название класса"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Добавить
                    </button>
                </div>
            </form>
        </div>
    );
}