import {Form, Link, Outlet, useLoaderData, useNavigate, useNavigation} from "react-router-dom";
import {useAuth} from "../../../context/AuthContext.jsx";
import {HomeButton} from "../../../components/UI/buttons/BackButton.jsx";
import React, {useEffect} from "react";
import taskService from "../../../services/task.service.jsx";
import userService from "../../../services/user.service.jsx";
import cardUserService from "../../../services/cardUser.service.jsx";

export async function loader({params}) {
    const student = await userService.getUser(params.id);
    const studentCards = await cardUserService.getUserCards(student.id)
    return {student, studentCards};
}

export default function TeacherUserProfile() {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const {student, studentCards} = useLoaderData();
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            if (user.status_id !== 2) {
                navigate('/');
            }
        } else {
            navigate('/')
        }
    }, [user, navigate]);

    return (
        <>
            <div
                id="detail"
                className={
                    navigation.state === "loading" ? "loading" : " "
                }
            >
            </div>
            <div className='m-10'>
                <h1 className="text-sky-600 text-5xl font-medium pb-10 "> {student.last_name} {student.first_name} {student.middle_name}</h1>
                <ul className="pl-5">
                    {studentCards.map((studentCard) => (
                        <li key={studentCard.card_id} className="mb-2">
                            <div className='border-l-2 border-sky-400
                                pl-3 py-3 dark:text-white
                                font-medium bg-green-50/5
                                w-80 rounded-lg
                                text-left'>
                                <h1 className="text-xl font-medium pb-5 ">{studentCard.card.name} вариант {studentCard.card.variant}</h1>

                                <Link to={`${studentCard.card_id}`}>
                                    <button className="w-60 rounded-lg text-left">Перейти к ответам пользователя</button>
                                </Link>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

