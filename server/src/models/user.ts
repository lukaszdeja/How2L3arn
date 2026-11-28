//ten plik to model użytkownika odpowiadający obiektom w bazie danych

//import funkcji zwracającej połączenie z bazą danych
import { getDb } from "../config/database.js";
import { ObjectId } from "mongodb";

export type Role = "uczeń" | "korepetytor" | "administrator";

//gleboka stala tylko do odczytu, blokowanie modyfikacji przez kompilator
export const SUBJECTS = ["matematyka", "fizyka", "chemia", "informatyka",
    "język angielski", "język polski", "biologia", "geografia", "historia", "język niemiecki"
] as const;

export const LEVELS = ["szkoła podstawowa", "liceum podstawa", "liceum rozszerzenie", "studia"] as const;

//exportujemy te tablice rowniez jako typy

export type Subject = (typeof SUBJECTS)[number];
export type Level = (typeof LEVELS)[number];

//profil korepetytora - poziomy, przedmioty cena itd

export interface TutorData {
    subjects: Subject[];
    levels: Level[];
    hourPrice: number;
    description: string;
}

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
    tutorData?: TutorData;
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

//funkcja zwracajaca obiekt korepetytora uproszczony - bez maili bo moglyby je zobaczyc niezalogowane osoby a nie chcemy ujawniac tych danych korepetytorow
export function getTutorSimple(user: User) {
    return { id: user._id!.toString(), name: user.name, surname: user.surname, tutorData: user.tutorData ?? null};
}