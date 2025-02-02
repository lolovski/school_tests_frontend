import { useLocation,Navigate } from "react-router-dom"

export const setToken = (key, token)=>{
    localStorage.setItem(key, token)// make up your own token
}

export const fetchToken = (token)=>{

    return localStorage.getItem('auth')
}

export function RequireToken({children}){

    let auth = fetchToken()
    let location = useLocation()

    if(!auth){

        return <Navigate to='/' state ={{from : location}}/>;
    }

    return children;
}

export function RequireAdminToken({children}){
    let auth = fetchToken()
    let location = useLocation()

    if((!auth) || (auth !== 'admin')){
        return <Navigate to='/' state ={{from : location}}/>;
    }


    return children;
}