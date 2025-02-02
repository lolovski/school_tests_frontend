// src/routes/teacher/class/ClassEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classService from "../../../services/class.service.jsx";
import { BackButton } from "../../../components/UI/buttons/BackButton.jsx";

export default function ClassEdit() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchClass = async () => {
            const classData = await classService.getClass(classId);
            setName(classData.name);
        };
        fetchClass();
    }, [classId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await classService.updateClass(classId, { name });
            navigate('/teacher/class');
        } catch (error) {
            console.error("Error updating class:", error);
        }
    };

    return (
        <div className='m-10'>
            <BackButton />
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Редактировать класс</h1>
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
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    );
}