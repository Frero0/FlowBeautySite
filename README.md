# FlowBeautySite

Sito Next.js + Tailwind per **Flow Beauty Estetica** (centro estetico a Pinerolo) con:
- Home luxury nude, sezioni Servizi/Prezzi/Recensioni/Chi siamo/Contatti
- Booking interno (API Next) con orari del centro (Mar–Ven 09-19, Sab 09-13)
- Dati servizi e prezzi già caricati (da Treatwell)

## Requisiti
- Node.js 18+ (consigliato via `nvm`)

## Setup rapido
```bash
npm install
npm run dev
```
Apri http://localhost:3000

## Struttura
- `app/page.tsx`: pagina principale con sezioni, CTA e layout luxury nude
- `components/BookingForm.tsx`: form prenotazione con selezione trattamento, data/orario
- `app/api/bookings/route.ts`: endpoint booking (in-memory). Sostituire con DB/Prisma per produzione
- `data/services.ts`: catalogo servizi/prezzi/durate
- `data/site.ts`: contatti, orari, rating
- `data/schedule.ts` + `lib/slots.ts`: generazione slot orari in base agli orari di apertura

## Da fare per produzione
- Collegare un DB (Postgres + Prisma) per persistere prenotazioni e gestire disponibilità reale per risorsa/stanza
- Aggiungere mail/SMS (es. Resend + Twilio) per conferme
- Integrare embed Google Maps e immagini proprietarie in `/public`
- Aggiornare email ufficiale in `data/site.ts`
