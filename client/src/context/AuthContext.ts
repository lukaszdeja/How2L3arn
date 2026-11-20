//ten plik udostępnia informację o tym kto jest zalogowany całemu drzewu komponentów dzięki context

//context
import { createContext, useContext } from "react";
//typ użytkownika
import type { UserSimple } from "../types/user";
//interface obiektu rejestracji
import type { RegisterData } from "../api/auth";

//interface który opisuje jakie informacje context udostępnia dzewu komponentów
export interface authContextValues {
    //stan aplikacji
    user: UserSimple | null; //użytkownik
    loading: boolean; //czy trwa pierwsze ładowanie strony - zeby odroznic stan przed wykonaniem /me od nie zalogowania
    //akcje
    login: (email: string, password: string) => Promise<UserSimple>;
    register: (data: RegisterData) => Promise<UserSimple>;
    logout: () => Promise<void>;
}

//obiekt kontekstu - domyślnie null
export const AuthContext = createContext<authContextValues | null>(null);

//hook który udostępnia context dla dzieci <AuthProvider>, zawęża typ, obcina nulla
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth może być użyte tylko wewnątrz <AuthProvider>");
    }
    return context;
}