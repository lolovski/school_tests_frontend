// src/routes/teacher/user/UserCards.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../../../services/user.service.jsx';
import cardService from '../../../services/card.service.jsx';
import cardCategoryService from '../../../services/cardCategory.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import { BackButton } from "../../../components/UI/buttons/BackButton.jsx";
import cardUserService from "../../../services/cardUser.service.jsx";

export default function UserCards() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [student, setStudent] = useState(null);
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchStudentAndCards = async () => {
            const studentData = await userService.getUser(userId);
            setStudent(studentData);

            const cardsData = await cardUserService.getFullUserCards(userId);
            setCards(cardsData);
            setFilteredCards(cardsData);

            const categoriesData = await cardCategoryService.getCardCategories();
            setCategories(categoriesData);
        };
        fetchStudentAndCards();
    }, [userId]);
    useEffect(() => {
        let filtered = cards;
        if (searchQuery) {
            filtered = filtered.filter(card =>
                card.card.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory) {
            filtered = filtered.filter(card => card.card.category_id === parseInt(selectedCategory));
        }
        setFilteredCards(filtered);
    }, [searchQuery, selectedCategory, cards]);
    const handleExpandCard = (cardId) => {
        setExpandedCard(cardId === expandedCard ? null : cardId);
    };


    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10">
            <BackButton />
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Карточки пользователя: {student.last_name} {student.first_name} {student.middle_name}</h1>
            <div className="flex justify-between items-center mb-10">
                <input
                    type="text"
                    placeholder="Поиск по карточкам"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-1/3 p-2 border rounded"
                />

                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-1/3 p-2 border rounded"
                >
                    <option value="">Все категории</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <ul className="pl-5 pb-10">
                {filteredCards.map(card => (
                    <li key={card.card.id} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-medium">{card.card.name} (Вариант {card.card.variant})</h2>
                            <button
                                onClick={() => handleExpandCard(card.card.id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                {expandedCard === card.card.id ? 'Свернуть' : 'Развернуть'}
                            </button>
                        </div>
                        {expandedCard === card.card.id && (
                            <div className="mt-4">
                                <table className="min-w-full bg-gray-500 border border-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 text-center">Индекс задания
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-center">Номер задания
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-center">Ответ ученика
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-center">Правильный
                                            ответ
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {card.tasks.map((task_user, index) => (
                                        <tr key={task_user.task.id} className="border-b border-gray-200">
                                            <td className="py-2 px-4 text-center">{index + 1}</td>
                                            <td className="py-2 px-4 text-center">{task_user.task.id}</td>
                                            <td className={`py-2 px-4 text-center ${task_user.user_answer === task_user.user_task ? 'text-green-500' : 'text-red-500'}`}>
                                                {task_user.user_task}
                                            </td>
                                            <td className="py-2 px-4 text-center">{task_user.task.answer}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}