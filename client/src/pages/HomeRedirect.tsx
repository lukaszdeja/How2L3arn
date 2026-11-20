import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { homePath } from "../routes/homePath";

//komponent przekierowujący użytkownika na jego stronę domową gdy wszedł na /
// albo na nieistniejącą podstronę
export function HomeRedirect() {
    const { user, loading } = useAuth();
    if (loading) {
        return <p>Ładowanie…</p>;
    }
    return <Navigate to={user ? homePath[user.role] : "/login"} replace />;
}