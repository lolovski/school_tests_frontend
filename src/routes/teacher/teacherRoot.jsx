import { Form, Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { HomeButton } from "../../components/UI/buttons/BackButton.jsx";
import { useEffect } from "react";

export default function TeacherRoot() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            if (user.status_id !== 2) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <div
                id="detail"
                className={
                    navigation.state === "loading" ? "loading" : " "
                }
            >
                <Outlet />
            </div>
            <div className='m-10'>
                <h1 className="text-sky-600 text-5xl font-medium pb-10">Система управления</h1>
                <div className='border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-60 rounded-lg'>
                    <Form action='task'>
                        <button className='m-3' type="submit">Управление заданиями</button>
                    </Form>
                    <Form action='task_category'>
                        <button className='m-3' type="submit">Управление категориями заданий</button>
                    </Form>
                    <Form action='difficulty_level'>
                        <button className='m-3' type="submit">Управление уровнями сложностей заданий</button>
                    </Form>
                    <Form action='card'>
                        <button className='m-3' type="submit">Управление карточками</button>
                    </Form>
                    <Form action='card_category'>
                        <button className='m-3' type="submit">Управление категориями карточек</button>
                    </Form>
                    <Form action='user'>
                        <button className='m-3' type="submit">Управление учениками</button>
                    </Form>
                    <Form action='class'>
                        <button className='m-3' type="submit">Управление классами</button>
                    </Form>
                    <button className='m-3' onClick={handleLogout}>Выйти</button>
                </div>
            </div>
        </>
    );
}