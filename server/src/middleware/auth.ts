//ten plik obsługuje middleware (funkcje pośrednie) autoryzacji i autentyfiakcji

//importy - obsluga żądań rest, tokenu jwt itd
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/checkenv.js";
import { userCollection, type Role } from "../models/user.js";
import { ObjectId } from "mongodb";


//zawartość tokenu JWT
interface TokenBody {
    userId: string;
    role: Role;
};

//funkcja weryfikująca token JWT - czy istnieje, czy jest prawidłowy i czy nie wygasł - uwierzytelnianie
export async function authenticate(req: Request, res: Response, next: NextFunction) {
    //pobranie tokenu
    const token = req.cookies?.token;

    //brak tokenu konczy sie statusem 401 i brakiem autentyfikacji (serwer nie wie "kim jestes")
    if (!token) {
        return res.status(401).json({ error: "Niezalogowano" })
    }

    let tokenBody: TokenBody;
    try {
        //weryfikacja czy token jest poprawny (podpis) i czy jest aktualny - jeśli nie to wyjątek
        tokenBody = jwt.verify(token, env.JWT_SECRET) as TokenBody;
    } catch {
        return res.status(401).json({ error: "Token jest nieprawidłowy lub wygasł" });
    }

    //sprawdzamy czy konto uzytkownika jest aktywne czy zablokowane
    let user = await userCollection().findOne({_id: new ObjectId(tokenBody.userId)}, {
        projection: { role: 1, isActive: 1}
    });

    //obslugujemy konta ktorych nie znajdziemy
    if (!user) {
        return res.status(401).json({ error: "Konto nie istnieje" });
    }
    //a tutaj zablokowane konta - status 403
    if (!user.isActive) {
        return res.status(403).json({ error: "Konto jest zablokowane"});
    }
    //podmieniamy rolę na właściwą z bazy jeżeli ktoś podmienił sobie role w tokenie
    req.user = { id: tokenBody.userId, role: user.role };
}

//celem jest utworzyć middleware (funkcję pośrednią) mechanizmu ograniczania dostępu względem roli 
//autoryzacja
//funkcja zewnętrzna wywoływana jest raz przy definiowaniu trasy i zwraca funkcje
//wewnętrzne (faktyczne middleware) pamiętające rolę - robimy tak przez to że składania middleware
//wymaga req, res, next, nie przyjęłaby roli
export function requireRole(...roles : Role[]) {
    //ta funkcja wewnętrzna jest wykonywana przy odpowiednich żądaniach
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ error: "Niezalogowano" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Nie masz uprawnień" });
        }
        next();
    }
}