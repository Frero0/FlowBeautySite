export type Review = {
  author: string;
  body: string;
  rating: number;
};

export const reviews: Review[] = [
  {
    author: "Franca",
    rating: 5,
    body: "Ambiente elegante, professionalità e cura dei dettagli."
  },
  {
    author: "Stefania",
    rating: 5,
    body: "Bravissima e attenta, sia come persona che come professionista."
  },
  {
    author: "Sarah",
    rating: 5,
    body: "Semipermanente perfetto e massima attenzione alle richieste."
  },
  {
    author: "Milena",
    rating: 5,
    body: "Esperienza serena e impeccabile."
  }
];
