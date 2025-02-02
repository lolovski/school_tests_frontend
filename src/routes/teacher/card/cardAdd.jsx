import React, { useState, useEffect } from 'react';
import {Form, useNavigate, useActionData, useLoaderData, redirect} from 'react-router-dom';
import cardTaskService from '../../../services/cardTask.service.jsx';
import taskService from '../../../services/task.service.jsx';
import cardService from "../../../services/card.service.jsx";
import cardCategoryService from "../../../services/cardCategory.service.jsx";
import RadioButton from "../../../components/UI/buttons/radioButton.jsx";
import {BackButton} from "../../../components/UI/buttons/BackButton.jsx";

export async function action({ request }) {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    // Создаем объект для карточки
    const cardData = {
        name: values.name,
        variant: values.variant,
        category_id: values.category_id,
        is_active: values.is_active
    };

    try {
        // Создаем карточку
        const cardResponse = await cardService.createCard(cardData);
        const cardId = cardResponse.id;

        // Получаем ID заданий
        const taskIds = Object.keys(values)
            .filter(key => key.startsWith('task_'))
            .map(key => parseInt(values[key]));
        for (const taskId of taskIds) {
            await cardTaskService.createCardTask({
                card_id: cardId,
                task_id: taskId
            });
        }

        return redirect('/teacher/card')
    } catch (error) {
        console.error('Error creating card or card tasks:', error);
        return { error: 'Произошла ошибка при создании карточки заданий' };
    }
}
export async function loader(){
    const tasks = await taskService.getTasks();
    const cardCategories = await cardCategoryService.getCardCategories();
    return { tasks, cardCategories };
}

export default function AddCard() {
    const navigate = useNavigate();
    const actionData = useActionData();
    const { tasks, cardCategories } = useLoaderData()
    const [taskCount, setTaskCount] = useState(1);
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

                <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight dark:text-white">Новая
                    карточка</h2>
                {actionData?.error && (
                    <div className="mt-4 p-2 text-center text-red-600 border border-red-600 rounded">
                        {actionData.error}
                    </div>
                )}
                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <Form method="post" className="space-y-6">
                        <div>
                            <label htmlFor="name"
                                   className="block text-xl font-medium leading-6 dark:text-white">Название</label>
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
                            <label htmlFor="number" className="block text-xl font-medium leading-6 dark:text-white">Номер
                                варианта</label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    min="1"
                                    id="variant"
                                    name="variant"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите номер варианта"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="category_id"
                                   className="block text-xl font-medium leading-6 dark:text-white">Категория</label>
                            <div className="mt-2">
                                <select
                                    id="category_id"
                                    name="category_id"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                >
                                    <option value="">Выберите категорию</option>
                                    {cardCategories.map((cardCategory) => (
                                        <option key={cardCategory.id} value={cardCategory.id}>
                                            {cardCategory.name}
                                        </option>
                                    ))}
                                </select>
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
                        <div>
                            <label htmlFor="number" className="block text-xl font-medium leading-6 dark:text-white">Количество
                                заданий</label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    id="task_count"
                                    value={taskCount}
                                    onChange={(e) => setTaskCount(parseInt(e.target.value))}
                                    min="1"
                                    className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    placeholder="Введите номер задания"
                                />
                            </div>
                        </div>
                        {[...Array(taskCount)].map((_, index) => (
                            <div key={index}>
                                <label htmlFor={`task_${index}`}
                                       className="block text-xl font-medium leading-6 dark:text-white">Задание {index + 1}</label>
                                <div className="mt-2">
                                    <select
                                        name={`task_${index}`}
                                        id={`task_${index}`}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                    >
                                        <option value="">Выберите задание</option>
                                        {tasks.map((task) => (
                                            <option key={task.id} value={task.id}>
                                                {task.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
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