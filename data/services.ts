export type Service = {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  category: string;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  services: Service[];
};

export const categories: Category[] = [
  {
    id: "viso",
    name: "Viso",
    description: "Pulizia specifica e trattamenti per una pelle luminosa.",
    services: [
      {
        id: "pulizia-viso",
        name: "Pulizia viso specifica",
        price: "€40",
        duration: "1h",
        description: "Detersione profonda e personalizzata per rinnovare la pelle.",
        category: "Viso",
        featured: true
      },
      {
        id: "trattamento-viso",
        name: "Trattamento viso",
        price: "€50",
        duration: "1h",
        description: "Percorso mirato per luminosità e idratazione.",
        category: "Viso"
      }
    ]
  },
  {
    id: "mani",
    name: "Mani",
    description: "Semipermanente e gel per unghie curate e resistenti.",
    services: [
      {
        id: "semi-rinforzato",
        name: "Semipermanente mani rinforzato",
        price: "€35",
        duration: "1h",
        description: "Copertura rinforzata, finish elegante.",
        category: "Mani",
        featured: true
      },
      {
        id: "copertura-gel",
        name: "Copertura gel unghia naturale",
        price: "€40",
        duration: "1h15",
        description: "Protezione in gel, effetto naturale e ordinato.",
        category: "Mani"
      },
      {
        id: "refill-corto",
        name: "Refill gel corte/medie",
        price: "€45",
        duration: "1h15",
        description: "Refill preciso, mantenimento della forma.",
        category: "Mani"
      },
      {
        id: "refill-lungo",
        name: "Refill gel lunghe",
        price: "€50",
        duration: "1h30",
        description: "Refill accurato per lunghezze importanti.",
        category: "Mani"
      },
      {
        id: "ricostruzione",
        name: "Ricostruzione unghie",
        price: "€70",
        duration: "2h",
        description: "Struttura completa e forma personalizzata.",
        category: "Mani"
      },
      {
        id: "rimozione-semi",
        name: "Rimozione semipermanente + manicure",
        price: "€30",
        duration: "30m",
        description: "Rimozione delicata e manicure inclusa.",
        category: "Mani"
      },
      {
        id: "rimozione-gel",
        name: "Rimozione gel + manicure",
        price: "€35",
        duration: "30m",
        description: "Rimozione professionale, mani pronte al nuovo trattamento.",
        category: "Mani"
      },
      {
        id: "riparazione-unghia",
        name: "Riparazione unghia",
        price: "€10",
        duration: "15m",
        description: "Riparazione mirata per unghia danneggiata.",
        category: "Mani"
      },
      {
        id: "nailart-french",
        name: "Nail art French",
        price: "€5",
        duration: "15m",
        description: "French preciso, look pulito.",
        category: "Mani"
      },
      {
        id: "nailart-babyboomer",
        name: "Nail art Baby boomer",
        price: "€5",
        duration: "15m",
        description: "Sfumato delicato, effetto elegante.",
        category: "Mani"
      }
    ]
  },
  {
    id: "piedi",
    name: "Piedi",
    description: "Pedicure completo e curativo, anche con semipermanente.",
    services: [
      {
        id: "pedicure-completo",
        name: "Pedicure completo",
        price: "€40",
        duration: "1h",
        description: "Cura completa e benessere, finish ordinato.",
        category: "Piedi",
        featured: true
      },
      {
        id: "semi-piedi",
        name: "Semipermanente piedi",
        price: "€35",
        duration: "1h",
        description: "Colore resistente e uniforme.",
        category: "Piedi"
      },
      {
        id: "pedicure-curativo",
        name: "Pedicure curativo con semipermanente",
        price: "€60",
        duration: "1h30",
        description: "Approccio curativo con rifinitura semipermanente.",
        category: "Piedi"
      },
      {
        id: "rimozione-semi-piedi",
        name: "Rimozione semipermanente piedi",
        price: "€20",
        duration: "20m",
        description: "Rimozione delicata e preparazione dell'unghia.",
        category: "Piedi"
      }
    ]
  },
  {
    id: "ciglia",
    name: "Ciglia & sopracciglia",
    description: "Laminazione per definizione naturale e ordine.",
    services: [
      {
        id: "laminazione-ciglia",
        name: "Laminazione ciglia",
        price: "€70",
        duration: "1h",
        description: "Curva, ordine e lucentezza senza eccessi.",
        category: "Ciglia & sopracciglia",
        featured: true
      },
      {
        id: "laminazione-sopracciglia",
        name: "Laminazione sopracciglia",
        price: "€60",
        duration: "45m",
        description: "Sopracciglia ordinate e definite, effetto naturale.",
        category: "Ciglia & sopracciglia"
      }
    ]
  },
  {
    id: "epilazione",
    name: "Epilazione",
    description: "Cera precisa e veloce, con attenzione alla pelle.",
    services: [
      {
        id: "gambe",
        name: "Gambe",
        price: "€20–25",
        duration: "20–30m",
        description: "Epilazione completa delle gambe.",
        category: "Epilazione"
      },
      {
        id: "gambe-inguine",
        name: "Gambe + inguine",
        price: "€35–45",
        duration: "35–60m",
        description: "Soluzione combinata, tempi ottimizzati.",
        category: "Epilazione",
        featured: true
      },
      {
        id: "inguine",
        name: "Inguine",
        price: "€15–20",
        duration: "15–20m",
        description: "Epilazione precisa nel rispetto della pelle.",
        category: "Epilazione"
      },
      {
        id: "ascelle",
        name: "Ascelle",
        price: "€10",
        duration: "10m",
        description: "Rapida e accurata, ridotto fastidio.",
        category: "Epilazione"
      },
      {
        id: "braccia",
        name: "Braccia",
        price: "€15",
        duration: "20m",
        description: "Pelle liscia e uniforme.",
        category: "Epilazione"
      },
      {
        id: "total-body",
        name: "Total body",
        price: "€80",
        duration: "2h",
        description: "Trattamento completo su misura.",
        category: "Epilazione"
      },
      {
        id: "uomo-corpo",
        name: "Uomo - corpo",
        price: "€25",
        duration: "20m",
        description: "Epilazione corpo maschile, cura e precisione.",
        category: "Epilazione"
      },
      {
        id: "viso-epilazione",
        name: "Viso",
        price: "€5–15",
        duration: "10–20m",
        description: "Delicata e rapida sulle zone del viso.",
        category: "Epilazione"
      }
    ]
  },
  {
    id: "trucco-permanente",
    name: "Trucco permanente",
    description: "Definizione stabile e naturale, su consulenza.",
    services: [
      {
        id: "trucco-permanente",
        name: "Trucco permanente",
        price: "€50–500",
        duration: "45m–2h30",
        description: "Consulenza e definizione personalizzata, con cura del dettaglio.",
        category: "Trucco permanente",
        featured: true
      }
    ]
  }
];

export const featuredServices: Service[] = categories
  .flatMap((c) => c.services)
  .filter((s) => s.featured);
