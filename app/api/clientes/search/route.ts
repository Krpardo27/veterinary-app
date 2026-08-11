import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const chilePhoneRegex = /^\+569\d{8}$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  return false;
}

async function searchCustomer(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(`customers-search:${clientIp}`)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta nuevamente en un minuto." },
      { status: 429 },
    );
  }

  const { searchParams } = req.nextUrl;
  const phoneFromQuery = searchParams.get("phone");
  let phone = phoneFromQuery;

  if (!phone) {
    try {
      const body = await req.json();
      phone = body?.phone ?? null;
    } catch {
      phone = null;
    }
  }

  if (!phone || !chilePhoneRegex.test(phone)) {
    return NextResponse.json({ customer: null });
  }

  const customer = await prisma.customer.findFirst({
    where: { phone },
    select: {
      id: true,
      name: true,
      phone: true,
      pets: {
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, species: true, breed: true },
      },
    },
  });

  return NextResponse.json(
    { customer: customer ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(req: NextRequest) {
  return searchCustomer(req);
}

export async function POST(req: NextRequest) {
  return searchCustomer(req);
}
