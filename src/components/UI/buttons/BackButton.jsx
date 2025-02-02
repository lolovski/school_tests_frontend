import React from "react";
import {useNavigate} from "react-router-dom";

export const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            className="bg-green-50/5 text-center w-48 rounded-2xl h-14 relative font-sans dark:text-white text-xl font-semibold group pb-8 my-3"
            onClick={() => navigate(-1)}
        >
            <div className="bg-sky-600 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
                <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="#000000"
                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    />
                    <path
                        fill="#000000"
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    />
                </svg>
            </div>
            <p className="translate-x-2">Назад</p>
        </button>
    );
};

export const HomeButton = () => {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            className="bg-green-50/5 text-center w-48 rounded-2xl h-14 relative font-sans dark:text-white text-xl font-semibold group pb-8 my-3"
            onClick={() => navigate("/")}
        >
            <div className="bg-sky-600 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
                <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="#000000"
                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    />
                    <path
                        fill="#000000"
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    />
                </svg>
            </div>
            <p className="translate-x-2">Главная</p>
        </button>
    );
};

export const RoleRadio = () => {
    return (
        <div className="flex space-x-2 border-[3px] border-sky-700 rounded-xl select-none sm:w-64 ">
            <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
                <input
                    type="radio"
                    name="role"
                    value="student"
                    className="peer hidden"
                    checked={true}
                />
                <span
                    className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[gray] peer-checked:to-[gray] peer-checked:text-white dark:text-white p-2 rounded-lg transition duration-150 ease-in-out">
          Ученик
        </span>
            </label>

            <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
                <input
                    type="radio"
                    name="role"
                    value="admin"
                    className="peer hidden"
                />
                <span
                    className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[gray] peer-checked:to-[gray] peer-checked:text-white dark:text-white p-2 rounded-lg transition duration-150 ease-in-out">
          Админ
        </span>
            </label>
            <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
                <input
                    type="radio"
                    name="role"
                    value="teacher"
                    className="peer hidden"
                    checked={true}
                />
                <span
                    className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[gray] peer-checked:to-[gray] peer-checked:text-white dark:text-white p-2 rounded-lg transition duration-150 ease-in-out">
          Учитель
        </span>
            </label>
        </div>
    );
};