"use client";

import { FormEvent, useState } from "react";

interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend: (value: string) => void;
}

export default function ChatInput({
  placeholder = "Escreva a sua resposta...",
  disabled = false,
  onSend,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue || disabled) {
      return;
    }

    onSend(trimmedValue);
    setValue("");
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        className="chat-input"
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onChange={(event) => setValue(event.target.value)}
      />

      <button
        className="send-button"
        type="submit"
        disabled={disabled || !value.trim()}
      >
        Enviar
      </button>
    </form>
  );
}