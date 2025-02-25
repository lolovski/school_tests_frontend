// src/routes/teacher/problem/ProblemEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import problemService from '../../../services/problem.service.jsx';
import problemCategoryService from '../../../services/problemCategory.service.jsx';
import difficultyLevelService from '../../../services/difficultyLevel.service.jsx';
import testService from '../../../services/test.service.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import { BackButton } from "../../../components/UI/buttons/BackButton.jsx";

export default function EditProblem() {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [problem, setProblem] = useState(null);
    const [problemName, setProblemName] = useState("");
    const [problemDescription, setProblemDescription] = useState("");
    const [problemCategory, setProblemCategory] = useState("");
    const [problemDifficultyLevel, setProblemDifficultyLevel] = useState("");
    const [timeLimit, setTimeLimit] = useState("");
    const [memoryLimit, setMemoryLimit] = useState("");
    const [tests, setTests] = useState([]);
    const [problemCategories, setProblemCategories] = useState([]);
    const [difficultyLevels, setDifficultyLevels] = useState([]);
    const [originalProblem, setOriginalProblem] = useState(null);
    const [testsChanged, setTestsChanged] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            const problemData = await problemService.getProblem(problemId);
            setProblem(problemData);
            setOriginalProblem(problemData);
            setProblemName(problemData.name);
            setProblemDescription(problemData.description);
            setProblemCategory(problemData.category_id);
            setProblemDifficultyLevel(problemData.difficulty_level_id);
            setTimeLimit(problemData.time_limit);
            setMemoryLimit(problemData.memory_limit);

            const testsData = await testService.getTests(problemId);
            setTests(testsData);

            const categoriesData = await problemCategoryService.getProblemCategories();
            setProblemCategories(categoriesData);

            const levelsData = await difficultyLevelService.getDifficultyLevels();
            setDifficultyLevels(levelsData);
        };
        fetchProblem();
    }, [problemId]);

    const handleSaveChanges = async () => {
        const hasChanges = problemName !== originalProblem.name ||
            problemDescription !== originalProblem.description ||
            problemCategory !== originalProblem.category_id ||
            problemDifficultyLevel !== originalProblem.difficulty_level_id ||
            timeLimit !== originalProblem.time_limit ||
            memoryLimit !== originalProblem.memory_limit;

        const updateData = {};

        if (problemName !== originalProblem.name) {
            updateData.name = problemName;
        }

        updateData.description = problemDescription;
        updateData.category_id = problemCategory;
        updateData.difficulty_level_id = problemDifficultyLevel;
        updateData.time_limit = timeLimit;
        updateData.memory_limit = memoryLimit;

        if (Object.keys(updateData).length > 0) {
            await problemService.updateProblem(problemId, updateData);
        }

        if (testsChanged) {

            for (const test of tests) {

                if (test.id) {
                    await testService.updateTest(test.id, {
                        problem_id: test.problem_id,
                        input_data: test.input_data,
                        output_data: test.output_data
                    });
                } else {
                    await testService.createTest({
                        problem_id: problemId,
                        input_data: test.input_data,
                        output_data: test.output_data
                    });
                }
            }
        }

        if (!hasChanges && !testsChanged) {
            navigate(`/teacher/problem`);
            return;
        }

        navigate(`/teacher/problem`);
    };

    const addTest = () => {
        setTests([...tests, { input_data: '', output_data: '' }]);
        setTestsChanged(true);
    };

    const removeTest = (index) => {
        setTests(tests.filter((_, i) => i !== index));
        setTestsChanged(true);
    };

    const handleTestChange = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = value;
        setTests(newTests);
        setTestsChanged(true);
    };

    if (!problem) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Редактирование задачи: {problem.name}</h1>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Название:</label>
                <input
                    type="text"
                    value={problemName}
                    onChange={(e) => setProblemName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Описание:</label>
                <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Категория:</label>
                <select
                    value={problemCategory}
                    onChange={(e) => setProblemCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    {problemCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Уровень сложности:</label>
                <select
                    value={problemDifficultyLevel}
                    onChange={(e) => setProblemDifficultyLevel(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    {difficultyLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Время выполнения (секунды):</label>
                <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Ограничение памяти (МБ):</label>
                <input
                    type="number"
                    value={memoryLimit}
                    onChange={(e) => setMemoryLimit(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Тесты:</label>
                {tests.map((test, index) => (
                    <div key={index} className="mt-2">
                        <input
                            type="text"
                            value={test.input_data}
                            onChange={(e) => handleTestChange(index, 'input_data', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Введите входные данные"
                        />
                        <input
                            type="text"
                            value={test.output_data}
                            onChange={(e) => handleTestChange(index, 'output_data', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Введите выходные данные"
                        />
                        <button
                            type="button"
                            onClick={() => removeTest(index)}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Удалить тест
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addTest}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                    Добавить тест
                </button>
            </div>
            <div className='flex items-center gap-10'>
                <button
                    onClick={handleSaveChanges}
                    className="px-8 py-4 bg-green-500 text-white rounded"
                >
                    Сохранить изменения
                </button>
                <BackButton />
            </div>
        </div>
    );
}