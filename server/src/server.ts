//importujemy zmienne środowiskowe z .env
import "dotenv/config";

//importujemy ze skompilowanego do jsa pliku app.ts obiekt aplikacji
import { app } from "./app.js";

//na podobnej zasadzie importujemy funkcję łączącą z bazą
import { connectDB } from "./config/database.js";

import { env } from "./config/checkenv.js"

//ustawiamy port na którym wystartuje server - z .env lub domyślnie 3000
const PORT = Number(env.PORT) || 3000;

//łączymy się z bazą danych (! - not null assertion)
await connectDB(env.MONGODB_URI!)

//uruchamiamy aplikację na ustawionym porcie
app.listen(PORT, () => console.log(`Serwer: http://localhost:${PORT}`));