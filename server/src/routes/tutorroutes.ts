//trasowanie dla kontrolera korepetytorow - wywolanie funkcji z kontrolera dla wlasciwych endpointow

import { Router } from "express";
import { getTutors, getTutor, getMyProfile, updateMyProfile } from "../controllers/tutorcontroller.js";
import { authenticate, requireRole } from "../middleware/auth.js";

export const tutorRouter = Router();

tutorRouter.get("/", getTutors);
tutorRouter.get("/me", authenticate, requireRole("korepetytor"), getMyProfile);
tutorRouter.put("/me", authenticate, requireRole("korepetytor"), updateMyProfile);
tutorRouter.get("/:id", getTutor);