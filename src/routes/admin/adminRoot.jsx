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

import getWeek from '../../utils/Week.jsx';
import {useAuth} from "../../context/AuthContext.jsx";





export async function loader() {

    const { user, logout } = useAuth();
    if (user.status_id !== 3){

        return redirect('/')
    }

    return {user, logout};
}

export async function action() {
    const week = getWeek();
}

export default function AdminRoot() {
    const { user, logout } = useLoaderData();
    const navigation = useNavigation();
    const navigate = useNavigate();

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

                <h1 className="text-sky-600 text-5xl font-medium pb-10 ">OurJournal</h1>
                <div className='border-l-2 border-sky-400
                pl-3 py-3 dark:text-white
                font-medium bg-green-50/5
                w-60 rounded-lg
                '>
                    {is_superuser === false? (
                        <>
                            <NavLink to={`schools/${cookie_data.school_id}`}>
                                <button className='m-3 dark:text-white' type="submit">Управление школой</button>
                            </NavLink>
                            <Form action='profile'>
                                <button className='m-3' type="submit">Профиль</button>
                            </Form>


                        </>
                    ) : (
                        <div className=''>
                            <Form action='schools'>
                                <button className='m-3' type="submit">Управление школами</button>
                            </Form>
                            <Form action='profile'>
                                <button className='m-3' type="submit">Профиль</button>
                            </Form>
                        </div>
                    )}

                </div>

            </div>
        </>
    )


}