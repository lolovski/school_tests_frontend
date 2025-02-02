import {
    Outlet,
    Link,
    useLoaderData,
    Form,
    redirect,
    NavLink,
    useNavigate,
    useNavigation,
    Navigate
} from "react-router-dom";

import authService from "../services/auth.service.jsx";
import getWeek from '../utils/Week.jsx';
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

export async function loader() {
    return null;
}

export async function action() {
    const week = getWeek();
    return redirect(`/journal/${week}`);
}

export default function Root() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            if (user.status_id === 3) {
                navigate('/admin');
            } else if (user.status_id === 2) {
                navigate('/teacher');
            }
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
                <h1 className="text-sky-600 text-5xl font-medium pb-10">OurJournal</h1>
                <div className='border-l-2 border-sky-400 pl-3 py-3 dark:text-white font-medium bg-green-50/5 w-60 rounded-lg'>
                    {user !== null ? (
                        <>
                            <Form action='tasks'>
                                <button className='m-3' type="submit">Задания</button>
                            </Form>
                            <Form action='cards'>
                                <button className='m-3' type="submit">Карточки</button>
                            </Form>
                            <Form action='profile'>
                                <button className='m-3' type="submit">Профиль</button>
                            </Form>
                            <button className='m-3' onClick={handleLogout}>Выйти</button>


                        </>
                    ) : (
                        <>
                            <Form action='login'>
                                <button className='m-3' type="submit">Войти</button>
                            </Form>
                            <Form action='registration'>
                                <button className='m-3' type="submit">Регистрация</button>
                            </Form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}