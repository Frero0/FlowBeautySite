export const GOOGLE_REVIEWS_URL = "https://maps.google.com?q=Flow+Beauty+Estetica";

export type GoogleReview = {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  text: string;
  avatarUrl?: string;
};

export const reviews: GoogleReview[] = [
  {
    id: "rev-01",
    author: "Franca",
    rating: 5,
    timeAgo: "3 settimane fa",
    text: "Centro ricercato con atmosfera rilassante, manicure impeccabili e cortesia autentica."
  },
  {
    id: "rev-02",
    author: "Stefania",
    rating: 5,
    timeAgo: "1 mese fa",
    text: "Sono seguita con pazienza e precisione, ogni trattamento è studiato su misura."
  },
  {
    id: "rev-03",
    author: "Sarah",
    rating: 5,
    timeAgo: "2 mesi fa",
    text: "Semipermanente perfetto per settimane, ambiente pulito e profumato."
  },
  {
    id: "rev-04",
    author: "Milena",
    rating: 5,
    timeAgo: "2 settimane fa",
    text: "Ho provato laminazione ciglia e sopracciglia: risultato naturale e cura nei dettagli."
  },
  {
    id: "rev-05",
    author: "Elena",
    rating: 5,
    timeAgo: "4 settimane fa",
    text: "Professionalità e disponibilità rara, mi sento ascoltata in ogni esigenza."
  },
  {
    id: "rev-06",
    author: "Giulia",
    rating: 5,
    timeAgo: "3 mesi fa",
    text: "Trattamenti viso efficaci e rilassanti, pelle luminosa fin da subito."
  },
  {
    id: "rev-07",
    author: "Carolina",
    rating: 5,
    timeAgo: "5 settimane fa",
    text: "Ambiente curato e discreto, ottimo per concedersi un momento solo per sé."
  },
  {
    id: "rev-08",
    author: "Monica",
    rating: 5,
    timeAgo: "1 settimana fa",
    text: "Servizio impeccabile, massima igiene e attenzione ad ogni dettaglio."
  },
  {
    id: "rev-09",
    author: "Ilaria",
    rating: 5,
    timeAgo: "6 settimane fa",
    text: "Pedicure curativo top, risultati duraturi e consigli personalizzati."
  },
  {
    id: "rev-10",
    author: "Chiara",
    rating: 5,
    timeAgo: "2 mesi fa",
    text: "Laminazione ciglia stupenda, effetto naturale e sguardo definito."
  },
  {
    id: "rev-11",
    author: "Marta",
    rating: 5,
    timeAgo: "1 settimana fa",
    text: "Prenotazione rapida e staff gentile, epilazione veloce e delicata."
  },
  {
    id: "rev-12",
    author: "Nicole",
    rating: 5,
    timeAgo: "3 settimane fa",
    text: "Centro pulito e raffinato, ottimi consigli per mantenere i risultati a casa."
  },
  {
    id: "rev-13",
    author: "Paola",
    rating: 5,
    timeAgo: "4 mesi fa",
    text: "Davvero una coccola: toni caldi, musica soffusa e mani esperte."
  },
  {
    id: "rev-14",
    author: "Serena",
    rating: 5,
    timeAgo: "2 settimane fa",
    text: "Mi fido ciecamente: ogni appuntamento è puntuale e rilassante."
  },
  {
    id: "rev-15",
    author: "Alessia",
    rating: 5,
    timeAgo: "5 giorni fa",
    text: "Manicure impeccabile, prodotti di qualità e attenzione ai protocolli igienici."
  }
];
