//interfejs określający jakiego typu jest odpowiedź serwera jsonowa na zapytania uwierzytelniające
export type Role = "uczeń" | "korepetytor" | "administrator";

export interface UserSimple {
    id: string;
    email: string;
    name: string;
    surname: string;
    role: Role;
}
