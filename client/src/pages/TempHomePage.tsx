//tymczasowa strona główna do testów logowania
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

//komponent
export function TempHomePage(props: {title: string}) {
    const title = props.title;
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login", { replace: true });
    }

    return (
        <main>
            <h1>{title}</h1>
            <p> Zalogowano jako: {user?.name} {user?.surname} {user?.role} </p>
            <button type="button" onClick={() => handleLogout()}>Wyloguj się</button>
        </main>
    );
}