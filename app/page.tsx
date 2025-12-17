import Image from "next/image";
import { categories } from "@/data/services";
import { siteInfo, openingHours } from "@/data/site";
import { GOOGLE_REVIEWS_URL } from "@/data/googleReviews";
import { BookingForm } from "@/components/BookingForm";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { CategoriesSpotlight } from "@/components/CategoriesSpotlight";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { PriceType } from "@prisma/client";

const heroImages = [
  {
    src: "/hero-viso.jpg",
    alt: "Trattamento viso professionale"
  },
  {
    src: "/hero-mani.jpg",
    alt: "Manicure elegante e curata"
  },
  {
    src: "/hero-epilazione.jpg",
    alt: "Ambiente del centro estetico Flow Beauty"
  }
];

type FormService = {
  id: string;
  name: string;
  priceLabel: string;
};

const formatPriceLabel = (priceType: PriceType, from?: number | null, to?: number | null) => {
  if (priceType === "RANGE" && from && to) return `€${from}–€${to}`;
  if (priceType === "FROM" && from) return `da €${from}`;
  if (priceType === "FIXED" && from) return `€${from}`;
  return "Prezzo su richiesta";
};

export default async function Page() {
  const dbServices = await prisma.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      priceType: true,
      priceFrom: true,
      priceTo: true
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
  });

  const defaultStaff = await prisma.staffMember.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" }
  });

  const formServices: FormService[] = dbServices.map((svc) => ({
    id: svc.id,
    name: svc.name,
    priceLabel: formatPriceLabel(svc.priceType, svc.priceFrom, svc.priceTo)
  }));

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <Header />
      <main>
        <Hero />
        <Categories />
        <WhyChooseUs />
        <Reviews />
        <BookingSection
          formServices={formServices}
          defaultStaffId={defaultStaff?.id ?? ""}
          staffName={defaultStaff?.name ?? "Staff"}
        />
        <About />
        <Contact />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="section pt-8">
      <div className="container space-y-8">
        <HeroCarousel images={heroImages} />
        <div className="space-y-6 text-center md:space-y-5">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.08em] text-ink/60">Centro estetico a Pinerolo</p>
            <h1 className="font-display text-3xl leading-tight text-ink md:text-[2.8rem]">
              Bellezza e benessere, con calma e cura dei dettagli.
            </h1>
            <p className="mx-auto max-w-3xl text-base text-ink/80 md:text-lg">
              Trattamenti viso, unghie, laminazione ed epilazione in un ambiente elegante.
              Prenota online in pochi click, orari prolungati dal martedì al sabato.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
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
          <div className="flex flex-wrap justify-center gap-3 text-sm text-ink/70">
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
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="section scroll-mt-24" id="servizi">
      <div className="container space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-semibold text-accent">Servizi</p>
          <h2 className="font-display text-3xl text-ink">Scegli il tuo percorso</h2>
          <p className="text-ink/70">
            Dal risultato immediato alla routine di cura: viso, unghie, laminazione ed epilazione, con prezzi chiari.
          </p>
        </div>
        <CategoriesSpotlight categories={categories} />
      </div>
    </section>
  );
}

const whyReasons = [
  "Specializzazione in trattamenti viso e corpo",
  "Servizi di estetica completi",
  "Ambiente rilassante e professionale",
  "Solo professionisti qualificati",
  "Recensioni eccellenti e clienti soddisfatte",
  "Nel cuore di Pinerolo, con cura dei dettagli"
];

const whyStats = [
  { value: "20", label: "ANNI DI ESPERIENZA" },
  { value: "1", label: "OPERATRICE" },
  { value: "5.0", label: "MEDIA RECENSIONI" }
];

function WhyChooseUs() {
  return (
    <section className="section" id="prezzi">
      <div className="container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="rounded-[32px] bg-white/80 p-4 shadow-card ring-1 ring-ink/5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-nude-100">
            <Image
              src="/centro-flow.jpg"
              alt="Interno del centro Flow Beauty Estetica"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority={false}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Alleati per la tua bellezza
            </p>
            <h2 className="font-display text-3xl text-ink">Perché sceglierci</h2>
            <p className="text-sm text-ink/70">
              Ritualità slow beauty, consulenze personalizzate e protocolli accurati per risultati visibili e delicati.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-ink/80">
            {whyReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-nude-100 text-[11px] text-ink">
                  ✓
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 sm:grid-cols-3">
            {whyStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/70 p-4 text-center shadow-soft ring-1 ring-ink/5">
                <p className="font-display text-3xl text-ink">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-ink/60">{stat.label}</p>
              </div>
            ))}
          </div>
          <a
            href="#prenota"
            className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-ink/90"
          >
            Prenota ora
          </a>
        </div>
      </div>
    </section>
  );
}

function BookingSection({
  formServices,
  defaultStaffId,
  staffName
}: {
  formServices: FormService[];
  defaultStaffId: string;
  staffName: string;
}) {
  return (
    <section className="section" id="prenota">
      <div className="container space-y-8">
        <div className="space-y-4 max-w-3xl">
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
        <BookingForm
          services={formServices}
          defaultStaffId={defaultStaffId}
          staffName={staffName}
        />
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
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-accent">Recensioni</p>
            <h2 className="font-display text-3xl text-ink">Chi ci sceglie, lo racconta</h2>
            <p className="text-ink/70">
              Professionalità, ambiente elegante e attenzione alle richieste: sono i temi che tornano più spesso.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold text-ink hover:border-ink/40"
            >
              Leggi tutte su Google
            </a>
            <a
              href="#prenota"
              className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-ink/90"
            >
              Prenota ora
            </a>
          </div>
        </div>
        <ReviewsCarousel />
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
          <GoogleMapEmbed address={siteInfo.address} />
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
