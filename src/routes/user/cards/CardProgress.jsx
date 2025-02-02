import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cardService from '../../../services/card.service.jsx';
import taskService from '../../../services/task.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";

export default function CardProgress() {
    const { user, logout } = useAuth();
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchCardAndTasks = async () => {
            const cardData = await cardService.getCard(cardId);
            setCard(cardData);
            const tasksData = await taskService.getCardTasks(cardId);
            setTasks(tasksData);
        };
        fetchCardAndTasks();
    }, [cardId]);

    const handleAnswerChange = (e) => {
        setUserAnswers({
            ...userAnswers,
            [tasks[currentTaskIndex].id]: e.target.value
        });
    };

    const goToNextTask = () => {
        if (currentTaskIndex < tasks.length - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1);
        } else {
            submitAnswers();
        }
    };

    const goToPreviousTask = () => {
        if (currentTaskIndex > 0) {
            setCurrentTaskIndex(currentTaskIndex - 1);
        }
    };

    const submitAnswers = async () => {
        await taskService.submitAnswers(cardId, userAnswers, user.id);
        setShowResults(true);
    };

    if (!card || tasks.length === 0) {
        return <div>Loading...</div>;
    }

    if (showResults) {
        const correctAnswersCount = tasks.filter(task => userAnswers[task.id] === task.answer).length;

        return (
            <div className="flex flex-col items-center p-4">
                <h2 className="text-2xl font-bold mb-4">Результаты</h2>
                <p className="text-lg mb-4">Правильных ответов: {correctAnswersCount} из {tasks.length}</p>
                <div className="w-full max-w-2xl">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 text-center">Индекс задания</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-center">Номер задания</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-center">Ваш ответ</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-center">Правильный ответ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task, index) => (
                            <tr key={task.id} className="border-b border-gray-200">
                                <td className="py-2 px-4 text-center">{index + 1}</td>
                                <td className="py-2 px-4 text-center">{task.id}</td>
                                <td className={`py-2 px-4 text-center ${userAnswers[task.id] === task.answer ? 'text-green-500' : 'text-red-500'}`}>
                                    {userAnswers[task.id]}
                                </td>
                                <td className="py-2 px-4 text-center">{task.answer}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={() => navigate('/cards')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Вернуться к карточкам
                </button>
            </div>
        );
    }

    const currentTask = tasks[currentTaskIndex];

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex space-x-4 mb-4">
                {tasks.map((task, index) => (
                    <button
                        key={task.id}
                        className={`px-4 py-2 border rounded ${index === currentTaskIndex ? 'bg-blue-500/50 text-white' : ''}`}
                        onClick={() => setCurrentTaskIndex(index)}
                    >
                        Задание {index + 1}
                    </button>
                ))}
            </div>
            <div className="w-full max-w-lg p-6 border rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{card.name}</h2>
                <h3 className="text-xl font-semibold mb-4">Задание {currentTaskIndex + 1} из {tasks.length}</h3>
                <p className="mb-4">{currentTask.text}</p>
                <textarea
                    value={userAnswers[currentTask.id] || ''}
                    onChange={handleAnswerChange}
                    placeholder="Введите ваш ответ"
                    className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-between">
                    <button
                        onClick={goToPreviousTask}
                        disabled={currentTaskIndex === 0}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Предыдущее
                    </button>
                    <button
                        onClick={goToNextTask}
                        className="px-4 py-2 bg-gray-200 text-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded"
                    >
                        {currentTaskIndex === tasks.length - 1 ? 'Завершить' : 'Следующее'}
                    </button>
                </div>
            </div>
        </div>
    );
}