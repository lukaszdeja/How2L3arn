import type { Role } from "../models/user.js";

//rozszerzamy interface request expressa o pole user zeby bezpiecznie przesyłać
declare global {
    namespace Express {
        interface Request {
            user?: { id: string, role: Role };
        }
    }
}

export {}; //eksportujemy caly plik bo ustawiamy w global