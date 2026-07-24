import { NextResponse } from "next/server";
import { sendLeadEmail } from "@/src/lib/email";
import {
  isValidPhone,
  isValidRegistration,
  normalizeName,
  normalizePhone,
  normalizeRegistration,
} from "@/src/lib/validation";
import {
  insuranceOptions,
  type ApiResponse,
  type InsuranceType,
  type LeadRequest,
} from "@/src/types/chat";

import { leadRateLimit } from "@/src/lib/rate-limit";

export const runtime = "nodejs";

function isInsuranceType(value: unknown): value is InsuranceType {
  return (
    typeof value === "string" &&
    insuranceOptions.includes(value as InsuranceType)
  );
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rateLimitResult = await leadRateLimit.limit(ip);

  if (!rateLimitResult.success) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message:
          "Foram enviados demasiados pedidos. Tente novamente dentro de alguns minutos.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit":
            rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining":
            rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset":
            rateLimitResult.reset.toString(),
        },
      },
    );
  }

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Os dados enviados são inválidos.",
        },
        { status: 400 },
      );
    }

    const {
      insuranceType,
      registration,
      contact,
      name,
      website,
    } = body as Record<string, unknown>;

    // Honeypot: utilizadores reais deixam este campo vazio.
    if (
      typeof website === "string" &&
      website.trim() !== ""
    ) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "O pedido foi recebido.",
      });
    }

    if (!isInsuranceType(insuranceType)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "O tipo de seguro é inválido.",
        },
        { status: 400 },
      );
    }

    if (
      typeof name !== "string" ||
      name.trim().length < 3 ||
      name.trim().length > 100
    ) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "O nome é inválido.",
        },
        { status: 400 },
      );
    }

    if (
      typeof contact !== "string" ||
      contact.length > 30 ||
      !isValidPhone(contact)
    ) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "O contacto telefónico é inválido.",
        },
        { status: 400 },
      );
    }

    if (
      insuranceType === "Automóvel" &&
      (
        typeof registration !== "string" ||
        !isValidRegistration(registration)
      )
    ) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "A matrícula da viatura é inválida.",
        },
        { status: 400 },
      );
    }

    const lead: LeadRequest = {
      insuranceType,
      name: normalizeName(name),
      contact: normalizePhone(contact),
    };

    if (
      insuranceType === "Automóvel" &&
      typeof registration === "string"
    ) {
      lead.registration =
        normalizeRegistration(registration);
    }

    await sendLeadEmail(lead);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "O pedido foi enviado para um agente.",
    });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message:
          "Não foi possível enviar o pedido. Tente novamente mais tarde.",
      },
      { status: 500 },
    );
  }
}