// src/routes/teacher/problemCategory/ProblemCategoryAdd.jsx
import { Form, redirect, useActionData, useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { HomeButton } from "../../../components/UI/buttons/BackButton.jsx";
import React, { useEffect, useState } from "react";
import problemCategoryService from "../../../services/problemCategory.service.jsx";

export async function loader() {
    const categories = await problemCategoryService.getProblemCategories();
    return { categories };
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    const response = await problemCategoryService.createProblemCategory(values)
        .catch(error => {
            return 'Ошибка';
        });
    return redirect(`/teacher/problem_category`);
}

export default function AddProblemCategory() {
    const navigate = useNavigate();
    const actionData = useActionData();
    const { categories } = useLoaderData();
    const [error, setError] = useState();

    useEffect(() => {
        if (actionData?.redirect) {
            navigate(actionData.redirect);
        }
    }, [actionData, navigate]);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight dark:text-white">Новая категория задачи</h2>
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
                            <label htmlFor="parent_category_id" className="block text-xl font-medium leading-6 dark:text-white">Родительская категория</label>
                            <div className="mt-2">
                                <select
                                    id="parent_category_id"
                                    name="parent_category_id"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                >
                                    <option value={0}>Нет родительской категории</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex items-center gap-10'>
                            <button type="submit" className="px-8 p-4">
                                Добавить
                            </button>
                            <HomeButton />
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}