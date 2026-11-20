//ten plik przy użyciu rekordu określa ścieżkę na którą trafia użytkownik po zalogowaniu

import type { Role } from "../types/user";

export const homePath: Record<Role, string> = {
    uczeń: "/uczen",
    korepetytor: "/korepetytor",
    administrator: "/administrator",
};