import Image from "next/image";
import { categories, featuredServices } from "@/data/services";
import { reviews } from "@/data/reviews";
import { siteInfo, openingHours } from "@/data/site";
import { BookingForm } from "@/components/BookingForm";

const navigation = [
  { href: "#servizi", label: "Servizi" },
  { href: "#prezzi", label: "Prezzi" },
  { href: "#recensioni", label: "Recensioni" },
  { href: "#chi-siamo", label: "Chi siamo" },
  { href: "#contatti", label: "Contatti" }
];

export default function Page() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <Header />
      <main>
        <Hero />
        <Categories />
        <Featured />
        <BookingSection />
        <Reviews />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-ink/5">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-ink text-white grid place-items-center font-display text-lg">
            F
          </div>
          <div>
            <p className="font-display text-lg leading-tight text-ink">Flow Beauty Estetica</p>
            <p className="text-xs text-ink/70">Pinerolo</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-ink/80">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#prenota"
            className="hidden sm:inline-flex rounded-full border border-ink/15 px-3 py-2 text-xs font-semibold text-ink hover:border-ink/30"
          >
            WhatsApp
          </a>
          <a
            href="#prenota"
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-ink/90"
          >
            Prenota ora
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="section">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.08em] text-ink/60">Centro estetico a Pinerolo</p>
          <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
            Bellezza e benessere, con calma e cura dei dettagli.
          </h1>
          <p className="text-lg text-ink/80">
            Trattamenti viso, unghie, laminazione ed epilazione in un ambiente elegante.
            Prenota online in pochi click, orari prolungati dal martedì al sabato.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#prenota"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-ink/90"
            >
              Prenota ora
            </a>
            <a
              href="#servizi"
              className="rounded-full border border-ink/20 px-5 py-3 text-sm font-semibold text-ink hover:border-ink/40"
            >
              Scopri i trattamenti
            </a>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-ink/70">
            <span className="rounded-full bg-white/80 px-3 py-2 shadow-soft ring-1 ring-ink/5">
              5,0 ★ ({siteInfo.reviewsCount} recensioni)
            </span>
            <span className="rounded-full bg-white/80 px-3 py-2 shadow-soft ring-1 ring-ink/5">
              Prenotazione rapida
            </span>
            <span className="rounded-full bg-white/80 px-3 py-2 shadow-soft ring-1 ring-ink/5">
              Ambiente curato e rilassante
            </span>
          </div>
        </div>
        <div className="relative grid gap-4 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-white/60 p-2 shadow-card ring-1 ring-ink/5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-nude-100">
              <Image
                src="https://cdn1.treatwell.net/images/view/v2.i13794551.w720.h480.x48FACDC2/"
                alt="Trattamento viso"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-3 space-y-1 px-1">
              <p className="text-sm font-semibold text-ink">Glow & relax</p>
              <p className="text-xs text-ink/70">Trattamenti viso su misura</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-white/60 p-2 shadow-card ring-1 ring-ink/5 sm:translate-y-10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-nude-100">
              <Image
                src="https://cdn1.treatwell.net/images/view/v2.i13794553.w720.h480.x342AD42E/"
                alt="Manicure di precisione"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-3 space-y-1 px-1">
              <p className="text-sm font-semibold text-ink">Dettaglio perfetto</p>
              <p className="text-xs text-ink/70">Unghie curate, fini ed eleganti</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="section" id="servizi">
      <div className="container space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-semibold text-accent">Servizi</p>
          <h2 className="font-display text-3xl text-ink">Scegli il tuo percorso</h2>
          <p className="text-ink/70">
            Dal risultato immediato alla routine di cura: viso, unghie, laminazione ed epilazione, con prezzi chiari.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group rounded-2xl bg-white/80 p-5 shadow-soft ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-xl text-ink">{cat.name}</h3>
                  <p className="text-sm text-ink/70">{cat.description}</p>
                </div>
                <span className="rounded-full bg-nude-100 px-3 py-1 text-xs text-ink/70">
                  {cat.services.length} tratt.
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-ink/80">
                {cat.services.slice(0, 3).map((svc) => (
                  <div key={svc.id} className="flex justify-between">
                    <span>{svc.name}</span>
                    <span className="text-ink/70">{svc.price}</span>
                  </div>
                ))}
                {cat.services.length > 3 && (
                  <p className="text-xs text-ink/60">+ altri {cat.services.length - 3}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Featured() {
  return (
    <section className="section" id="prezzi">
      <div className="container space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-semibold text-accent">Più prenotati</p>
          <h2 className="font-display text-3xl text-ink">Trattamenti in evidenza</h2>
          <p className="text-ink/70">
            Soluzioni scelte spesso dalle clienti: precise, curate, con beneficio immediato.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((svc) => (
            <div
              key={svc.id}
              className="rounded-2xl bg-white/85 p-5 shadow-soft ring-1 ring-ink/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-ink/50">{svc.category}</p>
                  <h3 className="font-display text-xl text-ink">{svc.name}</h3>
                </div>
                <span className="rounded-full bg-nude-100 px-3 py-1 text-xs text-ink/70">
                  {svc.duration}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink/70">{svc.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-semibold text-ink">{svc.price}</span>
                <a
                  href="#prenota"
                  className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-ink/80"
                >
                  Prenota
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  return (
    <section className="section" id="prenota">
      <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-accent">Prenotazione</p>
          <h2 className="font-display text-3xl text-ink">Prenotare è semplice</h2>
          <p className="text-ink/70">
            Scegli il trattamento, il giorno e l&apos;orario. Conferma in pochi secondi, con orari estesi dal martedì al venerdì e sabato mattina.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard title="Orari" lines={[
              "Mar–Ven 09:00–19:00",
              "Sab 09:00–13:00",
              "Dom/Lun chiuso"
            ]} />
            <InfoCard title="Contatti" lines={[
              `Tel. ${siteInfo.phone}`,
              "WhatsApp rapido",
              "Conferma entro poche ore"
            ]} />
          </div>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}

function InfoCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-soft ring-1 ring-ink/5">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <div className="mt-2 space-y-1 text-sm text-ink/70">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <section className="section" id="recensioni">
      <div className="container space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-accent">Recensioni</p>
            <h2 className="font-display text-3xl text-ink">Chi ci sceglie, lo racconta</h2>
            <p className="text-ink/70">
              Professionalità, ambiente elegante e attenzione alle richieste: sono i temi che tornano più spesso.
            </p>
          </div>
          <a
            href="#prenota"
            className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-ink/90"
          >
            Prenota ora
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.author} className="rounded-2xl bg-white/80 p-4 shadow-soft ring-1 ring-ink/5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{review.author}</p>
                <span className="text-sm text-ink/70">★ {review.rating}</span>
              </div>
              <p className="mt-2 text-sm text-ink/75">{review.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section" id="chi-siamo">
      <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-accent">Chi siamo</p>
          <h2 className="font-display text-3xl text-ink">Un centro, una filosofia</h2>
          <p className="text-ink/75">
            Qui la bellezza non è fretta: è attenzione e ascolto. Scegliamo insieme il trattamento più adatto, con cura dei dettagli e risultati concreti.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard title="Il tono Flow" lines={[
              "Ambiente curato e silenzioso",
              "Accoglienza e trasparenza",
              "Risultati visibili, non eccessivi"
            ]} />
            <InfoCard title="Cosa aspettarti" lines={[
              "Analisi e ascolto iniziale",
              "Suggerimenti su misura",
              "Prodotti e tecniche selezionate"
            ]} />
          </div>
        </div>
        <div className="rounded-3xl bg-white/70 p-3 shadow-card ring-1 ring-ink/5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-nude-100">
            <Image
              src="https://scontent-fco2-1.xx.fbcdn.net/v/t39.30808-6/288696193_116102211121898_1358662396718067748_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=CHjvvTDWOT8Q7kNvwGSWSs-&_nc_oc=AdloQKPA-1c7wOP5DHX9DQv3tRfz-9o-npPowefq9pnOksppvHLejR7F7sCHashY_Qs&_nc_zt=23&_nc_ht=scontent-fco2-1.xx&_nc_gid=461icjskniDgaWXOuaBcdg&oh=00_AfkH4G47VmI-MWZpUmOxAkg2ocaxv8gs_bVJRCgsvhYGiA&oe=69472AC8"
              alt="Titolare del centro"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-3 px-1">
            <p className="font-display text-lg text-ink">Mara</p>
            <p className="text-sm text-ink/70">Estetista e fondatrice di Flow Beauty Estetica</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section" id="contatti">
      <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-accent">Contatti</p>
          <h2 className="font-display text-3xl text-ink">Dove trovarci</h2>
          <p className="text-ink/75">
            {siteInfo.address}. A pochi minuti dalla stazione di Pinerolo.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard title="Telefono" lines={[siteInfo.phone, "WhatsApp rapido"]} />
            <InfoCard title="Email" lines={[siteInfo.email, "Risposta entro poche ore"]} />
          </div>
          <div className="rounded-2xl bg-white/80 p-4 shadow-soft ring-1 ring-ink/5">
            <p className="text-sm font-semibold text-ink">Orari</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-ink/70 sm:grid-cols-3">
              {openingHours.map((row) => (
                <div key={row.day} className="flex justify-between gap-2">
                  <span>{row.day}</span>
                  <span>{row.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white/80 p-3 shadow-card ring-1 ring-ink/5">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-nude-100 to-nude-50 grid place-items-center text-ink/60">
            <p className="text-sm">Mappa qui (embed Google Maps)</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${siteInfo.whatsapp}`}
              className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:border-ink/40"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${siteInfo.phone.replace(/\\s+/g, "")}`}
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
            >
              Chiama ora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white/80 py-8">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg text-ink">Flow Beauty Estetica</p>
          <p className="text-sm text-ink/70">{siteInfo.address}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#prenota"
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-ink/90"
          >
            Prenota ora
          </a>
          <a
            href="#servizi"
            className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink hover:border-ink/30"
          >
            Servizi
          </a>
        </div>
      </div>
    </footer>
  );
}
