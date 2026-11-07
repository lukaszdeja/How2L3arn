//ten plik to kontroler autoryzacji i autentyfikacji - obsługa endpointów po stronie backendu
//logowanie, rejestracja, /me, wylogowanie
//wspolpracuje z bazą danych

//potrzebne importy
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId, MongoServerError } from "mongodb";
import { z } from "zod";
import { env } from "../config/checkenv.js";
import { userCollection, getUserSimple, type User } from "../models/user.js";
import { registerPattern, loginPattern } from "../validation/authPatterns.js";

const TOKEN_VALIDITY_TIME = 24 * 60 * 60 * 1000; //waznosc tokenu w ms - na razie 1 dzień

//funkcja uwierzytelniająca - tworzy token (podpisuje) i zapisuje go w ciasteczku u użytkownika
function authCookie(res: Response, user: User) {

    //tworzymy i podpisujemy token jwt dla uzytkownika
    const token = jwt.sign({ userId: user._id!.toString(), role: user.role }, env.JWT_SECRET , {
        expiresIn: "1d"
    });

    //zapisujemy token w ciasteczku
    res.cookie("token", token, {
        httpOnly: true, //tylko żądania HTTP, javascript nie ma dostępu do tego cookie
        sameSite: "lax", //nie wysyła do obcych stron internetowych, ochrona przed atakami CSRF
        secure: env.COOKIE_SECURE, //jezeli jest true to mozliwe tylko przez HTTPS
        maxAge: TOKEN_VALIDITY_TIME
    });
}

export async function register(req: Request, res: Response) {

    //walidacja jsona rejestracji
    const registerBody = registerPattern.safeParse(req.body);

    //jesli zle dane rejestracji to status 400 - Bad Request
    if (!registerBody.success) {
        return res.status(400).json({ error: "Błędne dane rejestracji", 
            details: z.flattenError(registerBody.error).fieldErrors
        });
    }

    //zapisujemy do zmiennych z ciała requesta rejestracji
    const { email, password, name, surname, role } = registerBody.data;

    //tworzymy obiekt uzytkownika ktory zapiszemy w bazie danych
    const user : User = {
        email,
        passwordHash: await bcrypt.hash(password, 12), //12 rund szyfrowania, wolniej ale bezpieczniej
        name,
        surname,
        role,
        isActive: true,
        creationDate: new Date()
    };

    try {
        //próbujemy dodac użytkownika do bazy danych
        const result = await userCollection().insertOne(user);
        user._id = result.insertedId;
    } catch (e) {
        //sprawdzamy czy błąd mongodb naruszenia unikalnego indexu
        if (e instanceof MongoServerError && e.code === 11000) {
            //409 - konflikt z zasobem na serwerze
            return res.status(409).json({ error: "Adres e-mail jest juz zajety" });
        }

        //pozostale bledy wyrzucamy dalej
        throw e;
    }

    authCookie(res, user); //tworzymy ciasteczko (logujemy przy rejestracji)
    res.status(201).json(getUserSimple(user)); //status 201 - utworzono konto, zwracamy dane niewrazliwe uzytkownika
}

export async function login(req: Request, res: Response) {
    //walidacja danych logowania
    const loginBody = loginPattern.safeParse(req.body);

    //w przypadku blednych danych Bad Request
    if (!loginBody.success) {
        return res.status(400).json({ error: "Podaj email i hasło"});
    } 

    //dane z jsona requesta do zmiennych
    const { email, password } = loginBody.data;
    
    //zaczytujemy użytkownika z bazy danych dla podanego maila
    const user = await userCollection().findOne({ email });

    //sprawdzamy czy istnieje taki user i czy hasło się zgadza
    const correct = user && (await bcrypt.compare(password, user.passwordHash));

    //przy błędnym mailu lub haśle status 401 - brak uwierzytelnienia
    if (!correct || !user) {
        return res.status(401).json({ error: "Nieprawidłowy adres e-mail lub hasło" });
    }

    //zablokowane konto - 403 - brak autoryzacji
    if (!user.isActive) {
        return res.status(403).json({ error: "Twoje konto jest zablokowane" });
    }

    //tworzymy token i zapisujemy go w ciasteczku
    authCookie(res, user);

    //zwracamy ok - 200 i niewrazliwe dane uzytkownika
    res.status(200).json(getUserSimple(user));
}

export function logout(_req: Request, res: Response) {

    //usuwamy ciasteczko z tokenem
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: env.COOKIE_SECURE });

    res.status(204).end();
}

//endpoint /me - ponowne uwierzytelnianie i autoryzacja
export async function me(req: Request, res: Response) {
    const user = await userCollection().findOne({ _id: new ObjectId(req.user!.id) });
    if (!user || !user.isActive) { 
        return res.status(401).json({ error: "Niezalogowano" });
    }
    res.json(getUserSimple(user));
}
