//ten plik to kontroler obslugujacy profile korepetytorow - endpointy do ich wyswietlania i modyfikacji

import type { Request, Response } from "express";
import { ObjectId, type Filter } from "mongodb";
import { z } from "zod";
import { userCollection, getTutorSimple, type User } from "../models/user.js";
import { tutorDataPattern, tutorFiltersPattern } from "../validation/tutorPattern.js";

//GET /api/tutors - lista korepetytorow, z opcjonalnymi filtrami
export async function getTutors(req: Request, res: Response) {
    //walidacja filtrow w adresie
    const filters = tutorFiltersPattern.safeParse(req.query);
    if (!filters.success) {
        return res.status(400).json({ error: "Błędne filtry", details: z.flattenError(filters.error).fieldErrors});
    }
    //dane z filtrow do zmiennych
    const { subject, level, maxPrice } = filters.data;

    //budujemy "kwerendę" do wyciagniecia odpowiednich korepetytorow z bazy danych z nalozonymi filtrami
    //podstawowa wersja
    const query: Filter<User> = {
        role: "korepetytor",
        isActive: true,
        tutorData: { $exists: true }
    };

    //dodajemy ewentualne filtry
    if (subject) {
        //zagniezdzony obiekt - mongo go sklada i rozklada do pojedynczych pol
        query["tutorData.subjects"] = subject;
    }
    if (level) {
        query["tutorData.levels"] = level;
    }

    if (maxPrice !== undefined) {
        query["tutorData.hourPrice"] = { $lte: maxPrice };
    }

    //wyciagamy korepetytorow z bazy zgodnie ze zbudowanym query
    const tutors = await userCollection().find(query, { projection: 
        {name: 1, surname: 1, tutorData: 1}}
    ).sort({"tutorData.hourPrice" : 1}).toArray();

    //zwracamy jsonem korepetytorow
    res.json(tutors.map(getTutorSimple));
}

//GET - konkretny korepetytor po ID
export async function getTutor(req: Request, res: Response) {
    //wyciagamy z parametrow GETa
    const tutorId = req.params.id;
    //odrzucamy błedne id jesli uzytkownik wpisal cos dziwnego
    if (typeof tutorId !== "string" || !ObjectId.isValid(tutorId)) {
        return res.status(400).json({ error: "Nieprawidłowe id korepetytora"});
    }

    const tutor = await userCollection().findOne({
        _id: new ObjectId(tutorId), role: "korepetytor", isActive: true, tutorData: { $exists: true}
    }, { projection: {name: 1, surname: 1, tutorData: 1}});

    if (!tutor) {
        return res.status(404).json({ error: "Nie znaleziono korepetytora"});
    }
    res.json(getTutorSimple(tutor));
}

//GET - tutors/me dla korepetytora - wlasny profil
export async function getMyProfile(req: Request, res: Response) {
    const tutor = await userCollection().findOne(
        { _id: new ObjectId(req.user!.id) },
        { projection: {name: 1, surname: 1, tutorData: 1}}
    );
    if (!tutor) {
        return res.status(404).json({error: "Nie znaleziono profilu"});
    }
    res.json(getTutorSimple(tutor));
}

//PUT - tutors/me - edycja i zapis własnego profilu
export async function updateMyProfile(req: Request, res: Response) {
    //parsujemy cialo requesta - walidacja czy jest dobrze wypelnione
    const profile = tutorDataPattern.safeParse(req.body);
    if (!profile.success) {
        return res.status(400).json({error: "Błędny profil korepetytora", details: z.flattenError(profile.error).fieldErrors});
    }

    //update profilu w bazie danych
    const updated = await userCollection().findOneAndUpdate(
        { _id: new ObjectId(req.user!.id) },
        //set - zastepuje pole
        { $set: {tutorData: profile.data}},
        //zwraca dokument po zmianie do updated
        { returnDocument: "after", projection: { name: 1, surname: 1, tutorData: 1}}
    );

    if (!updated) {
        return res.status(404).json({ error: "Nie znaleziono profilu"});
    }
    res.json(getTutorSimple(updated));
}