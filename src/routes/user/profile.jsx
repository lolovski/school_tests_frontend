import {Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigate, useNavigation} from "react-router-dom";
import authService from "../../services/auth.service.jsx";
import axios from "axios";
import {HomeButton} from "../../components/UI/buttons/BackButton.jsx";
import React from "react";

export async function loader() {
    const profile = await authService.getProfile();
    return {profile};
}

export async function action() {
    await authService.signOut();
    return redirect('/');
}

export default function Profile() {
    const { profile } = useLoaderData();
    const navigate = useNavigate();
    return (

            <div className='m-10'>
                <HomeButton/>
                <h1 className="text-sky-600 text-5xl font-medium pb-10 ">Профиль</h1>
                <p className="dark:text-white text-2xl font-medium pb-10 pl-5
                 ">Приветствую, {profile.first_name}</p>
                <div className='border-l-2 border-sky-400
                pl-3 py-3 dark:text-white
                font-medium bg-green-50/5
                w-60 rounded-lg'>
                    <Form method='post'>
                        <button className='m-3' type="submit">Выйти</button>
                    </Form>

                </div>
            </div>

    )
}