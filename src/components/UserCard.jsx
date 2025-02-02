// src/components/UserCards.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ student, onDelete }) => {
    return (
        <div className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
            <h2 className="text-2xl font-medium pb-5">{student.last_name} {student.first_name} {student.middle_name} ({student.class_.name} класс)</h2>
            <div className="flex space-x-4 mt-5">
                <Link to={`/teacher/user_cards/${student.id}`}>
                    <button className="px-4 py-1 bg-blue-500 text-white rounded">
                        Карточки пользователя
                    </button>
                </Link>
                <Link to={`/teacher/profile/${student.id}`}>
                    <button className="px-4 py-1 bg-green-500 text-white rounded">
                        Профиль пользователя
                    </button>
                </Link>
                <button
                    onClick={() => onDelete(student.id)}
                    className="px-4 py-1 bg-red-500 text-white rounded"
                >
                    Удалить пользователя
                </button>
            </div>
        </div>
    );
};

export default UserCard;