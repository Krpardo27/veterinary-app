import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteServiceAction } from "./service-actions";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth-server";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth-server", () => ({
  requireAdminAction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    service: {
      findFirst: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("deleteServiceAction", () => {
  beforeEach(() => {
    vi.mocked(requireAdminAction).mockReset();
    vi.mocked(prisma.service.findFirst).mockReset();
    vi.mocked(prisma.service.delete).mockReset();

    vi.mocked(requireAdminAction).mockResolvedValue({ error: null });
  });

  it("devuelve error si el servicio no existe", async () => {
    vi.mocked(prisma.service.findFirst).mockResolvedValue(null);

    const result = await deleteServiceAction("id-inexistente");

    expect(result).toEqual({ status: "error", message: "Servicio no encontrado" });
    expect(prisma.service.delete).not.toHaveBeenCalled();
  });

  it("devuelve error si el servicio tiene reservas asociadas", async () => {
    vi.mocked(prisma.service.findFirst).mockResolvedValue({
      id: "srv-1",
      category: { slug: "consulta-general" },
      _count: { reservations: 3 },
    } as never);

    const result = await deleteServiceAction("srv-1");

    expect(result.status).toBe("error");
    expect(result.message).toMatch(/reservas asociadas/);
    expect(prisma.service.delete).not.toHaveBeenCalled();
  });

  it("elimina el servicio cuando no tiene reservas", async () => {
    vi.mocked(prisma.service.findFirst).mockResolvedValue({
      id: "srv-2",
      category: { slug: "vacunacion" },
      _count: { reservations: 0 },
    } as never);
    vi.mocked(prisma.service.delete).mockResolvedValue({} as never);

    const result = await deleteServiceAction("srv-2");

    expect(prisma.service.delete).toHaveBeenCalledWith({ where: { id: "srv-2" } });
    expect(result).toEqual({ status: "success", message: "Servicio eliminado correctamente" });
  });

  it("devuelve error si el usuario no tiene permisos", async () => {
    vi.mocked(requireAdminAction).mockResolvedValue({ error: "Sin permisos" } as never);

    const result = await deleteServiceAction("srv-1");

    expect(result).toEqual({ status: "error", message: "Sin permisos" });
    expect(prisma.service.findFirst).not.toHaveBeenCalled();
  });
});
