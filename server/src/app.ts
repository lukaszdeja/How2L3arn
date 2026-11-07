//ten plik buduje aplikacje, konfiguruje, opisuje jak ma ona działać

//importujemy framework express na którym chodzi aplikacja oraz parser ciasteczek
import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authroutes.js";

//aplikację exportujemy żeby plik server mógł ją uruchomić
export const app = express();

//umożliwia parsowanie jsona na obiekty
app.use(express.json());

//umożliwia wykorzystanie ciasteczek
app.use(cookieParser());

//testowy endpoint sprawdzający czy aplikacja została dobrze skonfigurowana
app.get("/api/test", (req, res) => {
    res.json({ok: true}); //w odpowiedzi wysyłamy prostego jsona potwierdzającego że działa
});

//ustawiamy prefix dla endpointow z authRouter
app.use("/api/auth", authRouter);

//blokujemy /api
app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Nie ma takiego endpointu" });
});


//obsluga błędów dla całej aplikacji (ogólna)
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.log(error);
    res.status(500).json({ error: "Błąd serwera" }); //klient dostaje tylko ogólny komunikat 500
})