//zaczytanie zmiennych srodowiskowych
import "dotenv/config"

//zod - biblioteka do walidacji
import { z } from "zod"

//walidacja zmiennych środowiskowych - czy mają odpowiednie wartości i typy
const envVariablesPattern = z.object({
    PORT: z.coerce.number().default(3000), //zrzutowanie tekstu na liczbę
    MONGODB_URI: z.string().min(8),
    JWT_SECRET: z.string().min(32),
    //zrzutowanie tekstowego true false na prawdziwy boolean, true tylko w HTTPS, wtedy przechodzi ciasteczko z flagą secure
    COOKIE_SECURE: z.enum(["true", "false"]).default("false").transform((cs) => cs === "true")
});


//parsujemy zmienne srodowiskowe zgodnie z patternem (safeParser nie rzuca wyjątku)
const envVariablesParsed = envVariablesPattern.safeParse(process.env);

//w przypadku błędu wypisanie czego brakuje i kończymy działanie
if (!envVariablesParsed.success) {
    console.log("Błedna konfiguraca .env: ", z.flattenError(envVariablesParsed.error).fieldErrors);
    process.exit(1)
}

//eksportujemy sprawdzone i sparsowane zmienne środowiskowe
export const env = envVariablesParsed.data;