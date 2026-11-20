import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

//ustawiamy proxy w czasie developmentu aplikacji zeby obejść Same-Origin Policy i CORS
//przeglądarka traktuje dzięki temu frontend i backend jako jedną aplikację
//przeglądarka rozmawia tylko z frontendem vite, przekazuje żądania na api na ten sam
//adres i z tymi samymi ciasteczkami ale na innym porcie (backend)
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://localhost:3000'
        },
    },
})
