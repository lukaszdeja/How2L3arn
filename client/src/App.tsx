import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthProvider";
import { RequireAuth } from "./routes/RequireAuth";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TempHomePage } from "./pages/TempHomePage";
import { HomeRedirect } from "./pages/HomeRedirect";

//główny komponent całej aplikacji
//określa trasowanie ścieżek - renderuje odpowiednie komponenty reactowe
//AuthProvider rozprowadza do wszystkich dzieci kontekst tego kto jest zalogowany i procedury autoryzacji/uwierzytelniania
//komponenty chronione rolą (wymagające dostępu) są owinięte komponentem RequireAuth
export default function App() {
    return (
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomeRedirect />}/>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<RequireAuth roles={["uczeń"]} />}>
                    <Route path="/uczen" element={<TempHomePage title="Panel ucznia" />} />
                </Route>
                <Route element={<RequireAuth roles={["korepetytor"]} />}>
                    <Route path="/korepetytor" element={<TempHomePage title="Panel korepetytora" />} />
                </Route>
                <Route element={<RequireAuth roles={["administrator"]} />}>
                    <Route path="/administrator" element={<TempHomePage title="Panel administratora" />} />
                </Route>
                <Route path="*" element={<HomeRedirect />} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
    );
}