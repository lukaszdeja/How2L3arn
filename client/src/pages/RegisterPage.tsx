import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";
import type { RegisterData } from "../api/auth";
import { homePath } from "../routes/homePath";

//komponent strony rejestracji
export function RegisterPage() {
    //kontekst do rejestracji
    const { register } = useAuth();
    const navigate = useNavigate();

    //cały formularz jako stan aplikacji - typu RegisterData
    const [form, setForm] = useState<RegisterData>({
        email: "",
        password: "",
        name: "",
        surname: "",
        role: "uczeń",
    });

    //ponownie czy kliknieto guzik - chroni przed podwójnymi żądaniami
    const [submit, setSubmit] = useState(false);

    //bledy zwrocone
    const [error, setError] = useState<string | null>(null);
    //bledy z walidacji z backendu przy konkretnych polach
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    //jedna funkcja do aktualizacji stanu formularza
    //parametr T - funkcję robimy jako generyczną tak żeby klucz musiał dziedziczyć po 
    //typach z RegisterData - dzięki temu nie da się administratora wpisac, bez tego by przepuscil zwykly string
    function update<T extends keyof RegisterData>(key: T, value: RegisterData[T]) {
        //aktualizujemy stan formularza, pozostałe pola bez zmian, tylko to które w danym wywołaniu się zmienilo sie zmienia
        setForm((old) => ({...old, [key] : value}));
    }

    async function handleRegister(e: FormEvent<HTMLFormElement>) {
        //blokujemy standardowe wysyłanie formularza z odświeżaniem przez przeglądarkę
        e.preventDefault();
        setError(null);
        setSubmit(true);
        setFieldErrors({});
        try {
            //próba rejestracji 
            const user = await register(form);
            //przekierowanie na stronę domową
            navigate(homePath[user.role], { replace: true });
        } catch (err) {
            //ustawiamy informacje o błędach
            if (err instanceof ApiError) {
                setError(err.message);
                setFieldErrors(err.details ?? {}); //jezeli po lewej null to pusty obiekt
            } else {
                setError("Błąd połączenia z serwerem");
            }
        } finally {
            setSubmit(false);
        }
    }
    //funkcja która rzutuje błędy z errorFields na paragrafy z komunikatami
    const errorInfo = (field: keyof RegisterData) => {
        return fieldErrors[field]?.map((m) => <p key={m} className="f-error">{m}</p>)
    }

    //zawartość strony rejestracji
    return (
        <main>
            <h1>Zarejestruj się</h1>
            <form onSubmit={handleRegister}>
                <fieldset>
                    <legend>Rejestruję się jako:</legend>
                    <label htmlFor="uczen">Uczeń</label>
                    <input type="radio" id="uczen" name="role" checked={form.role === "uczeń"}
                    onChange={() => update("role", "uczeń")} />
                    <label htmlFor="korepetytor">Korepetytor</label>
                    <input type="radio" id="korepetytor" name="role" checked={form.role === "korepetytor"}
                    onChange={() => update("role", "korepetytor")} />
                </fieldset>
                <label htmlFor="name">Imię: </label>
                <input type="text" placeholder="Imię..." id="name" autoComplete="given-name" required value={form.name}
                onChange={(e) => update("name", e.target.value)} />
                {errorInfo("name")}
                <label htmlFor="surname">Nazwisko:</label>
                <input type="text" placeholder="Nazwisko..." id="surname" autoComplete="family-name"
                required value={form.surname} onChange={(e) => update("surname", e.target.value)} />
                {errorInfo("surname")}
                <label htmlFor="email">Adres email:</label>
                <input type="email" id="email" placeholder="Adres email..." autoComplete="email" required
                value={form.email} onChange={(e) => update("email", e.target.value)} />
                {errorInfo("email")}
                <label htmlFor="password">Hasło:</label>
                <input type="password" id="password" placeholder="Hasło..." autoComplete="new-password"
                required value={form.password} onChange={(e) => update("password", e.target.value)} />
                {errorInfo("password")}

                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={submit}>
                    {submit ? "Rejestrowanie..." : "Utwórz konto"}
                </button>
            </form>
            <p> Masz już konto? <Link to="/login">Zaloguj się</Link></p>
        </main>
    );
}