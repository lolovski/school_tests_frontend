import {Form, Link, Outlet, useLoaderData, useNavigate, useNavigation} from "react-router-dom";
import {useAuth} from "../../../context/AuthContext.jsx";
import {HomeButton} from "../../../components/UI/buttons/BackButton.jsx";
import React, {useEffect, useState} from "react";
import taskCategoryService from "../../../services/taskCategory.service.jsx";

export async function loader() {
    const taskCategories = await taskCategoryService.getTaskCategories();
    return {taskCategories};
}

export default function TaskCategoryRoot() {
    const navigate = useNavigate();
    const {taskCategories: initialTaskCategories} = useLoaderData();
    const {user, logout} = useAuth();
    const navigation = useNavigation();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState(initialTaskCategories);
    const [filteredTaskCategories, setFilteredTaskCategories] = useState(initialTaskCategories);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            if (user.status_id !== 2) {
                navigate('/');
            }
        } else {
            navigate('/')
        }
    }, [user, navigate]);

    useEffect(() => {
        if (selectedCategories.length > 0) {
            const lastSelectedCategoryId = selectedCategories[selectedCategories.length - 1].id;
            fetchChildCategoriesAndTasks(lastSelectedCategoryId);
        } else {
            setFilteredTaskCategories(initialTaskCategories);
            setAvailableCategories(initialTaskCategories);
        }
    }, [selectedCategories]);

    const fetchChildCategoriesAndTasks = async (categoryId) => {
        try {
            const childCats = await taskCategoryService.getTaskCategories(categoryId);
            setAvailableCategories(childCats);
            setFilteredTaskCategories(childCats);
        } catch (error) {
            console.error("Error fetching child categories:", error);
        }
    };

    const handleChangeCategory = (event) => {
        const categoryId = parseInt(event.target.value, 10); // Преобразование в целое число
        if (categoryId) {
            const category = availableCategories.find(cat => cat.id === categoryId);
            setSelectedCategories(prev => [...prev, category]);
        }
    };

    const handleClearCategory = (index) => {
        setSelectedCategories(prev => prev.slice(0, index));
    };

    const handleEditCategory = (categoryId) => {
        navigate(`/teacher/task_category/${categoryId}/edit`);
    };

    // Filter categories based on search query
    const filteredTaskCategoriesList = filteredTaskCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">
            <div className="w-3/4 p-10">
                <HomeButton/>
                <h1 className="text-sky-600 text-5xl font-medium pb-10">Управление категориями заданий</h1>
                <div className="flex justify-between items-center mb-10">
                    <Form action='add'>
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300">
                            Создать новую категорию
                        </button>
                    </Form>
                    <input
                        type="text"
                        placeholder="Поиск по категориям"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-1/3 p-2 border rounded"
                    />
                </div>
                <ul className="pl-5 pb-10">
                    {filteredTaskCategoriesList.map((taskCategory) => (
                        <li key={taskCategory.id} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                            <h2 className="text-2xl font-medium pb-5">{taskCategory.name}</h2>
                            <button
                                onClick={() => handleEditCategory(taskCategory.id)}
                                className="px-8 py-4 mt-5 bg-blue-500 text-white rounded"
                            >
                                Редактировать категорию
                            </button>
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