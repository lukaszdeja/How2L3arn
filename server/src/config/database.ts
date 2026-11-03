//w tym pliku konfigurujemy połączenie z bazą danych

//import klienta MongoDB
import { MongoClient, type Db } from "mongodb";

//obiekt połączenia z bazą danych - przed połączeniem null, po udanym połączeniu jest typu Db
let database: Db | null = null;

//funkcja łącząca z bazą danych - eksportujemy ją żeby można było z niej korzystać w innych plikach
export async function connectDB(dbUri: string) {
    const client = new MongoClient(dbUri);
    await client.connect();
    database = client.db();  //po połączeniu z bazą pod adresem przekazanym w parametrze, przypisujemy obiekt połączenia z bazą danych
    console.log("Udało się połączyć z bazą danych");
}

//funkcja zwracająca obiekt połączenia z bazą danych
export function getDb(): Db {
    if (!database)  {
        throw new Error("Najpierw połącz się z bazą danych"); //jeżeli nie udało się połączyć z bazą rzucamy wyjątek
    }
    return database;
}