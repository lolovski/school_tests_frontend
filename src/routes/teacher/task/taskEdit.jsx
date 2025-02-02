import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../../../services/task.service.jsx';
import taskCategoryService from '../../../services/taskCategory.service.jsx';
import difficultyLevelService from '../../../services/difficultyLevel.service.jsx';
import RadioButton from '../../../components/UI/buttons/radioButton.jsx';
import { useAuth } from "../../../context/AuthContext.jsx";
import {BackButton} from "../../../components/UI/buttons/BackButton.jsx";

export default function EditTask() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [task, setTask] = useState(null);
    const [taskName, setTaskName] = useState("");
    const [taskNumber, setTaskNumber] = useState("");
    const [taskSolutionUrl, setTaskSolutionUrl] = useState("");
    const [taskCategoryId, setTaskCategoryId] = useState("");
    const [taskDifficultyLevelId, setTaskDifficultyLevelId] = useState("");
    const [taskAnswer, setTaskAnswer] = useState("");
    const [taskText, setTaskText] = useState("");
    const [isActive, setIsActive] = useState('true');
    const [taskCategories, setTaskCategories] = useState([]);
    const [difficultyLevels, setDifficultyLevels] = useState([]);

    useEffect(() => {
        const fetchTask = async () => {
            const taskData = await taskService.getTask(taskId);
            setTask(taskData);
            setTaskName(taskData.name);
            setTaskNumber(taskData.number);
            setTaskSolutionUrl(taskData.solution_url);
            setTaskCategoryId(taskData.category_id);
            setTaskDifficultyLevelId(taskData.difficulty_level_id);
            setTaskAnswer(taskData.answer);
            setTaskText(taskData.text);
            setIsActive(taskData.is_active ? 'true' : 'false');

            const taskCategoriesData = await taskCategoryService.getTaskCategories();
            setTaskCategories(taskCategoriesData);

            const difficultyLevelsData = await difficultyLevelService.getDifficultyLevels();
            setDifficultyLevels(difficultyLevelsData);
        };
        fetchTask();
    }, [taskId]);

    const handleSaveChanges = async () => {
        const updatedTask = {
            name: taskName !== task.name ? taskName : undefined,
            number: taskNumber !== task.number ? taskNumber : undefined,
            solution_url: taskSolutionUrl !== task.solution_url ? taskSolutionUrl : undefined,
            category_id: taskCategoryId !== task.category_id ? taskCategoryId : undefined,
            difficulty_level_id: taskDifficultyLevelId !== task.difficulty_level_id ? taskDifficultyLevelId : undefined,
            answer: taskAnswer !== task.answer ? taskAnswer : undefined,
            text: taskText !== task.text ? taskText : undefined,
            is_active: isActive !== (task.is_active ? 'true' : 'false') ? (isActive === 'true') : undefined,
        };

        const hasChanges = Object.values(updatedTask).some(value => value !== undefined);

        if (!hasChanges) {
            navigate(-1); // Вернуть пользователя на предыдущую страницу
            return;
        }

        await taskService.updateTask(taskId, updatedTask);
        navigate(`/teacher/task`);
    };

    const handleRadioChange = (event) => {
        setIsActive(event.target.value);
    };

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-sky-600 text-5xl font-medium pb-10">Редактирование задания: {task.name}</h1>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Название</label>
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Номер задания</label>
                <input
                    type="text"
                    value={taskNumber}
                    onChange={(e) => setTaskNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Ссылка на решение</label>
                <input
                    type="text"
                    value={taskSolutionUrl}
                    onChange={(e) => setTaskSolutionUrl(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Категория</label>
                <select
                    value={taskCategoryId}
                    onChange={(e) => setTaskCategoryId(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Выберите категорию</option>
                    {taskCategories.map((taskCategory) => (
                        <option key={taskCategory.id} value={taskCategory.id}>
                            {taskCategory.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Уровень сложности</label>
                <select
                    value={taskDifficultyLevelId}
                    onChange={(e) => setTaskDifficultyLevelId(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Выберите уровень сложности</option>
                    {difficultyLevels.map((difficultyLevel) => (
                        <option key={difficultyLevel.id} value={difficultyLevel.id}>
                            {difficultyLevel.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Ответ</label>
                <input
                    type="text"
                    value={taskAnswer}
                    onChange={(e) => setTaskAnswer(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Текст задания</label>
                <textarea
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                />
            </div>
            <div className="mb-10">
                <label className="block text-xl font-medium leading-6 dark:text-white">Активность</label>
                <div className="mt-2 flex space-x-4">
                    <RadioButton
                        label="Активен"
                        value="true"
                        checked={isActive === 'true'}
                        onChange={handleRadioChange}
                    />
                    <RadioButton
                        label="Неактивен"
                        value="false"
                        checked={isActive === 'false'}
                        onChange={handleRadioChange}
                    />
                </div>
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