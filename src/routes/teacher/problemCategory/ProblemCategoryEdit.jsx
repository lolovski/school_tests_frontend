// src/routes/teacher/problemCategory/ProblemCategoryEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import problemCategoryService from '../../../services/problemCategory.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import { BackButton } from "../../../components/UI/buttons/BackButton.jsx";

export default function EditProblemCategory() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [category, setCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchCategory = async () => {
            const categoryData = await problemCategoryService.getProblemCategory(categoryId);
            setCategory(categoryData);
            setCategoryName(categoryData.name);
        };
        fetchCategory();
    }, [categoryId]);

    const handleSaveChanges = async () => {
        await problemCategoryService.updateProblemCategory(categoryId, { name: categoryName });
        navigate(`/teacher/problem_category`);
    };

    if (!category) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Редактирование категории: {category.name}</h1>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Название категории:</label>
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className='flex items-center gap-10'>
                <button
                    onClick={handleSaveChanges}
                    className="px-8 py-4 bg-green-500 text-white rounded"
                >
                    Сохранить изменения
                </button>
                <BackButton />
            </div>
        </div>
    );
}