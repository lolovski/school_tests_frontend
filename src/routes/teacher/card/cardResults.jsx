import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cardService from '../../../services/card.service.jsx';
import studentService from '../../../services/student.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import {BackButton} from "../../../components/UI/buttons/BackButton.jsx";

export default function CardResults() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [card, setCard] = useState(null);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [uniqueClasses, setUniqueClasses] = useState([]);

    useEffect(() => {
        const fetchCardAndStudents = async () => {
            const cardData = await cardService.getCard(cardId);
            setCard(cardData);
            const studentsData = await studentService.getStudentsByCard(cardId);
            setStudents(studentsData);
            setFilteredStudents(studentsData);
            setUniqueClasses([...new Set(studentsData.map(student => student.class_.name))]);
        };
        fetchCardAndStudents();
    }, [cardId]);

    useEffect(() => {
        let filtered = students;
        if (searchQuery) {
            filtered = filtered.filter(student =>
                student.last_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedClass) {
            filtered = filtered.filter(student => student.class_.name === selectedClass);
        }
        setFilteredStudents(filtered);
    }, [searchQuery, selectedClass, students]);

    const handleExpandStudent = (studentId) => {
        setExpandedStudent(studentId === expandedStudent ? null : studentId);
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    if (!card || students.length === 0) {
        return <BackButton/>
    }

    return (
        <div className="p-10">
            <BackButton/>
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Результаты по карточке: {card.name}</h1>
            <div className="flex justify-between items-center mb-10">
                <input
                    type="text"
                    placeholder="Поиск по ученикам"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-1/3 p-2 border rounded"
                />
                <select
                    value={selectedClass}
                    onChange={handleClassChange}
                    className="w-1/3 p-2 border rounded"
                >
                    <option value="">Все классы</option>
                    {uniqueClasses.map(class_ => {

                        return (
                            <option key={class_} value={class_}>{class_}</option>
                        );
                    })}
                </select>
            </div>
            <ul className="pl-5 pb-10">
                {filteredStudents.map(student => (
                    <li key={student.id} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-medium">{student.last_name} {student.first_name} {student.middle_name} ({student.class_.name} класс)</h2>
                            <button
                                onClick={() => handleExpandStudent(student.id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                {expandedStudent === student.id ? 'Свернуть' : 'Развернуть'}
                            </button>
                        </div>
                        {expandedStudent === student.id && (
                            <div className="mt-4">
                                <table className="min-w-full bg-gray-500 border border-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 text-center">Номер задания</th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-center">Ответ ученика</th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-center">Правильный ответ</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {student.task_users.map((task_user, index) => (
                                        <tr key={task_user.task_id} className="border-b border-gray-200">
                                            <td className="py-2 px-4 text-center">{index + 1}</td>
                                            <td className={`py-2 px-4 text-center ${task_user.user_answer === task_user.task.answer ? 'text-green-500' : 'text-red-500'}`}>
                                                {task_user.user_answer}
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