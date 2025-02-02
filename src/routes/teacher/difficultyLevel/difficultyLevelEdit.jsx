import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import difficultyLevelService from '../../../services/difficultyLevel.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import {BackButton} from "../../../components/UI/buttons/BackButton.jsx";

export default function EditDifficultyLevel() {
    const { levelId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [level, setLevel] = useState(null);
    const [levelName, setLevelName] = useState("");

    useEffect(() => {
        const fetchLevel = async () => {
            const levelData = await difficultyLevelService.getDifficultyLevel(levelId);
            setLevel(levelData);
            setLevelName(levelData.name);
        };
        fetchLevel();
    }, [levelId]);

    const handleSaveChanges = async () => {
        await difficultyLevelService.updateDifficultyLevel(levelId, { name: levelName });
        navigate(`/teacher/difficulty_level`);
    };

    if (!level) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Редактирование уровня: {level.name}</h1>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Название уровня:</label>
                <input
                    type="text"
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className='flex items-center gap-10'>
                <button
                    onClick={handleSaveChanges}
                    className="px-8 py-4 bg-green-500 text-white rounded"
                >
                    Сохранить изменения
                </button>
                <BackButton/>
            </div>
        </div>
    );
}