import { Form, Link, Outlet, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { HomeButton } from "../../../components/UI/buttons/BackButton.jsx";
import React, { useEffect, useState } from "react";
import userService from "../../../services/user.service.jsx";
import UserCard from '../../../components/UserCard';

export async function loader() {
    const students = await userService.getStudents();
    return { students };
}

export default function TeacherUserRoot() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { students } = useLoaderData();
    const navigation = useNavigation();
    const [filteredStudents, setFilteredStudents] = useState(students);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [uniqueClasses, setUniqueClasses] = useState([]);

    useEffect(() => {
        if (user) {
            if (user.status_id !== 2) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        setUniqueClasses([...new Set(students.map(student => student.class_.name))]);
    }, [students]);

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

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await userService.deleteUser(userId);
            setFilteredStudents(filteredStudents.filter(student => student.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <>
            <div
                id="detail"
                className={
                    navigation.state === "loading" ? "loading" : " "
                }
            ></div>
            <div className='m-10'>
                <HomeButton />
                <h1 className="text-sky-600 text-5xl font-medium pb-10">Управление пользователями</h1>
                <div className="flex justify-between items-center mb-10">
                    <input
                        type="text"
                        placeholder="Поиск по фамилии"
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
                <ul className="pl-5">
                    {filteredStudents.map((student) => (
                        <li key={student.id} className="mb-2">
                            <UserCard student={student} onDelete={handleDeleteUser} />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}