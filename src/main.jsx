import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.jsx";
import Root, {
    loader as rootLoader,
    action as rootAction,  // This action will be called when the route changes. It's useful for triggering side effects (like fetching data) when a route is entered.
} from "./routes/root.jsx";
import AdminRoot, {
    loader as adminRootLoader,
} from "./routes/admin/adminRoot.jsx";
import Login, { // This action will be called when the route changes. It's useful for triggering side effects (like fetching data) when a route is entered.
}  from "./routes/user/login.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import Registration, {
    action as registrationAction,  // This action will be called when the route changes. It's useful for triggering side effects (like fetching data) when a route is entered.'
} from "./routes/user/registration.jsx";
import TeacherRoot from "./routes/teacher/teacherRoot.jsx";
import TaskRoot, {loader as taskLoader} from "./routes/teacher/task/taskRoot.jsx";
import TaskCategoryRoot, {loader as tasksCategoryRootLoader} from "./routes/teacher/taskCategory/taskCategoryRoot.jsx";
import AddCategoryTask, {action as addCategoryTaskAction, loader as addCategoryTaskLoader} from "./routes/teacher/taskCategory/taskCategoryAdd.jsx";
import AddDifficultyLevel, { action as addDifficultyLevelAction } from "./routes/teacher/difficultyLevel/difficultyLevelAdd.jsx";
import DifficultyLevelRoot, {loader as DifficultyLevelRootLoader} from "./routes/teacher/difficultyLevel/difficultyLevelRoot.jsx";
import AddTask, {action as addTaskAction, loader as addTaskLoader} from "./routes/teacher/task/taskAdd.jsx";
import CardRoot, {loader as cardLoader} from "./routes/teacher/card/cardRoot.jsx";
import AddCard, {loader as addCardLoader, action as addCardAction} from "./routes/teacher/card/cardAdd.jsx";
import UserTasksRoot, {loader as userTasksLoader} from "./routes/user/task/tasksRoot.jsx";
import UserCardsRoot, {loader as userCardsLoader} from "./routes/user/cards/cardsRoot.jsx";
import CardProgress from "./routes/user/cards/CardProgress.jsx";
import TeacherUserRoot, {loader as teacherUserRootLoader} from "./routes/teacher/user/userRoot.jsx";
import CardCategoryRoot, {loader as cardCategoryRootLoader} from "./routes/teacher/cardCategory/cardCategoryRoot.jsx";
import AddCategoryCard, {action as addCategoryCardAction} from "./routes/teacher/cardCategory/cardCategoryAdd.jsx";
import CardResults from "./routes/teacher/card/cardResults.jsx";
import CardFullResults from "./routes/teacher/card/cardFullResults.jsx";
import EditCardVariant from "./routes/teacher/card/cardEdit.jsx";
import EditTask from "./routes/teacher/task/taskEdit.jsx";
import TaskEdit from "./routes/teacher/task/taskEdit.jsx";
import EditCardCategory from "./routes/teacher/cardCategory/cardCategoryEdit.jsx";
import EditCategoryTask from "./routes/teacher/taskCategory/taskCategoryEdit.jsx";
import EditDifficultyLevel from "./routes/teacher/difficultyLevel/difficultyLevelEdit.jsx";
import TeacherUserCards from "./routes/teacher/user/UserCards.jsx";
import ClassAdd from "./routes/teacher/class/classAdd.jsx";
import ClassRoot from "./routes/teacher/class/classRoot.jsx";
import ClassEdit from "./routes/teacher/class/classEdit.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage/>,
        loader: rootLoader,
        action: rootAction,
    },
    {
        path: '/login',
        element: <Login/>,  // This component will be rendered when the path matches "/login"
        errorElement: <ErrorPage/>
    },
    {
        path: '/registration',
        element: <Registration/>,  // This component will be rendered when the path matches "/register"
        errorElement: <ErrorPage/>,
        action: registrationAction,  // This action will be called when the route changes. It's useful for triggering side effects (like fetching data) when a route is entered.
    },
    {
        path: "/admin",
        element: <AdminRoot/>,
        loader: adminRootLoader,
    },
    {
      path: "/teacher",
      element: <TeacherRoot/>
    },
    {
        path: '/teacher/task',
        element: <TaskRoot/>,
        loader: taskLoader,
        // action: tasksAction,
        children: [

        ]
    },
    {
        path: 'teacher/task/add',
        element: <AddTask/>,
        action: addTaskAction,

        loader: addTaskLoader
    },
    {
        path: 'teacher/task/:taskId/edit',
        element: <TaskEdit/>,
        action: addTaskAction,

        loader: addTaskLoader
    },
    {
        path: '/teacher/task_category',
        element: <TaskCategoryRoot/>,
        loader: tasksCategoryRootLoader,

    },
    {
        path: "/teacher/task_category/add",
        element: <AddCategoryTask/>,
        action: addCategoryTaskAction,
        loader: addCategoryTaskLoader
    },
    {
        path: "/teacher/task_category/:categoryId/edit",
        element: <EditCategoryTask/>,

    },
    {
        path: "/teacher/difficulty_level",
        element: <DifficultyLevelRoot />,
        loader: DifficultyLevelRootLoader,
    },
    {
        path: "/teacher/difficulty_level/add",
        element: <AddDifficultyLevel />,
        action: addDifficultyLevelAction,
    },
    {
        path: "/teacher/difficulty_level/:levelId/edit",
        element: <EditDifficultyLevel/>,
    },
    {
        path: "/teacher/class",
        element: <ClassRoot/>
    },
    {
        path: "/teacher/class/add",
        element: <ClassAdd/>,
    },
    {
        path: "/teacher/class/:classId/edit",
        element: <ClassEdit/>,
    },
    {
        path: "/teacher/card",
        element: <CardRoot/>,
        loader: cardLoader,
    },
    {
        path: "/teacher/card/add",
        element: <AddCard/>,
        action: addCardAction,
        loader: addCardLoader,
    },
    {
      path: "/teacher/card/:cardId/results",
      element: <CardResults/>,
    },
    {
        path: "/teacher/card/:cardId/full-results",
        element: <CardFullResults/>,
    },
    {
        path: "/teacher/card/:cardId/edit",
        element: <EditCardVariant/>,
    },
    {
        path: '/teacher/card_category',
        element: <CardCategoryRoot/>,
        loader: cardCategoryRootLoader,

    },
    {
      path: "/teacher/card_category/:categoryId/edit",
      element: <EditCardCategory/>,
    },
    {
        path: "/teacher/card_category/add",
        element: <AddCategoryCard/>,
        action: addCategoryCardAction,
    },
    {
        path: '/teacher/user/',
        element: <TeacherUserRoot/>,
        loader: teacherUserRootLoader,
    },
    {
      path: '/teacher/user_cards/:userId',
      element: <TeacherUserCards/>,
    },
    {
        path: '/tasks',
        element: <UserTasksRoot/>,
        loader: userTasksLoader,
    },
    {
        path: '/cards',
        element: <UserCardsRoot/>,
        loader: userCardsLoader,
    },
    {
        path: "/cards/:cardId/progress",
        element: <CardProgress />,
    },
    {
        path: "*",
        element: <ErrorPage/>,
    }
]);


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </StrictMode>,
)