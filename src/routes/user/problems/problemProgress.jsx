// src/routes/user/problems/ProblemProgress.jsx
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { BackButton } from "../../../components/UI/buttons/BackButton.jsx";
import React, { useState } from "react";
import problemService from "../../../services/problem.service.jsx";
import testService from "../../../services/test.service.jsx";
import userProblemService from "../../../services/userProblem.service.jsx";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { basicSetup } from '@codemirror/basic-setup';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import {Database, Timer} from "iconoir-react";

export async function loader({ params }) {
    const problem = await problemService.getProblem(params.problemId);
    const tests = await testService.getTests(params.problemId);
    return { problem, tests };
}

export default function ProblemProgress() {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { problem, tests } = useLoaderData();
    const [code, setCode] = useState("");
    const [verdict, setVerdict] = useState(null);
    const [testResults, setTestResults] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    const handleSubmit = async () => {
        try {
            const userProblemData = {
                problem_id: problemId,
                user_id: user.id,
                solution: code
            };
            const response = await userProblemService.createUserProblem(userProblemData);
            setVerdict(response[0].verdict);
            setTestResults(response[1]);
            setError(null);
            setActiveTab('results');
        } catch (error) {
            console.error("Error submitting problem:", error);
            setError("Произошла ошибка при отправке решения");
        }
    };

    return (
        <div className="p-10 bg-gray-900 text-white flex">
            <div className="w-1/4 pr-4">
                <BackButton />
                <h1 className="text-sky-600 text-5xl font-medium pb-10">{problem.name}</h1>
                <div className="flex items-center mb-4">
                    <Database className="w-6 h-6 mr-2"/>
                    <p><strong>Ограничение памяти:</strong> {problem.memory_limit} бит</p>
                </div>
                <div className="flex items-center mb-4">
                    <Timer className="w-6 h-6 mr-2"/>
                    <p><strong>Ограничение времени:</strong> {problem.time_limit} сек</p>
                </div>
                <div className="mt-10">
                    <button
                        className={`px-4 py-2 mr-2 ${activeTab === 'description' ? 'bg-blue-500' : 'bg-gray-700'} text-white rounded`}
                        onClick={() => setActiveTab('description')}
                    >
                        Описание
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'results' ? 'bg-blue-500' : 'bg-gray-700'} text-white rounded`}
                        onClick={() => setActiveTab('results')}
                    >
                        Вывод
                    </button>
                </div>
                {activeTab === 'description' && (
                    <div className="mt-10 p-4 bg-gray-800 rounded-lg">
                        <p><strong>Описание:</strong> {problem.description}</p>
                    </div>
                )}
                {activeTab === 'results' && (
                    <div className="mt-10 p-4 bg-gray-800 rounded-lg">
                        {verdict && (
                            <div>
                                <h2 className="text-2xl font-medium pb-5">Результат</h2>
                                {verdict === "OK" ? (
                                    <p className="text-green-500">Задание успешно выполнено!</p>
                                ) : (
                                    <ul className="pb-10">
                                        {testResults.map((result, index) => (
                                            <li key={index} className={`border-l-2 ${result.verdict === "OK" ? 'border-green-500' : 'border-red-500'} pl-3 py-3 dark:text-white font-medium bg-red-50/5 w-full rounded-lg mb-5`}>
                                                <p><strong>Тест:</strong> {result.test_id}</p>
                                                <p><strong>Вывод пользователя:</strong> {result.user_output}</p>
                                                <p><strong>Вердикт:</strong> {result.verdict}</p>
                                                <p><strong>Время:</strong> {result.time} секунд</p>
                                                <p><strong>Память:</strong> {result.memory} MB</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {error && (
                            <div className="mt-4 p-2 text-center text-red-600 border border-red-600 rounded">
                                {error}
                            </div>
                        )}
                        {
                            !verdict && (
                                <div className="text-center">
                                    Здесь будут ваши результаты
                                </div>
                            )
                        }
                    </div>
                )}
            </div>
            <div className="w-3/4 pl-4">
                <CodeMirror
                    value={code}
                    height="400px"
                    extensions={[basicSetup, python()]}
                    theme={okaidia}
                    onChange={(value) => setCode(value)}
                    className="border rounded"
                />
                <button
                    onClick={handleSubmit}
                    className="px-8 py-4 mt-5 bg-blue-500 text-white rounded"
                >
                    Отправить
                </button>
                <div className="mt-10">
                    <h2 className="text-2xl font-medium pb-5">Тесты</h2>
                    <ul className="pl-5 pb-10">
                        {tests.map((test, index) => (
                            <li key={index} className="border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-full rounded-lg mb-5">
                                <p><strong>Тест {test.id}</strong></p>
                                <p><strong>Входные данные:</strong> {test.input_data}</p>
                                <p><strong>Выходные данные:</strong> {test.output_data}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}