import { useState, useEffect, type ReactNode } from "react";
import { authContext } from "./AuthContext";
import { authApi, RegisterData } from "../api/auth";
import type { UserSimple } from "../types/user";

//komponent reactowy przechowujący stan zalogowanego użytkownika i przekazujący go dzieciom
export function AuthProvider( props: { children: ReactNode }) {
    //wyciagamy dzieci komponentu z jego propsów
    const children = props.children;
    //stan zapamiętanego użytkownika - na początku ustawiamy na null przy pierszym wywołaniu
    const [user, setUser] = useState<UserSimple | null>(null);
    //boolean określający czy jesteśmy przed pierwszym wywołaniem /me - na początku ustawiamy na true
    const [loading, setLoading] = useState(true);

    //raz na początku (pusta tablica zależności)
    //wywołujemy endpoint me po czym ustawiamy usera (ponowne wyrenedrowanie komponentu) oraz loading
    useEffect(() => {
        authApi.me().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
    }, []);

    //funkcja logowania komponentu - wykonuje żądanie REST i zapisuje zalogowanego użytkownika
    //ponowne wyrenederowanie komponentu
    async function login(email: string, password: string) {
        const resUser = await authApi.login(email, password);
        //zapisujemy stan aplikacji po zalogowaniu
        setUser(resUser);
        return resUser;
    }

    //analogicznie dla rejestracji
    async function register(data: RegisterData) {
        const resUser = await authApi.register(data);
        setUser(resUser);
        return resUser;
    }

    async function logout() {
        await authApi.logout();
        //przy wylogowaniu stan aplikacji - user = null
        setUser(null);
    }

    return (
        //przekazuje wszystkie składowe komponentu (obiekt) dzieciom
        <AuthContext.Provider value={{ user, loading, login, register, logout}}>
            {children}
        </AUthContext.Provider>
    );
}