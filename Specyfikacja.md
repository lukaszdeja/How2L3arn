# How2L3arn - platforma do korepetycji
**Autor**: Łukasz Deja

Projekt realizowany w ramach przedmiotu Techniki Internetowe.

## 1. Zawartość merytoryczna projektu:
Serwis realizuje platformę do korepetycji online. Uczeń może wyszukać interesującego go korepetytora według przedmiotu, poziomu, ceny.

Może też zarezerwować lekcje w interesującym go terminie, po zajęciach otrzymuje na stronie od korepetytora zadania domowe do rozwiązania i materiały. 

Korepetytor zarządza swoim profilem, dostępnością i ocenia rozwiązania zadań swoich uczniów.

Administrator weryfikuje konta korepetytorów, może też blokować użytkowników, zarządza całym serwisem.

W rozszerzonej wersji platforma umożliwia również uczniom wystawianie opinii swoim korepetytorom.

## 2. Zawartość funkcjonalna projektu:

**Funkcjonalności już zrealizowane:**

- rejestracja z wyborem roli (uczeń / korepetytor) i walidacją danych po stronie serwera, z błędami wyświetlanymi przy odpowiednich polach formularza,
- logowanie i wylogowanie,
- użytkownik jest zalogowany po odświeżeniu strony (token JWT w ciasteczku)
- autoryzacja na serwerze (weryfikacja tokenu JWT dla chronionych endpointów i roli tam gdzie dostęp jest ograniczony),
- trasy chronione w kliencie i osobne panele dla każdej roli.

**Funkcjonalności zaplanowane:**

1. Katalog korepetytorów z filtrami: przedmiot, poziom (szkoła podstawowa, liceum, studia), cena.
2. Edycja profilu korepetytora.
3. Kalendarz dostępności korepetytora i rezerwacja terminu przez ucznia.
4. Statusy rezerwacji: oczekująca, potwierdzona, odrzucona, anulowana, zakończona.
5. Panel ucznia (nadchodzące zajęcia, zadania do oddania) i panel korepetytora (prośby o rezerwację, plan tygodnia).
6. Zadania domowe: dodawanie przez korepetytora, oddawanie rozwiązania przez ucznia, ocena z komentarzem.
7. Panel administratora: weryfikacja kont korepetytorów, blokowanie użytkowników.
8. Rozszerzenia: opinie i średnia ocena korepetytora, statystyki.

## 3. Wybrane rozwiązanie technologiczne:

Aplikacja typu **SPA** z wykorzystaniem stylu **REST**. Aplikacja kliencka napisana w **React** komunikuje się z serwerem przez **REST API** - funkcja **fetch()** przesyła **JSONa**. Część serwerowa jest napisana w **TypeScript**, w środowisku **node.js**.

## 4. Baza danych:

Część serwerowa komunikuje się z dokumentową bazą danych **MongoDB**, natywnie, bez ORM ani ODM. Kształt dokumentów w bazie opisują modele (typy) w TypeScript. Przy starcie serwera tworzone są indeksy, które zapewniają funkcjonalności w bazie takie jak na przykład unikalność danych.

Na ten moment częściowo zrealizowano jedną kolekcję w bazie danych (użytkownicy):

| Kolekcja | Pola |
| --- | --- |
| `users` | email (indeks unikalny), passwordHash, name, surname, role, isActive, creationDate |

Dodatkowo do tej kolekcji dodane będzie jeszcze nowe pole (obiekt) - profil korepetytora, tylko u korepetytorów (przedmioty, poziomy, cena, opis)

Pozostałe zaplanowane kolekcje:

1. `slots` (wolne terminy)
2. `bookings` (rezerwacje)
3. `assignments` (zadania)
4. `reviews` (recenzje)

Na ten moment baza danych jest uruchamiana w kontenerze Docker.

## 5. Część serwerowa serwisu:

Część serwerowa jest napisana w **TypeScript** w środowisku **node.js**.

Realizacja funkcjonalności części serwerowej:

| Funkcjonalność | Rozwiązanie/technologia |
| --- | --- |
| Framework HTTP | Express 5 |
| Dostęp do bazy | natywny sterownik `mongodb` |
| Walidacja danych wejściowych i konfiguracji | zod |
| Tokeny | `jsonwebtoken` |
| Hasła | bcrypt (koszt 12) |
| Ciasteczka | `cookie-parser` |

## 6. Część klienta serwisu:

Część klienta serwisu to **SPA** zrealizowana za pomocą biblioteki **React 19** oraz **TypeScript**, budowana narzędziem **Vite**.

Realizacja funkcjonalności części klienckiej:

| Funkcjonalność | Rozwiązanie/technologia |
| --- | --- |
| Routing | React Router (trasy, przekierowania, trasy chronione rolą) |
| Stan zalogowanego użytkownika | React Context |
| Komunikacja z serwerem | `fetch()` |

## 7. Uwierzytelnienie i autoryzacja:

**Role autoryzowane (trzy):**

| Rola | Uprawnienia |
| --- | --- |
| uczeń | przeglądanie korepetytorów, rezerwacje, oddawanie zadań, opinie |
| korepetytor | profil, terminy, obsługa rezerwacji, zadania i ich ocena |
| administrator | weryfikacja i blokowanie kont, wgląd we wszystkie rezerwacje |

Rola administratora nie jest dostępna w formularzu rejestracji. Serwer odrzuca ją również przy ręcznie spreparowanym żądaniu.

**Stan zalogowania realizowany tokenem JWT:**

- po zalogowaniu serwer podpisuje token zawierający identyfikator i rolę użytkownika,
- token jest zapisywany w ciasteczku `httpOnly`, ważny przez 1 dzień,
- serwer nie przechowuje informacji o zalogowanych użytkownikach (jest bezstanowy) – cały stan zalogowania przenosi token wysyłany przez przeglądarkę z każdym żądaniem,
- przy każdym chronionym żądaniu serwer weryfikuje podpis i ważność tokena (uwierzytelnienie), a na endpointach dostępnych tylko dla wybranych ról – także rolę użytkownika (autoryzacja),
- kody odpowiedzi: `401` – brak lub nieważny token, `403` – brak uprawnień do zasobu lub zablokowane konto.

## 8. Walidacja projektu:

- Strony generowane po stronie klienta (wyrenderowany przez JavaScript kod) będą sprawdzane w walidatorze W3C (validator.w3.org) zgodnie ze standardem HTML5.
- Kodowanie stron: UTF-8, język dokumentu: `lang="pl"`.
- **Projekt nie jest realizowany pod konkretną przeglądarkę** – testowany w Firefox, Chrome i Edge.

## 9. Uruchomienie:

Obecnie projekt jest uruchamiany w trybie deweloperskim lokalnie z bazą danych w kontenerze Docker. W finalnej wersji projekt zostanie uruchomiony na serwerze Pascal, jeżeli się uda to także w chmurze obliczeniowej.