"use client";

import { useState } from "react";
import {
  isValidPhone,
  isValidRegistration,
  normalizePhone,
  normalizeRegistration,
} from "@/src/lib/validation";
import type {
  ApiResponse,
  ChatMessage,
  ChatStep,
  InsuranceType,
  LeadData,
} from "@/src/types/chat";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome-message",
    sender: "bot",
    text: "Olá! Que seguro necessita?",
  },
];

const initialLead: LeadData = {
  insuranceType: "",
  registration: "",
  contact: "",
  name: "",
};

function createMessage(
  sender: ChatMessage["sender"],
  text: string,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    sender,
    text,
  };
}

export function useChat() {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [step, setStep] = useState<ChatStep>("insurance");
  const [lead, setLead] = useState<LeadData>(initialLead);
  const [isSending, setIsSending] = useState(false);

  function addMessage(
    sender: ChatMessage["sender"],
    text: string,
  ) {
    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage(sender, text),
    ]);
  }

  function selectInsurance(insuranceType: InsuranceType) {
  if (step !== "insurance") {
    return;
  }

  setLead((currentLead) => ({
    ...currentLead,
    insuranceType,
  }));

  addMessage("user", insuranceType);

  if (insuranceType === "Automóvel") {
    setStep("registration");

    window.setTimeout(() => {
      addMessage(
        "bot",
        "Digite a matrícula da viatura. Exemplo: 12-AB-34.",
      );
    }, 300);

    return;
  }

  setStep("name");

  window.setTimeout(() => {
    addMessage(
      "bot",
      "Digite o seu nome completo.",
    );
  }, 300);
}

  async function sendLead(data: LeadData) {
    if (!data.insuranceType) {
      return;
    }

    setStep("sending");
    setIsSending(true);

    addMessage(
      "bot",
      "Estamos a enviar o seu pedido para um agente...",
    );

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        insuranceType: data.insuranceType,
        registration:
          data.insuranceType === "Automóvel"
            ? data.registration
            : undefined,
        name: data.name,
        contact: data.contact,
        website: data.website,
      }),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Não foi possível enviar o pedido.",
        );
      }

      addMessage(
        "bot",
        "Obrigado! O seu pedido foi enviado para um agente. Será contactado brevemente.",
      );

      setStep("finished");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado.";

      addMessage("bot", message);
      addMessage(
        "bot",
        "Pode tentar enviar novamente o seu contacto.",
      );

      setStep("contact");
    } finally {
      setIsSending(false);
    }
  }

  function sendText(value: string) {

     const trimmedValue = value.trim();

      if(!trimmedValue){
        return;
      }

    if (step === "registration") {
      const normalizedRegistration =
        normalizeRegistration(value);

      addMessage("user", normalizedRegistration);

      if (!isValidRegistration(normalizedRegistration)) {
        window.setTimeout(() => {
          addMessage(
            "bot",
            "A matrícula parece inválida. Utilize um formato como 12-AB-34.",
          );
        }, 300);

        return;
      }

      setLead((currentLead) => ({
        ...currentLead,
        registration: normalizedRegistration,
      }));




    setStep("name");

    window.setTimeout(() => {
      addMessage(
        "bot",
        "Digite o seu nome completo.",
      );
    }, 300);

    return;
  }

  // Nome
  if (step === "name") {
    addMessage("user", trimmedValue);

    setLead((currentLead) => ({
      ...currentLead,
      name: trimmedValue,
    }));


      setStep("contact");

      window.setTimeout(() => {
        addMessage(
          "bot",
          "Digite o seu contacto telefónico.",
        );
      }, 300);

      return;
    }

    if (step === "contact") {
      const normalizedContact = normalizePhone(value);

      addMessage("user", normalizedContact);

      if (!isValidPhone(normalizedContact)) {
        window.setTimeout(() => {
          addMessage(
            "bot",
            "O contacto parece inválido. Digite um número português válido.",
          );
        }, 300);

        return;
      }

      const updatedLead: LeadData = {
        ...lead,
        contact: normalizedContact,
      };

      setLead(updatedLead);
      void sendLead(updatedLead);
    }
  }

  function restartChat() {
    setMessages(initialMessages);
    setLead(initialLead);
    setStep("insurance");
    setIsSending(false);
  }

  return {
    messages,
    step,
    isSending,
    selectInsurance,
    sendText,
    restartChat,
  };
}