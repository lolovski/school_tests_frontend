// src/routes/teacher/problem/ProblemResults.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import problemService from '../../../services/problem.service.jsx';
import userProblemService from '../../../services/userProblem.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import { BackButton } from "../../../components/UI/buttons/BackButton.jsx";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { basicSetup } from '@codemirror/basic-setup';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

export default function ProblemResults() {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [problem, setProblem] = useState(null);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [expandedAttempt, setExpandedAttempt] = useState(null);
    const [uniqueClasses, setUniqueClasses] = useState([]);

    useEffect(() => {
        const fetchProblemAndStudents = async () => {
            const problemData = await problemService.getProblem(problemId);
            setProblem(problemData);

            const userProblemsData = await userProblemService.getUserProblems(null, problemId);

            // Group user_problems by problem_id and sort by attempt
            const studentsWithGroupedProblems = userProblemsData.map(student => {
                const groupedProblems = student.user_problems.reduce((acc, userProblem) => {
                    if (!acc[userProblem.problem_id]) {
                        acc[userProblem.problem_id] = [];
                    }
                    acc[userProblem.problem_id].push(userProblem);
                    return acc;
                }, {});

                return {
                    ...student,
                    user_problems: Object.values(groupedProblems).map(problems => problems.sort((a, b) => a.attempt - b.attempt))
                };
            });

            setStudents(studentsWithGroupedProblems);
            setFilteredStudents(studentsWithGroupedProblems);
            setUniqueClasses([...new Set(studentsWithGroupedProblems.map(student => student.class_.name))]);
        };
        fetchProblemAndStudents();
    }, [problemId]);

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

    const handleExpandAttempt = (studentId, attemptIndex) => {
        setExpandedAttempt(expandedAttempt === attemptIndex ? null : attemptIndex);
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    if (!problem || students.length === 0) {
        return <BackButton />;
    }

    return (
        <div className="p-10">
            <BackButton />
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Результаты по задаче: {problem.name}</h1>
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
                    {uniqueClasses.map(class_ => (
                        <option key={class_} value={class_}>{class_}</option>
                    ))}
                </select>
            </div>
            <ul className="pl-5 pb-10">
                {filteredStudents.map(student => (
                    <li key={student.id} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-medium">{student.last_name} {student.first_name} {student.middle_name} ({student.class_.name} класс)</h2>
                            <button
                                onClick={() => handleExpandStudent(student.id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded mx-2"
                            >
                                {expandedStudent === student.id ? 'Свернуть' : 'Развернуть'}
                            </button>
                        </div>
                        {expandedStudent === student.id && (
                            <div className="mt-4">
                                {student.user_problems[0].map((problems, index) => (
                                    <div key={index} className="mb-4">
                                        <h3 className="text-xl font-medium">
                                            Попытка {index + 1} - Вердикт: <span className={problems.verdict === 'OK' ? 'text-green-500' : 'text-red-500'}>{problems.verdict}</span>
                                        </h3>
                                        <button
                                            onClick={() => handleExpandAttempt(student.id, index)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                                        >
                                            {expandedAttempt === index ? 'Свернуть' : 'Развернуть'}
                                        </button>
                                        {expandedAttempt === index && (
                                            <div className="mt-4">
                                                <h4 className="text-lg font-medium mt-4">Решение:</h4>
                                                <CodeMirror
                                                    value={problems.solution}
                                                    height="200px"
                                                    extensions={[basicSetup, python()]}
                                                    theme={okaidia}
                                                    editable={false}
                                                    className="border rounded"
                                                />
                                                <h4 className="text-lg font-medium mt-4">Задачи:</h4>
                                                <ul className="pl-5">
                                                    {problems.user_tests.map((userTest, testIndex) => (
                                                        <li key={testIndex} className={`border-l-2 ${userTest.verdict === 'OK' ? 'border-green-500' : 'border-red-500'} pl-3 py-2 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-2`}>
                                                            <div className="flex justify-between items-center">
                                                                <h5 className="text-lg font-medium">Задача {testIndex + 1}</h5>
                                                                <span className={userTest.verdict === 'OK' ? 'text-green-500 px-2' : 'text-red-500 px-2'}>{userTest.verdict}</span>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p><strong>Входные данные:</strong> {userTest.test.input_data}</p>
                                                                <p><strong>Выходные данные:</strong> {userTest.test.output_data}</p>
                                                                <p><strong>Вывод пользователя:</strong> {userTest.user_output}</p>
                                                                <p><strong>Память:</strong> {userTest.memory}</p>
                                                                <p><strong>Время:</strong> {userTest.time}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}