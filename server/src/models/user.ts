//ten plik to model użytkownika odpowiadający obiektom w bazie danych

//import funkcji zwracającej połączenie z bazą danych
import { getDb } from "../config/database.js";
import { ObjectId } from "mongodb";

export type Role = "uczeń" | "korepetytor" | "administrator";

//model użytkownika, odpowiada dokumentowi User w mongodb
export interface User {
    _id?: ObjectId; //nadawane przez bazę danych więc opcjonalne
    email: string;
    passwordHash: string;
    name: string;
    surname: string;
    role: Role;
    isActive: boolean;
    creationDate: Date;
};

//funkcja zwracająca kolekcję (odpowiednik tabeli) użytkowników z bazy danych
export function userCollection() {
    return getDb().collection<User>("users");
}

export async function ensureUniqueEmail() {
    //konfigurujemy kolekcje w mongodb tak żeby email był unikalny
    await userCollection().createIndex({ email: 1 }, { unique: true });
}

//funkcja zwracająca obiekt użytkownika bez wrażliwych danych
export function getUserSimple(user: User) {
    return { id: user._id!.toString(), email: user.email, name: user.name, surname: user.surname, role: user.role};
}