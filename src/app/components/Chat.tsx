"use client";

import { useEffect, useRef } from "react";
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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    scrollToBottom();

    const timeout = window.setTimeout(scrollToBottom, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [messages, step]);

  function getPlaceholder() {
    if (step === "registration") {
      return "Exemplo: 12-AB-34";
    }

    if (step === "contact") {
      return "Exemplo: 912345678";
    }

    return "Escreva a sua resposta...";
  }

  const showInput =
    step === "registration" ||
    step === "contact" ||
    step === "name";

  return (
    <section className="chat-card">
      <header className="chat-header">
        <div>
          <h1>Seguros Chat</h1>
          <p>Peça uma simulação de seguro</p>
        </div>

        <span className="online-status">Online</span>
      </header>

      <div className="chat-messages">
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
          aria-hidden="true"
        />
      </div>

      <footer className="chat-footer">
        {showInput && (
          <ChatInput
            placeholder={getPlaceholder()}
            disabled={isSending}
            onSend={sendText}
          />
        )}

        {step === "sending" && (
          <p className="sending-text">A enviar...</p>
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