import {
  PrismaClient,
  ReservationStatus,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories } from "./data/categories";
import { services } from "./data/services";
import { vets } from "./data/veterinarians";
import { customers } from "./data/customers";

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

  for (const veterinarian of veterinarians) {
    for (const service of allServices) {
      await prisma.veterinarianService.upsert({
        where: {
          veterinarianId_serviceId: {
            veterinarianId: veterinarian.id,
            serviceId: service.id,
          },
        },
        update: {},
        create: {
          veterinarianId: veterinarian.id,
          serviceId: service.id,
        },
      });
    }
  }

  const service = await prisma.service.findFirst({
    where: {
      isActive: true,
    },
  });

  const veterinarian = await prisma.veterinarian.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!service || !veterinarian) {
    throw new Error(
      "No se pudieron crear los servicios o veterinarios necesarios para la reserva.",
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const end = new Date(tomorrow);
  end.setMinutes(end.getMinutes() + service.durationMin);

  for (let i = 0; i < createdCustomers.length; i++) {
    const customer = createdCustomers[i];

    if (i % 3 === 0) continue;

    const service = allServices[Math.floor(Math.random() * allServices.length)];

    const veterinarian =
      veterinarians[Math.floor(Math.random() * veterinarians.length)];

    const start = new Date();

    start.setDate(start.getDate() + Math.floor(Math.random() * 20));

    start.setHours(9 + Math.floor(Math.random() * 9), 0, 0, 0);

    const end = new Date(start);

    end.setMinutes(end.getMinutes() + service.durationMin);

    await prisma.reservation.create({
      data: {
        customerId: customer.id,

        veterinarianId: veterinarian.id,

        serviceId: service.id,

        serviceName: service.name,

        servicePrice: service.price,

        durationMin: service.durationMin,

        startAt: start,

        endAt: end,

        status: ReservationStatus.CONFIRMED,
      },
    });
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
