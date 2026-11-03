//ten plik buduje aplikacje, konfiguruje, opisuje jak ma ona działać

//importujemy framework express na którym chodzi aplikacja oraz parser ciasteczek
import express from "express";
import cookieParser from "cookie-parser";

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