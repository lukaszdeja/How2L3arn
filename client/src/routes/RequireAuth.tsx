// ten plik odpowiada za przekierowanie użytkownika na właściwy adres jeżeli będzie
//próbował obejść flow i wejść na stronę na którą nie ma dostępu

import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/user";

export function RequireAuth( props: { roles?: Role[] }) {
    //rozpakowanie ról z propsów
    const roles = props.roles;
    //pobieramy z kontekstu kto jest zalogowany i czy trwa wykonanie endpointu me pierwsze
    const { user, loading } = useAuth();
    //aktualny adres
    const location = useLocation();

    //jeżeli trwa ładowanie (pierwsze wywolanie me) to zwracamy informacje o tym
    if (loading) {
        return <p>Trwa ładowanie...</p>;
    }

    //jesli uzytkownik nie jest zalogowany, przekierowujemy na podstrone logowania i modyfikujemy wpis w historii przegladarki
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    //jezeli uzytkownik nie ma wymaganej roli to jest przekierowany na jego domową stronę
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    //renderujemy stronę (dzieci)
    return <Outlet />;
}