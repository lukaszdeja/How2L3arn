
//wlasna klasa bledu dla Api, rozszerza Error, zawiera status odpowiedzi REST
//oraz opcjonalne pole details - szczegóły błędu
export class ApiError extends Error {
    status: number;
    //może być puste
    details?: Record<string, string[]>;
    constructor(status: number, message: string, details?: Record<string, string[]>) {
        super(message);
        this.status = status;
        this.details = details;
    } 
}

//funkcja z parametrem T (generycznym) obsługująca wysyłanie żądań na wszystkie endpointy
//zwraca obietnice dla odpowiedniego T
//options - opcje dla funkcji fetch - domyślnie RequestInit dla fetch, czyli metoda GET
export async function request<T>(path: string, options: RequestInit = {}) : Promise<T> {
    const response = await fetch(`/api${path}`, {
        //spread operator - rozpakowuje obiekt typu RequestInit - opcje requesta, metodę
        ...options,
        //w nagłówku domyślnie JSON chyba że w wywołaniu ktoś da coś innego, to wtedy z option
        headers: { "Content-Type" : "application/json", ...options.headers},
    });

    if (response.status === 204) {
        //w przpadku statusu 204 no content przy wylogowaniu nie można odczytać jsona wiec zwracamy undefined
        return undefined as T;
    }

    //odczytujemy dane z jsona odpowiedzi - w przypadku błędu - pusty obiekt
    const data = await response.json().catch(() => ({}));

    //dla statusów 4xx i 5xx rzucamy utworzony błąd
    if (!response.ok) {
        throw new ApiError(response.status, data.error ?? "Błąd serwera", data.details);
    }

    return data as T; //dla sukcesu zwracamy obiekt z jsona
}