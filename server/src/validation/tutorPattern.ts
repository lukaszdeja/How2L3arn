//plik sluzacy do walidacji profilow korepetytorow oraz walidacji filtrowania korepetytorow
import { z } from "zod";
import {SUBJECTS, LEVELS} from "../models/user.js";

//walidacja profilu korepetytora - kiedy go sobie tworzy na stronie
export const tutorDataPattern =  z.object({
    //przedmioty - tablica elementów z SUBJECTS, musi byc minimum 1
    subjects: z.array(z.enum(SUBJECTS)).min(1, "Wybierz co najmniej jeden przedmiot").transform(
        //tablice przeksztalcamy w Set zeby usunac dupliakty a pozniej znow rozpraszamy na tablice
        (a) => [...new Set(a)]
    ),
    //analogicznie poziomy
    levels: z.array(z.enum(LEVELS)).min(1, "Wybierz co najmniej jeden poziom").transform(
        (a) => [...new Set(a)]
    ),
    hourPrice: z.number().int("Stawka musi być liczbą naturalną").min(31, "Minimalna stawka to 31 zł")
    .max(200, "Maksymalna stawka to 200 zł"),
    description: z.string().trim().max(1000, "Opis może mieć najwyżej 1000 znaków")
});

//walidacja filtrów z adresu po /GET
export const tutorFiltersPattern = z.object({
    subject: z.enum(SUBJECTS).optional(),
    level: z.enum(LEVELS).optional(),
    maxPrice: z.coerce.number().positive().optional()
});