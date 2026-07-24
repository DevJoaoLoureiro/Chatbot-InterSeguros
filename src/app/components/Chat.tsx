"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import ChatBubble from "@/src/app/components/ChatBubble";
import ChatInput from "@/src/app/components/ChatInput";
import InsuranceOptions from "@/src/app/components/InsuranceOptions";
import { useChat } from "@/src/hooks/useChat";

export default function Chat() {
  const {
    messages,
    step,
    isSending,
    selectInsurance,
    sendText,
    restartChat,
  } = useChat();

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = messagesContainerRef.current;

      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior,
        });

        return;
      }

      messagesEndRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    },
    [],
  );

  /*
   * No Safari do iPhone, 100vh e 100dvh nem sempre
   * acompanham corretamente a abertura do teclado.
   *
   * O VisualViewport representa a área que está
   * realmente visível.
   */
  useEffect(() => {
    const updateViewport = () => {
      const viewport = window.visualViewport;

      const viewportHeight =
        viewport?.height ?? window.innerHeight;

      const viewportOffsetTop =
        viewport?.offsetTop ?? 0;

      document.documentElement.style.setProperty(
        "--app-height",
        `${viewportHeight}px`,
      );

      document.documentElement.style.setProperty(
        "--viewport-offset-top",
        `${viewportOffsetTop}px`,
      );
    };

    updateViewport();

    window.addEventListener(
      "resize",
      updateViewport,
    );

    window.addEventListener(
      "orientationchange",
      updateViewport,
    );

    window.visualViewport?.addEventListener(
      "resize",
      updateViewport,
    );

    window.visualViewport?.addEventListener(
      "scroll",
      updateViewport,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateViewport,
      );

      window.removeEventListener(
        "orientationchange",
        updateViewport,
      );

      window.visualViewport?.removeEventListener(
        "resize",
        updateViewport,
      );

      window.visualViewport?.removeEventListener(
        "scroll",
        updateViewport,
      );

      document.documentElement.style.removeProperty(
        "--app-height",
      );

      document.documentElement.style.removeProperty(
        "--viewport-offset-top",
      );
    };
  }, []);

  /*
   * Faz scroll quando aparece uma nova mensagem
   * ou quando muda a etapa do chat.
   */
  useEffect(() => {
    scrollToBottom("smooth");

    const firstTimeout = window.setTimeout(() => {
      scrollToBottom("smooth");
    }, 150);

    const secondTimeout = window.setTimeout(() => {
      scrollToBottom("auto");
    }, 450);

    return () => {
      window.clearTimeout(firstTimeout);
      window.clearTimeout(secondTimeout);
    };
  }, [messages, step, scrollToBottom]);

  /*
   * Executado quando o input recebe foco.
   * Espera o teclado abrir e volta a posicionar
   * a conversa no fim.
   */
  const handleInputFocus = useCallback(() => {
    const firstTimeout = window.setTimeout(() => {
      scrollToBottom("smooth");
    }, 150);

    const secondTimeout = window.setTimeout(() => {
      scrollToBottom("auto");
    }, 450);

    return () => {
      window.clearTimeout(firstTimeout);
      window.clearTimeout(secondTimeout);
    };
  }, [scrollToBottom]);

  function getPlaceholder(): string {
    if (step === "registration") {
      return "Exemplo: 12-AB-34";
    }

    if (step === "name") {
      return "Digite o seu nome completo";
    }

    if (step === "contact") {
      return "Exemplo: 912345678";
    }

    return "Escreva a sua resposta...";
  }

  function getInputMode():
    | "text"
    | "tel" {
    if (step === "contact") {
      return "tel";
    }

    return "text";
  }

  function getAutoComplete(): string {
    if (step === "name") {
      return "name";
    }

    if (step === "contact") {
      return "tel";
    }

    return "off";
  }

  const showInput =
    step === "registration" ||
    step === "name" ||
    step === "contact";

  return (
    <section className="chat-card">
      <header className="chat-header">
        <div className="chat-header-content">
          <h1>Seguros Chat</h1>
          <p>Peça uma simulação de seguro</p>
        </div>

        <span className="online-status">
          Online
        </span>
      </header>

      <div
        ref={messagesContainerRef}
        className="chat-messages"
        aria-live="polite"
        aria-label="Conversa"
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
          />
        ))}

        {step === "insurance" && (
          <InsuranceOptions
            disabled={isSending}
            onSelect={selectInsurance}
          />
        )}

        <div
          ref={messagesEndRef}
          className="messages-end"
          aria-hidden="true"
        />
      </div>

      <footer className="chat-footer">
        {showInput && (
          <ChatInput
            key={step}
            placeholder={getPlaceholder()}
            disabled={isSending}
            inputMode={getInputMode()}
            autoComplete={getAutoComplete()}
            onFocus={handleInputFocus}
            onSend={sendText}
          />
        )}

        {step === "sending" && (
          <p
            className="sending-text"
            role="status"
          >
            A enviar...
          </p>
        )}

        {step === "finished" && (
          <button
            className="restart-button"
            type="button"
            onClick={restartChat}
          >
            Fazer novo pedido
          </button>
        )}
      </footer>
    </section>
  );
}