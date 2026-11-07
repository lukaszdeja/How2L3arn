//plik uruchamiający serwer

//importujemy zwalidowane zmienne środowiskowe
import { env } from "./config/checkenv.js"

//importujemy ze skompilowanego do jsa pliku app.ts obiekt aplikacji
import { app } from "./app.js";

//na podobnej zasadzie importujemy funkcję łączącą z bazą
import { connectDB } from "./config/database.js";

//import funkcji ustawiajacej index unique w bazie danych
import { ensureUniqueEmail } from "./models/user.js";

//łączymy się z bazą danych (! - not null assertion)
await connectDB(env.MONGODB_URI!);

//ustawiamy index unique jesli potrzeba
await ensureUniqueEmail();

//uruchamiamy aplikację na ustawionym porcie
app.listen(env.PORT, () => console.log(`Serwer: http://localhost:${env.PORT}`));