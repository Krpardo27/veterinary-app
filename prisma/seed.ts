import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories } from "./data/categories";
import { services } from "./data/services";
import { vets } from "./data/veterinarians";
import { customers } from "./data/customers";
import { buildVeterinarianServices } from "./data/veterinarian-services";
import { buildReservations } from "./data/reservation";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  console.log("🌱 Creando cliente de prueba...");

  const createdCustomers = [];

  for (const customer of customers) {
    const created = await prisma.customer.upsert({
      where: {
        phone: customer.phone,
      },
      update: customer,
      create: customer,
    });

    createdCustomers.push(created);
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {},
      create: category,
    });
  }

  const createdCategories = await prisma.category.findMany({
    where: {
      slug: {
        in: categories.map((category) => category.slug),
      },
    },
  });

  const categoryIdsBySlug = new Map(
    createdCategories.map((category) => [category.slug, category.id]),
  );

  for (const serviceData of services) {
    const categoryId = categoryIdsBySlug.get(serviceData.categorySlug);

    if (!categoryId) {
      throw new Error(
        `No existe la categoría para el servicio ${serviceData.slug}`,
      );
    }

    await prisma.service.upsert({
      where: {
        slug: serviceData.slug,
      },
      update: {},
      create: {
        name: serviceData.name,
        slug: serviceData.slug,
        price: serviceData.price,
        durationMin: serviceData.durationMin,
        categoryId,
      },
    });
  }

  for (const vet of vets) {
    const existingVeterinarian = await prisma.veterinarian.findFirst({
      where: {
        OR: [{ email: vet.email }, { phone: vet.phone }],
      },
    });

    if (existingVeterinarian) {
      await prisma.veterinarian.update({
        where: { id: existingVeterinarian.id },
        data: {
          name: vet.name,
          phone: vet.phone,
          email: vet.email,
          bio: vet.bio,
        },
      });
      continue;
    }

    await prisma.veterinarian.create({
      data: vet,
    });
  }

  const veterinarians = await prisma.veterinarian.findMany({
    where: {
      isActive: true,
    },
  });

  const allServices = await prisma.service.findMany({
    where: {
      isActive: true,
    },
  });

  const vetServicePairs = buildVeterinarianServices(veterinarians, allServices);

  for (const pair of vetServicePairs) {
    await prisma.veterinarianService.upsert({
      where: {
        veterinarianId_serviceId: {
          veterinarianId: pair.veterinarianId,
          serviceId: pair.serviceId,
        },
      },
      update: {},
      create: pair,
    });
  }

  const reservations = buildReservations(
    createdCustomers,
    veterinarians,
    allServices,
  );

  for (const reservation of reservations) {
    await prisma.reservation.create({ data: reservation });
  }

  console.log("✅ Reserva creada");
  console.log("🎉 Seed finalizado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
