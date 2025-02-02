import {Outlet} from "react-router-dom";
import React from "react";


export const AddButton = (toggleAdd, openAdd, url, text) => {
    return <div className='mx-10 pb-4'>
        <button onClick={() => toggleAdd({url})}
                className="dark:text-white w-60 font-bold text-2xl bg-gray-100/5
                    mt-5 border-cyan-600 border-4 rounded-xl pl-3 py-3"
        >{text}</button>
        {openAdd === 'add_shedule_system' && (
            <div className='border-l-2 border-sky-400
                    pl-3 py-3 dark:text-white
                    font-medium bg-green-50/5
                    w-60 rounded-lg
                    '>
                <Outlet/>
            </div>
        )}
    </div>
}