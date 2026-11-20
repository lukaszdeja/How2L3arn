//ten plik odpowiada za komunikację z backendem dla autoryzacji i uwierzytelniania
//importy metody generycznej do żądań oraz typów UserSimple i Role
import { request } from "./client";
import { Role, UserSimple } from "../types/user";

//interface obiektu przesyłanego przy zakładaniu konta
export interface RegisterData {
    email: string;
    password: string;
    name: string;
    surname: string;
    //przy rejestracji nie można zarejestrować się jako administrator
    role: Exclude<Role, "administrator">;
}

//obiekt zawierający funkcje z REST API logowania i rejestracji jako pola (nazwy endpointów)
export const authApi = {
    me: () => request<UserSimple>("/auth/me"),
    login: (email: string, password: string) => request<UserSimple>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password})
    }),
    register: (data: RegisterData) => request<UserSimple>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    }),
    logout: () => request<UserSimple>("/auth/logout", { method: "POST"}),
};

