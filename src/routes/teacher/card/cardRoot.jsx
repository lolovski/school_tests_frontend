import {Form, Link, Outlet, useLoaderData, useNavigate, useNavigation} from "react-router-dom";
import {useAuth} from "../../../context/AuthContext.jsx";
import {HomeButton} from "../../../components/UI/buttons/BackButton.jsx";
import React, {useEffect, useState} from "react";
import taskService from "../../../services/task.service.jsx";
import cardService from "../../../services/card.service.jsx";
import cardCategoryService from "../../../services/cardCategory.service.jsx";

export async function loader() {
    const cards = await cardService.getCards();
    const categories = await cardCategoryService.getCardCategories(0);
    return {cards, categories};
}

export default function CardRoot() {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    useEffect(() => {
        if (user) {
            if (user.status_id !== 2) {
                navigate('/');
            }
        } else {
            navigate('/')
        }
    }, [user, navigate]);

    const {cards: initialCards, categories: initialCategories} = useLoaderData();
    const navigation = useNavigation();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState(initialCategories);
    const [filteredCards, setFilteredCards] = useState(initialCards);
    const [variant, setVariant] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (selectedCategories.length > 0) {
            const lastSelectedCategoryId = selectedCategories[selectedCategories.length - 1].id;
            fetchChildCategoriesAndCards(lastSelectedCategoryId);
        } else {
            setFilteredCards(initialCards);
            setAvailableCategories(initialCategories);
        }
    }, [selectedCategories]);

    const fetchChildCategoriesAndCards = async (categoryId) => {
        try {
            const [childCats, CardsForCategory] = await Promise.all([
                cardCategoryService.getCardCategories(categoryId),
                cardService.getCards(categoryId)
            ]);
            setAvailableCategories(childCats);
            setFilteredCards(CardsForCategory);
        } catch (error) {
            console.error("Error fetching child categories and cards:", error);
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

    const handleVariantChange = (cardName, variantKey) => {
        setSelectedVariants(prev => ({
            ...prev,
            [cardName]: variantKey
        }));
    };

    const handleSubmit = (cardName, variants) => {
        const selectedVariant = selectedVariants[cardName];
        if (selectedVariant && variants[selectedVariant]) {
            const card = variants[selectedVariant];
            navigate(`/teacher/card/${card.id}/edit`);
        } else {
            console.error("No variant selected or variant not found");
        }
    };
    const handleGoToCard = (cardName, variants) => {
        const selectedVariant = selectedVariants[cardName];
        if (selectedVariant && variants[selectedVariant]) {
            const card = variants[selectedVariant];
            navigate(`/teacher/card/${card.id}/results`);
        } else {
            console.error("No variants found for the card");
        }
    };
    const handleGoToFullCard = (cardName, variants) => {
        const firstVariant = Object.values(variants)[0];
        if (firstVariant) {
            navigate(`/teacher/card/${firstVariant.id}/full-results`);
        } else {
            console.error("No variants found for the card");
        }
    };

    // Группировка карточек по названию
    const groupedCards = filteredCards.reduce((acc, card) => {
        if (!acc[card.name]) {
            acc[card.name] = {};
        }
        acc[card.name][card.variant] = card;
        return acc;
    }, {});

    const filteredGroupedCards = Object.entries(groupedCards).filter(([name, cards]) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-10">
            <HomeButton />
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Управление карточками</h1>
            <div className="flex justify-between items-center mb-10">

                <Form action='add'>
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300">
                        Создать новую карточку
                    </button>
                </Form>

                <input
                    type="text"
                    placeholder="Поиск по карточкам"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-1/3 p-2 border rounded"
                />
            </div>
            <div className="flex">
                <div className="w-3/4 pr-5">
                    <ul className="pl-5 pb-10">
                        {filteredGroupedCards.map(([name, variants]) => (
                            <li key={name} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                                <h2 className="text-2xl font-medium pb-5">{name}</h2>
                                <label htmlFor={`variant-${name}`} className="block text-xl font-medium leading-6 dark:text-white">Вариант</label>
                                <div className="mt-2">
                                    <select
                                        id={`variant-${name}`}
                                        name={`variant-${name}`}
                                        className="block w-30 rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                                        onChange={(e) => handleVariantChange(name, e.target.value)}
                                        value={selectedVariants[name] || ""}
                                    >
                                        <option value="">Выберите вариант</option>
                                        {Object.keys(variants).map((variantKey) => (
                                            <option key={variantKey} value={variantKey}>
                                                {variantKey}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex space-x-4 mt-5">
                                    <button
                                        type="button"
                                        onClick={() => handleSubmit(name, variants)}
                                        className="px-4 py-1 bg-blue-500 text-white rounded"
                                        disabled={!selectedVariants[name]}
                                    >
                                         Редактировать вариант
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleGoToCard(name, variants)}
                                        className="px-4 py-1 bg-green-500 text-white rounded"
                                    >
                                        Перейти к варианту
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleGoToFullCard(name, variants)}
                                        className="px-4 py-1 bg-green-500 text-white rounded"
                                    >
                                        Перейти к карточке
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-1/4 p-5">
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
        </div>
    );
}