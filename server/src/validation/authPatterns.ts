//biblioteka do walidacji

import { z } from "zod";

//pattern do walidacji rejestracji
export const registerPattern = z.object({
    //walidacja emaila i zamiana na małe litery
    email: z.email("Nieprawidłowy email").transform((chr) => chr.toLowerCase()),

    //walidacja hasła
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków")
    .max(50, "Hasło może mieć maksymalnie 50 znaków")
    .regex(/[a-z]/, "Hasło musi zawierać małą literę")
    .regex(/[A-Z]/, "Hasło musi zawierać wielką literę")
    .regex(/[0-9]/, "Hasło musi zawierać cyfrę")
    .regex(/[^A-Za-z0-9]/, "Hasło musi zawierać znak specjalny"),

    name: z.string().trim().min(3, "Imię powinno mieć co najmniej 3 znaki").max(60),
    surname: z.string().trim().min(3, "Nazwisko powinno mieć co najmniej 3 znaki").max(80),

    //nie można utworzyć konta administratora przy rejestracji, jest jeden po prostu
    role: z.enum(["uczeń", "korepetytor"])
});

export const loginPattern = z.object({
    email: z.email().transform((chr) => chr.toLowerCase()),
    password: z.string().min(8)
});