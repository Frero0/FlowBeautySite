# FlowBeautySite

Sito Next.js + Tailwind per **Flow Beauty Estetica** (centro estetico a Pinerolo) con:
- Home luxury nude, sezioni Servizi/Prezzi/Recensioni/Chi siamo/Contatti
- Booking interno (API Next) con orari del centro (Mar–Ven 09-19, Sab 09-13)
- Dati servizi e prezzi già caricati (da Treatwell)

## Requisiti
- Node.js 18+ (consigliato via `nvm`)

## Setup rapido
Assicurati di avere le variabili in `.env.local` o `.env`:
- `DATABASE_URL` (Supabase Postgres con `sslmode=require`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

```bash
npm install
DATABASE_URL="postgres://..." npx prisma migrate deploy
DATABASE_URL="postgres://..." npx prisma db seed
npm run dev
```
Apri http://localhost:3000

## Struttura
- `app/page.tsx`: pagina principale con sezioni, CTA e layout luxury nude
- `components/BookingForm.tsx`: form prenotazione con selezione trattamento, data/orario (API booking)
- API:
  - `app/api/services`
  - `app/api/availability`
  - `app/api/bookings` (create)
  - `app/api/bookings/[id]` (get)
  - `app/api/bookings/[id]/cancel`
  - `app/api/bookings/[id]/reschedule`
- `lib/bookingEngine.ts`: regole di disponibilità, lead time, buffer, cancellazioni
- `data/services.ts`: catalogo per UI (il backend usa Prisma)
- `data/site.ts`: contatti, orari, rating
- `data/schedule.ts` + `lib/slots.ts`: generazione slot UI
- `prisma/schema.prisma`: modello dati Booking/Servizi/Orari/Staff
- `prisma/seed.ts`: seed iniziale (categorie, servizi, orari, staff, settings)

## Note
- Disponibilità calcolata con orari settimanali, chiusure, lead time, buffer, lunch (se attivato) e blocco overbooking via constraint Postgres (`btree_gist` + exclusion).
- Per ambiente locale/CI usa `npx prisma migrate deploy` (o `migrate dev`) con `DATABASE_URL` impostata; poi `npx prisma db seed`.
