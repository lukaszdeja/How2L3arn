//ten plik zawiera skrypt tworzący użytkownika z rolą administrator w bazie
//bez niego nie da się utworzyć konta administratora np przez rejestracje - api celowo na to nie pozwala

import { env } from "../config/checkenv.js";
import { connectDB, closeDB } from "../config/database.js";
import { userCollection, ensureUniqueEmail, type User } from "../models/user.js";
import { registerPattern } from "../validation/authPatterns.js";
import { z } from "zod";
import  bcrypt  from "bcrypt";

//tworzymy pattern bez roli bo rola juz jest znana
const adminPattern = registerPattern.pick({email: true, password: true, name: true, surname: true});

//wartosci jako argumenty przy uruchamianiu skryptu w konsoli
const [email, password, name, surname] = process.argv.slice(2);
//parsowanie - walidacja
const parsed = adminPattern.safeParse({email, password, name, surname});

if (!parsed.success) {
    console.error("Uruchom w ten sposób: npm run create-admin -- <email> <hasło> <imię> <nazwisko>");
    console.error(z.flattenError(parsed.error).fieldErrors);
    process.exit();
}

await connectDB(env.MONGODB_URI);
await ensureUniqueEmail();

//tworzymy obiekt uzytkownika
const admin: User = {
    email: parsed.data.email,
    passwordHash: await bcrypt.hash(parsed.data.password, 12),
    name: parsed.data.name,
    surname: parsed.data.surname,
    role: "administrator",
    isActive: true,
    creationDate: new Date()
};

//próbujemy dodać go do bazy danych - jeżeli nie uda się to wypisujemy błąd (wiadomość)
try {
    await userCollection().insertOne(admin);
    console.log(`Udało się utworzyć konto administratora: ${admin.email}`);
} catch (e) {
    console.error("Nie udało się utworzyć konta administratora", e instanceof Error ? e.message : e);
    process.exitCode = -1;
} finally {
    //zawsze zamykamy połączenie z bazą
    await closeDB();
}