//ten plik obsluguje "trasowanie" - przypisuje poszczegolnym endpointom REST Api,  funkcje backendowe
//ktore są wywolywane - dla authcontroller.ts

import { Router } from "express";
import { register, login, logout, me } from "../controllers/authcontroller.js";
import { requireRole } from "../middleware/auth.js";

//router - trasuje endpointy
export const authRouter = Router();

//trasowanie endpointów autoryzacji i autentyfikacji:
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireRole, me);