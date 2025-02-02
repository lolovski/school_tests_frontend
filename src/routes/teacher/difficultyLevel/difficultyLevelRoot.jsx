import {Form, Link, Outlet, useLoaderData, useNavigate, useNavigation} from "react-router-dom";
import {useAuth} from "../../../context/AuthContext.jsx";
import {HomeButton} from "../../../components/UI/buttons/BackButton.jsx";
import React, {useEffect, useState} from "react";
import difficultyLevelService from "../../../services/difficultyLevel.service.jsx";

export async function loader() {
    const difficultyLevels = await difficultyLevelService.getDifficultyLevels();
    return {difficultyLevels};
}

export default function DifficultyLevelRoot() {
    const navigate = useNavigate();
    const {difficultyLevels: initialDifficultyLevels} = useLoaderData();
    const {user, logout} = useAuth();
    const navigation = useNavigation();
    const [filteredDifficultyLevels, setFilteredDifficultyLevels] = useState(initialDifficultyLevels);
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
        const filtered = initialDifficultyLevels.filter(level =>
            level.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDifficultyLevels(filtered);
    }, [searchQuery, initialDifficultyLevels]);

    const handleEditLevel = (levelId) => {
        navigate(`/teacher/difficulty_level/${levelId}/edit`);
    };

    return (
        <div className="flex">
            <div className="w-3/4 p-10">
                <HomeButton/>
                <h1 className="text-sky-600 text-5xl font-medium pb-10">Управление уровнями сложности</h1>
                <div className="flex justify-between items-center mb-10">
                    <Form action='add'>
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300">
                            Создать новый уровень
                        </button>
                    </Form>
                    <input
                        type="text"
                        placeholder="Поиск по уровням"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-1/3 p-2 border rounded"
                    />
                </div>
                <ul className="pl-5 pb-10">
                    {filteredDifficultyLevels.map((difficultyLevel) => (
                        <li key={difficultyLevel.id} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                            <h2 className="text-2xl font-medium pb-5">{difficultyLevel.name}</h2>
                            <button
                                onClick={() => handleEditLevel(difficultyLevel.id)}
                                className="px-8 py-4 mt-5 bg-blue-500 text-white rounded"
                            >
                                Редактировать уровень
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}