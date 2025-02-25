// src/routes/teacher/problem/ProblemAdd.jsx
import { Form, redirect, useActionData, useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import {BackButton, HomeButton} from "../../../components/UI/buttons/BackButton.jsx";
import React, { useEffect, useState } from "react";
import problemService from "../../../services/problem.service.jsx";
import problemCategoryService from "../../../services/problemCategory.service.jsx";
import difficultyLevelService from "../../../services/difficultyLevel.service.jsx";
import testService from "../../../services/test.service.jsx";

export async function loader() {
    const problemCategories = await problemCategoryService.getProblemCategories();
    const difficultyLevels = await difficultyLevelService.getDifficultyLevels();
    return { problemCategories, difficultyLevels };
}

export async function action({ request }) {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    const problemData = {
        name: values.name,
        description: values.description,
        category_id: values.category_id,
        difficulty_level_id: values.difficulty_level_id,
        memory_limit: values.memory_limit,
        time_limit: values.time_limit
    };

    try {
        const problemResponse = await problemService.createProblem(problemData);
        const problemId = problemResponse.id;

        const testInputs = Object.keys(values)
            .filter(key => key.startsWith('input_'))
            .map(key => values[key]);

        const testOutputs = Object.keys(values)
            .filter(key => key.startsWith('output_'))
            .map(key => values[key]);
        for (let i = 0; i < testInputs.length; i++) {
            await testService.createTest({
                problem_id: problemId,
                input_data: testInputs[i],
                output_data: testOutputs[i]
            });
        }

        return redirect('/teacher/problem');
    } catch (error) {
        console.error('Error creating problem or tests:', error);
        return { error: 'Произошла ошибка при создании задачи' };
    }
}

export default function AddProblem() {
    const navigate = useNavigate();
    const actionData = useActionData();
    const { problemCategories, difficultyLevels } = useLoaderData();
    const [tests, setTests] = useState([{ input: '', output: '' }]);

    useEffect(() => {
        if (actionData?.redirect) {
            navigate(actionData.redirect);
        }
    }, [actionData, navigate]);

    const addTest = () => {
        setTests([...tests, { input: '', output: '' }]);
    };

    const removeTest = (index) => {
        setTests(tests.filter((_, i) => i !== index));
    };

    const handleTestChange = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = value;
        setTests(newTests);
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight dark:text-white">Новая задача</h2>
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
                            <label htmlFor="description" className="block text-xl font-medium leading-6 dark:text-white">Описание</label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите описание"
                                    required
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
                                    required
                                >
                                    <option value="">Выберите категорию</option>
                                    {problemCategories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
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
                                    required
                                >
                                    <option value="">Выберите уровень сложности</option>
                                    {difficultyLevels.map(level => (
                                        <option key={level.id} value={level.id}>{level.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="memory_limit" className="block text-xl font-medium leading-6 dark:text-white">Ограничение памяти</label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    id="memory_limit"
                                    name="memory_limit"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите ограничение памяти"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="time_limit" className="block text-xl font-medium leading-6 dark:text-white">Ограничение времени</label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    id="time_limit"
                                    name="time_limit"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите ограничение времени"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xl font-medium leading-6 dark:text-white">Тесты</label>
                            {tests.map((test, index) => (
                                <div key={index} className="mt-2">
                                    <input
                                        type="text"
                                        name={`input_${index}`}
                                        value={test.input}
                                        onChange={(e) => handleTestChange(index, 'input', e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                        placeholder="Введите входные данные"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name={`output_${index}`}
                                        value={test.output}
                                        onChange={(e) => handleTestChange(index, 'output', e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                        placeholder="Введите выходные данные"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTest(index)}
                                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Удалить тест
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addTest}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Добавить тест
                            </button>
                        </div>
                        <div className='flex items-center gap-10'>
                            <button type="submit" className="px-8 p-4">
                                Добавить
                            </button>
                            <BackButton />
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}