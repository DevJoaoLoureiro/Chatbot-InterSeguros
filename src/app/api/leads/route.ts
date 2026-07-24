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

function isInsuranceType(value: unknown): value is InsuranceType {
  return (
    typeof value === "string" &&
    insuranceOptions.includes(value as InsuranceType)
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Os dados enviados são inválidos.",
        },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const insuranceType = data.insuranceType;
    const registration = data.registration;
    const contact = data.contact;
    const name = data.name;

    if (!isInsuranceType(insuranceType)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "O tipo de seguro é inválido.",
        },
        { status: 400 },
      );
    }

    if (typeof name !== "string" || name.trim().length < 3) {
  return Response.json(
    {
      success: false,
      message: "O nome é inválido.",
    },
    { status: 400 },
  );
}

    if (typeof contact !== "string" || !isValidPhone(contact)) {
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
      (typeof registration !== "string" ||
        !isValidRegistration(registration))
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
      contact: normalizePhone(contact),
     name: normalizeName(name),
    };

    if (
      insuranceType === "Automóvel" &&
      typeof registration === "string"
    ) {
      lead.registration = normalizeRegistration(registration);
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