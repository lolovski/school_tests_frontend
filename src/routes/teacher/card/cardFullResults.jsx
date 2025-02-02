import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cardService from '../../../services/card.service.jsx';
import studentService from '../../../services/student.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import {BackButton} from "../../../components/UI/buttons/BackButton.jsx";

export default function CardFullResults() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [card, setCard] = useState(null);
    const [variants, setVariants] = useState([]);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [uniqueClasses, setUniqueClasses] = useState([]);

    useEffect(() => {
        const fetchCardAndVariants = async () => {
            const cardData = await cardService.getCard(cardId);
            setCard(cardData);

            const variantsData = await studentService.getCardsByName(cardData.name);
            setVariants(variantsData);

            const studentsData = await Promise.all(
                variantsData.map(async variant => {
                    const variantStudents = await studentService.getStudentsByCard(variant.id);
                    return variantStudents.map(student => ({
                        ...student,
                        variant: variant.variant,
                        variantId: variant.id
                    }));
                })
            );

            const flattenedStudents = studentsData.flat();
            setStudents(flattenedStudents);
            setFilteredStudents(flattenedStudents);
            setUniqueClasses([...new Set(flattenedStudents.map(student => student.class_.id))]);
        };
        fetchCardAndVariants();
    }, [cardId]);

    useEffect(() => {
        let filtered = students;
        if (searchQuery) {
            filtered = filtered.filter(student =>
                student.last_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedClass) {
            filtered = filtered.filter(student => student.class_.id === parseInt(selectedClass));
        }
        setFilteredStudents(filtered);
    }, [searchQuery, selectedClass, students]);

    const handleExpandStudent = (studentId, variantId) => {
        setExpandedStudent(expandedStudent === `${studentId}-${variantId}` ? null : `${studentId}-${variantId}`);
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    if (!card || variants.length === 0 || students.length === 0) {
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
                    {uniqueClasses.map(classId => {
                        const class_ = students.find(student => student.class_.id === classId).class_;
                        return (
                            <option key={classId} value={classId}>{class_.name}</option>
                        );
                    })}
                </select>
            </div>
            <ul className="pl-5 pb-10">
                {variants.map(variant => (
                    <li key={variant.id} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                        <h2 className="text-2xl font-medium pb-5">Вариант {variant.variant}</h2>
                        {filteredStudents
                            .filter(student => student.variantId === variant.id)
                            .map(student => (
                                <div key={`${student.id}-${variant.id}`} className="mb-5">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-medium">{student.last_name} {student.first_name} {student.middle_name} ({student.class_.name})</h3>
                                        <button
                                            onClick={() => handleExpandStudent(student.id, variant.id)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            {expandedStudent === `${student.id}-${variant.id}` ? 'Свернуть' : 'Развернуть'}
                                        </button>
                                    </div>
                                    {expandedStudent === `${student.id}-${variant.id}` && (
                                        <div className="mt-4">
                                            <table className="min-w-full bg-gray-500 border border-gray-200">
                                                <thead>
                                                <tr>
                                                    <th className="py-2 px-4 border-b border-gray-200 text-center">Индекс
                                                        задания
                                                    </th>
                                                    <th className="py-2 px-4 border-b border-gray-200 text-center">Номер
                                                        задания
                                                    </th>
                                                    <th className="py-2 px-4 border-b border-gray-200 text-center">Ответ
                                                        ученика
                                                    </th>
                                                    <th className="py-2 px-4 border-b border-gray-200 text-center">Правильный
                                                        ответ
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {student.task_users.map((task_user, index) => (
                                                    <tr key={task_user.task_id} className="border-b border-gray-200">
                                                        <td className="py-2 px-4 text-center">{index + 1}</td>
                                                        <td className="py-2 px-4 text-center">{task_user.task.id}</td>
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
                                </div>
                            ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}