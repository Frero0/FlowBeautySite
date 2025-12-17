import { PrismaClient, PriceType } from "@prisma/client";

const prisma = new PrismaClient();

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function main() {
  await prisma.businessSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      timezone: "Europe/Rome",
      leadTimeMin: 120,
      cancelLimitHours: 24,
      defaultBufferMin: 10,
      lunchEnabled: false
    }
  });

  const categories = [
    { name: "Viso", sortOrder: 1 },
    { name: "Mani", sortOrder: 2 },
    { name: "Piedi", sortOrder: 3 },
    { name: "Ciglia & sopracciglia", sortOrder: 4 },
    { name: "Epilazione", sortOrder: 5 },
    { name: "Trucco permanente", sortOrder: 6 }
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: slugify(cat.name) },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: {
        name: cat.name,
        slug: slugify(cat.name),
        sortOrder: cat.sortOrder
      }
    });
  }

  const services = [
    // Viso
    {
      name: "Pulizia viso specifica",
      category: "Viso",
      durationMin: 60,
      priceType: PriceType.FIXED,
      priceFrom: 40,
      isFeatured: false
    },
    {
      name: "Trattamento viso",
      category: "Viso",
      durationMin: 60,
      priceType: PriceType.FIXED,
      priceFrom: 50
    },
    // Mani
    {
      name: "Semipermanente mani rinforzato",
      category: "Mani",
      durationMin: 60,
      priceType: PriceType.FIXED,
      priceFrom: 35,
      isFeatured: true
    },
    {
      name: "Copertura gel unghia naturale",
      category: "Mani",
      durationMin: 75,
      priceType: PriceType.FIXED,
      priceFrom: 40
    },
    {
      name: "Refill gel corte/medie",
      category: "Mani",
      durationMin: 75,
      priceType: PriceType.FIXED,
      priceFrom: 45
    },
    {
      name: "Refill gel lunghe",
      category: "Mani",
      durationMin: 90,
      priceType: PriceType.FIXED,
      priceFrom: 50
    },
    {
      name: "Ricostruzione unghie",
      category: "Mani",
      durationMin: 120,
      priceType: PriceType.FIXED,
      priceFrom: 70
    },
    {
      name: "Rimozione semipermanente + manicure",
      category: "Mani",
      durationMin: 30,
      priceType: PriceType.FIXED,
      priceFrom: 30
    },
    {
      name: "Rimozione gel + manicure",
      category: "Mani",
      durationMin: 30,
      priceType: PriceType.FIXED,
      priceFrom: 35
    },
    {
      name: "Riparazione unghia",
      category: "Mani",
      durationMin: 15,
      priceType: PriceType.FIXED,
      priceFrom: 10
    },
    {
      name: "Nail art French",
      category: "Mani",
      durationMin: 15,
      priceType: PriceType.FIXED,
      priceFrom: 5
    },
    {
      name: "Nail art Baby boomer",
      category: "Mani",
      durationMin: 15,
      priceType: PriceType.FIXED,
      priceFrom: 5
    },
    // Piedi
    {
      name: "Pedicure completo",
      category: "Piedi",
      durationMin: 60,
      priceType: PriceType.FIXED,
      priceFrom: 40,
      isFeatured: true
    },
    {
      name: "Semipermanente piedi",
      category: "Piedi",
      durationMin: 60,
      priceType: PriceType.FIXED,
      priceFrom: 35
    },
    {
      name: "Pedicure curativo con semipermanente",
      category: "Piedi",
      durationMin: 90,
      priceType: PriceType.FIXED,
      priceFrom: 60
    },
    {
      name: "Rimozione semipermanente piedi",
      category: "Piedi",
      durationMin: 20,
      priceType: PriceType.FIXED,
      priceFrom: 20
    },
    // Ciglia e sopracciglia
    {
      name: "Laminazione ciglia",
      category: "Ciglia & sopracciglia",
      durationMin: 60,
      priceType: PriceType.FIXED,
      priceFrom: 70,
      isFeatured: true
    },
    {
      name: "Laminazione sopracciglia",
      category: "Ciglia & sopracciglia",
      durationMin: 45,
      priceType: PriceType.FIXED,
      priceFrom: 60
    },
    // Epilazione
    {
      name: "Epilazione gambe",
      category: "Epilazione",
      durationMin: 30,
      priceType: PriceType.RANGE,
      priceFrom: 20,
      priceTo: 25
    },
    {
      name: "Epilazione gambe + inguine",
      category: "Epilazione",
      durationMin: 60,
      priceType: PriceType.RANGE,
      priceFrom: 35,
      priceTo: 45,
      isFeatured: true
    },
    {
      name: "Epilazione inguine",
      category: "Epilazione",
      durationMin: 20,
      priceType: PriceType.RANGE,
      priceFrom: 15,
      priceTo: 20
    },
    {
      name: "Epilazione ascelle",
      category: "Epilazione",
      durationMin: 10,
      priceType: PriceType.FIXED,
      priceFrom: 10
    },
    {
      name: "Epilazione braccia",
      category: "Epilazione",
      durationMin: 20,
      priceType: PriceType.FIXED,
      priceFrom: 15
    },
    {
      name: "Epilazione total body",
      category: "Epilazione",
      durationMin: 120,
      priceType: PriceType.FIXED,
      priceFrom: 80
    },
    {
      name: "Epilazione uomo corpo",
      category: "Epilazione",
      durationMin: 20,
      priceType: PriceType.FIXED,
      priceFrom: 25
    },
    {
      name: "Epilazione viso",
      category: "Epilazione",
      durationMin: 20,
      priceType: PriceType.RANGE,
      priceFrom: 5,
      priceTo: 15
    },
    // Trucco permanente
    {
      name: "Trucco permanente",
      category: "Trucco permanente",
      durationMin: 150,
      priceType: PriceType.RANGE,
      priceFrom: 50,
      priceTo: 500,
      isFeatured: true
    }
  ];

  for (const svc of services) {
    const category = await prisma.serviceCategory.findUnique({
      where: { slug: slugify(svc.category) }
    });
    if (!category) continue;

    await prisma.service.upsert({
      where: { slug: slugify(svc.name) },
      update: {
        name: svc.name,
        description: svc.name,
        durationMin: svc.durationMin,
        priceType: svc.priceType,
        priceFrom: svc.priceFrom,
        priceTo: svc.priceTo ?? null,
        isFeatured: svc.isFeatured ?? false,
        isActive: true,
        bufferMin: 10,
        categoryId: category.id
      },
      create: {
        name: svc.name,
        slug: slugify(svc.name),
        description: svc.name,
        durationMin: svc.durationMin,
        priceType: svc.priceType,
        priceFrom: svc.priceFrom,
        priceTo: svc.priceTo ?? null,
        isFeatured: svc.isFeatured ?? false,
        isActive: true,
        bufferMin: 10,
        categoryId: category.id
      }
    });
  }

  await prisma.staffMember.upsert({
    where: { name: "Mara" },
    update: { isActive: true },
    create: { name: "Mara", isActive: true }
  });

  const week = [
    { dayOfWeek: 0, isClosed: true },
    { dayOfWeek: 1, isClosed: true },
    { dayOfWeek: 2, openTime: "09:00", closeTime: "19:00" },
    { dayOfWeek: 3, openTime: "09:00", closeTime: "19:00" },
    { dayOfWeek: 4, openTime: "09:00", closeTime: "19:00" },
    { dayOfWeek: 5, openTime: "09:00", closeTime: "19:00" },
    { dayOfWeek: 6, openTime: "09:00", closeTime: "13:00" }
  ];

  for (const day of week) {
    await prisma.weeklySchedule.upsert({
      where: { dayOfWeek: day.dayOfWeek },
      update: {
        openTime: day.openTime ?? null,
        closeTime: day.closeTime ?? null,
        isClosed: day.isClosed ?? false,
        lunchStart: null,
        lunchEnd: null
      },
      create: {
        dayOfWeek: day.dayOfWeek,
        openTime: day.openTime ?? null,
        closeTime: day.closeTime ?? null,
        isClosed: day.isClosed ?? false
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
