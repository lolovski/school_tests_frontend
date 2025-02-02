import { Form, Link, Outlet, redirect, useActionData, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import {BackButton, HomeButton} from "../../../components/UI/buttons/BackButton.jsx";
import React, { useEffect, useState } from "react";
import taskService from "../../../services/task.service.jsx";
import taskCategoryService from "../../../services/taskCategory.service.jsx";
import difficultyLevelService from "../../../services/difficultyLevel.service.jsx";
import RadioButton from "../../../components/UI/buttons/radioButton.jsx";


export async function loader() {
    const taskCategories = await taskCategoryService.getTaskCategories();
    const difficultyLevels = await difficultyLevelService.getDifficultyLevels();
    return { taskCategories, difficultyLevels };
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    const response = await taskService.createTask(values)
        .catch(error => {
            return 'Ошибка';
        });
    return redirect(`/teacher/task`);
}

export default function AddTask() {
    const navigate = useNavigate();
    const actionData = useActionData();
    const [error, setError] = useState();
    const { taskCategories, difficultyLevels } = useLoaderData();
    const [isActive, setIsActive] = useState('true'); // Устанавливаем значение по умолчанию

    useEffect(() => {
        if (actionData?.redirect) {
            navigate(actionData.redirect);
        }
    }, [actionData, navigate]);

    const handleRadioChange = (event) => {
        setIsActive(event.target.value);
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight dark:text-white">Новое задание</h2>
                {actionData?.error && (
                    <div className="mt-4 p-2 text-center text-red-600 border border-red-600 rounded">
                        {actionData.error}
                    </div>
                )}
                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <Form method="post" className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-xl font-medium leading-6 dark:text-white">Название</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите название"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="number" className="block text-xl font-medium leading-6 dark:text-white">Номер задания</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="number"
                                    name="number"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите номер задания"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="solution_url" className="block text-xl font-medium leading-6 dark:text-white">Ссылка на решение</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="solution_url"
                                    name="solution_url"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите ссылку на решение"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category_id" className="block text-xl font-medium leading-6 dark:text-white">Категория</label>
                            <div className="mt-2">
                                <select
                                    id="category_id"
                                    name="category_id"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                >
                                    <option value="">Выберите категорию</option>
                                    {taskCategories.map((taskCategory) => (
                                        <option key={taskCategory.id} value={taskCategory.id}>
                                            {taskCategory.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="difficulty_level_id" className="block text-xl font-medium leading-6 dark:text-white">Уровень сложности</label>
                            <div className="mt-2">
                                <select
                                    id="difficulty_level_id"
                                    name="difficulty_level_id"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                >
                                    <option value="">Выберите уровень сложности</option>
                                    {difficultyLevels.map((difficultyLevel) => (
                                        <option key={difficultyLevel.id} value={difficultyLevel.id}>
                                            {difficultyLevel.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="answer" className="block text-xl font-medium leading-6 dark:text-white">Ответ</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="answer"
                                    name="answer"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите ответ на задание"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="text" className="block text-xl font-medium leading-6 dark:text-white">Текст задания</label>
                            <div className="mt-2">
                                <textarea
                                    id="text"
                                    name="text"
                                    rows="4"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4 resize-y"
                                    placeholder="Введите текст задания"
                                ></textarea>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xl font-medium leading-6 dark:text-white">Активность</label>
                            <div className="mt-2 flex space-x-4">
                                <RadioButton
                                    label="Активен"
                                    value="true"
                                    checked={isActive === 'true'}
                                    onChange={handleRadioChange}
                                />
                                <RadioButton
                                    label="Неактивен"
                                    value="false"
                                    checked={isActive === 'false'}
                                    onChange={handleRadioChange}
                                />
                            </div>
                        </div>

                        {/* Скрытое поле для is_active */}
                        <input
                            type="hidden"
                            name="is_active"
                            value={isActive}
                        />

                        <div className='flex items-center gap-10'>
                            <button type="submit" className="px-8 p-4">
                                Добавить
                            </button>
                            <BackButton/>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}