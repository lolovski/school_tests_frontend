import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cardService from '../../../services/card.service.jsx';
import taskService from '../../../services/task.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import cardTaskService from "../../../services/cardTask.service.jsx";

export default function EditCardVariant() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [card, setCard] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [availableTasks, setAvailableTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState("");
    const [variantName, setVariantName] = useState("");
    const [variantNumber, setVariantNumber] = useState("");
    const [originalVariantName, setOriginalVariantName] = useState("");
    const [originalVariantNumber, setOriginalVariantNumber] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCardAndTasks = async () => {
            const cardData = await cardService.getCard(cardId);
            setCard(cardData);
            setVariantName(cardData.name);
            setVariantNumber(cardData.variant);
            setOriginalVariantName(cardData.name);
            setOriginalVariantNumber(cardData.variant);

            const cardTasks = await cardTaskService.getTasksByCard(cardId);
            const tasksData = await Promise.all(
                cardTasks.map(async (cardTask) => {
                    const task = await taskService.getTask(cardTask.task_id);
                    return task;
                })
            );
            setTasks(tasksData);

            const allTasks = await taskService.getTasks();
            setAvailableTasks(allTasks.filter(task => !tasksData.some(t => t.id === task.id)));
        };
        fetchCardAndTasks();
    }, [cardId]);

    const handleAddTask = async () => {
        if (selectedTask) {
            await cardTaskService.createCardTask({ card_id: cardId, task_id: selectedTask });
            const updatedTasks = await cardTaskService.getTasksByCard(cardId);
            const tasksData = await Promise.all(
                updatedTasks.map(async (cardTask) => {
                    const task = await taskService.getTask(cardTask.task_id);
                    return task;
                })
            );
            setTasks(tasksData);
            setAvailableTasks(availableTasks.filter(task => task.id !== selectedTask));
            setSelectedTask("");
        }
    };

    const handleRemoveTask = async (taskId) => {
        await cardTaskService.deleteCardTask(cardId, taskId);
        const updatedTasks = await cardTaskService.getTasksByCard(cardId);
        const tasksData = await Promise.all(
            updatedTasks.map(async (cardTask) => {
                const task = await taskService.getTask(cardTask.task_id);
                return task;
            })
        );
        setTasks(tasksData);
        const allTasks = await taskService.getTasks();
        setAvailableTasks(allTasks.filter(task => !tasksData.some(t => t.id === task.id)));
    };

    const handleSaveChanges = async () => {
        const hasChanges = variantName !== originalVariantName || variantNumber !== originalVariantNumber;

        if (hasChanges) {
            try {
                await cardService.updateCard(cardId, { name: variantName, variant: variantNumber });
                navigate(`/teacher/card`);
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    setError('Вариант с таким названием и номером уже существует.');
                } else {
                    setError('Произошла ошибка при сохранении изменений.');
                }
            }
        } else {
            navigate(`/teacher/card`);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (!card) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10">
            {error && (
                <div className="bg-red-50/5 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Ошибка!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Редактирование варианта карточки: {card.name}</h1>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Название варианта:</label>
                <input
                    type="text"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Номер варианта:</label>
                <input
                    type="number"
                    value={variantNumber}
                    onChange={(e) => setVariantNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Добавить задание:</label>
                <select
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Выберите задание</option>
                    {availableTasks.map(task => (
                        <option key={task.id} value={task.id}>{task.name}</option>
                    ))}
                </select>
                <button
                    onClick={handleAddTask}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Добавить
                </button>
            </div>
            <div className="mb-10">
                <h2 className="text-2xl font-medium pb-5">Задания:</h2>
                <ul className="pl-5 pb-10">
                    {tasks.map((task) => (
                        <li key={task.id}
                            className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                            <h2 className="text-2xl font-medium pb-5">{task.name}</h2>
                            <p><strong>Номер:</strong> {task.number}</p>
                            <p><strong>Текст:</strong> {task.text}</p>
                            <p><strong>Ответ:</strong> {task.answer}</p>
                            <button
                                onClick={() => handleRemoveTask(task.id)}
                                className="px-8 py-4 mt-5 bg-red-600 text-white rounded"
                            >
                                Удалить задание
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-between">
                <button
                    onClick={handleBack}
                    className="px-8 py-4 bg-gray-500 text-white rounded"
                >
                    Назад
                </button>
                <button
                    onClick={handleSaveChanges}
                    className="px-8 py-4 bg-green-500 text-white rounded"
                >
                    Сохранить изменения
                </button>
            </div>
        </div>
    );
}