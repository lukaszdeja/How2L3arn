import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";
import { homePath } from "../routes/homePath";

//komponent strony logowania
export function LoginPage() {
    //kontekst udostepniony z AuthContext - czy ktos jest zalogowany
    const { login } = useAuth();
    const navigate = useNavigate();
    //email, haslo - jako stan aplikacji
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //po kliknieciu zaloguj zmiana - określa czy logowanie trwa (czy kliknieto guzik)
    //zabezpiecza przed podwójnym kliknieciem - podwójnym żądaniem
    const [submit, setSubmit] = useState(false);
    //bledy zwrocone
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        //blokujemy standardowe wysłanie formularza przez przeglądarkę
        e.preventDefault();
        setError(null);
        setSubmit(true);
        try {
            //próba wykonania logowania
            const user = await login(email, password);
            //przekierowanie na home page użytkownika
            navigate(homePath[user.role], { replace: true });
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Błąd połączenia z serwerem");
        } finally {
            //niezaleznie czy sie uda czy nie, cofamy submit na false
            setSubmit(false);
        }
    }
    //kod html komponentu
    return (
        <main>
            <h1>Zaloguj się do serwisu</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">E-mail</label>
                <input type="email" id="emial" placeholder="Adres email..." autoComplete="email" 
                required value={email} onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="password">Hasło</label>
                <input type="password" id="password" autoComplete="current-password" placeholder="Hasło..."
                required value={password} onChange={(e) => setPassword(e.target.value)}/>
                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={submit}>
                {submit ? "Logowanie..." : "Zaloguj się"}
                </button>
            </form>
            <p> Nie masz konta? <Link to="/register"> Zarejestruj się</Link> </p>
        </main>
    );
} 