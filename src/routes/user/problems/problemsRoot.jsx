// src/routes/user/problems/ProblemsRoot.jsx
import { Form, Link, Outlet, redirect, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { HomeButton } from "../../../components/UI/buttons/BackButton.jsx";
import React, { useEffect, useState } from "react";
import problemService from "../../../services/problem.service.jsx";
import problemCategoryService from "../../../services/problemCategory.service.jsx";
import authService from "../../../services/auth.service.jsx";

export async function loader() {
    const auth = await authService.checkAuth();
    if (!auth) {
        return redirect('/login');
    }
    const problems = await problemService.getProblems();
    const categories = await problemCategoryService.getProblemCategories(0);
    return { problems, categories };
}

export default function ProblemsRoot() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { problems: initialProblems, categories: initialCategories } = useLoaderData();

    const navigation = useNavigation();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState(initialCategories);
    const [filteredProblems, setFilteredProblems] = useState(initialProblems);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (selectedCategories.length > 0) {
            const lastSelectedCategoryId = selectedCategories[selectedCategories.length - 1].id;
            fetchChildCategoriesAndProblems(lastSelectedCategoryId);
        } else {
            setFilteredProblems(initialProblems);
            setAvailableCategories(initialCategories);
        }
    }, [selectedCategories]);

    const fetchChildCategoriesAndProblems = async (categoryId) => {
        try {
            const [childCats, problemsForCategory] = await Promise.all([
                problemCategoryService.getProblemCategories(categoryId),
                problemService.getProblems(categoryId)
            ]);
            setAvailableCategories(childCats);
            setFilteredProblems(problemsForCategory);
        } catch (error) {
            console.error("Error fetching child categories and problems:", error);
        }
    };

    const handleChangeCategory = (event) => {
        const categoryId = event.target.value;
        if (categoryId) {
            const category = availableCategories.find(cat => cat.id === parseInt(categoryId));
            setSelectedCategories(prev => [...prev, category]);
        }
    };

    const handleClearCategory = (index) => {
        setSelectedCategories(prev => prev.slice(0, index));
    };

    const handleGoToProblem = (problemId) => {
        navigate(`/problems/${problemId}/progress`);
    };

    const filteredProblemsList = filteredProblems.filter(problem =>
        problem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">
            <div className="w-3/4 p-10">
                <HomeButton />
                <h1 className="text-sky-600 text-5xl font-medium pb-10">Задачи</h1>
                <div className="flex justify-between items-center mb-10">
                    <input
                        type="text"
                        placeholder="Поиск по задачам"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-1/3 p-2 border rounded"
                    />
                </div>
                <ul className="pl-5 pb-10">
                    {filteredProblemsList.map((problem) => (
                        <li key={problem.id} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                            <h2 className="text-2xl font-medium pb-5">{problem.name}</h2>
                            <p><strong>Описание:</strong> {problem.description}</p>
                            <div className="flex space-x-4 mt-5">
                                <button
                                    onClick={() => handleGoToProblem(problem.id)}
                                    className="px-4 py-1 bg-blue-500 text-white rounded"
                                >
                                    Перейти к задаче
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-1/4 p-5">
                <div>
                    <label htmlFor="category_id" className="block text-xl font-medium leading-6 dark:text-white">Категории</label>
                    {selectedCategories.map((category, index) => (
                        <div key={index} className="mt-2 relative">
                            <div className="flex items-center">
                                <span className="mr-2 dark:text-white">{category.name}</span>
                                <button
                                    onClick={() => handleClearCategory(index)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    &#x2715;
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-2 relative">
                        <select
                            id="category_id"
                            name="category_id"
                            value=""
                            onChange={handleChangeCategory}
                            className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                        >
                            <option value="">Выберите категорию</option>
                            {availableCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}