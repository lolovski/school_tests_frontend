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
import RootCards from "../components/UI/rootCards.jsx";

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
            <div className=''>
                <h1 className="text-sky-600 text-5xl font-medium m-10">SchoolTests</h1>
                <RootCards user={user}/>

            </div>
        </>
    );
}