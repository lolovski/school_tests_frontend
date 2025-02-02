import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import taskService from "../../../services/task.service.jsx";
import { BackButton } from "../../../components/UI/buttons/BackButton.jsx";
import taskCategoryService from "../../../services/taskCategory.service.jsx";
import {useAuth} from "../../../context/AuthContext.jsx";

export async function loader() {
    const tasks = await taskService.getTasks();
    const categories = await taskCategoryService.getTaskCategories(0);
    return { tasks, categories };
}

export default function UserTasksRoot() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const { tasks: initialTasks, categories: initialCategories } = useLoaderData();
    const [visibleAnswers, setVisibleAnswers] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState(initialCategories);
    const [filteredTasks, setFilteredTasks] = useState(initialTasks);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        if (selectedCategories.length > 0) {
            const lastSelectedCategoryId = selectedCategories[selectedCategories.length - 1].id;
            fetchChildCategoriesAndTasks(lastSelectedCategoryId);
        } else {
            setFilteredTasks(initialTasks);
            setAvailableCategories(initialCategories);
        }
    }, [selectedCategories]);

    const fetchChildCategoriesAndTasks = async (categoryId) => {
        try {
            const [childCats, tasksForCategory] = await Promise.all([
                taskCategoryService.getTaskCategories(categoryId),
                taskService.getTasks(categoryId)
            ]);
            setAvailableCategories(childCats);
            setFilteredTasks(tasksForCategory);
        } catch (error) {
            console.error("Error fetching child categories and tasks:", error);
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

    const toggleAnswerVisibility = (taskId) => {
        setVisibleAnswers((prevState) => ({
            ...prevState,
            [taskId]: !prevState[taskId],
        }));
    };
    const filteredTasksList = filteredTasks.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <>
            <div
                id="detail"
                className={navigation.state === "loading" ? "loading" : " "}
            >
            </div>

            <div className='m-10 flex'>
                <div className="w-3/4 pr-5">
                    <BackButton/>
                    <h1 className="text-sky-600 text-5xl font-medium pb-5">Задания</h1>
                    <input
                        type="text"
                        placeholder="Поиск по карточкам"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />

                    <ul className="py-5">
                        {filteredTasksList.map((task) => (
                            <li key={task.id} className="mb-5">
                                <button
                                    onClick={() => toggleAnswerVisibility(task.id)}
                                    className='border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg text-left'
                                >
                                    <h1 className="text-xl font-medium pb-5">{task.name}</h1>
                                    {task.text}
                                    {visibleAnswers[task.id] && (
                                        <div className="mt-2 p-3 rounded-lg">
                                            <p>Ответ: {task.answer}</p>
                                        </div>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-1/4">
                    <div>
                        <label htmlFor="category_id"
                               className="block text-xl font-medium leading-6 dark:text-white">Категории</label>
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
        </>
    );
}