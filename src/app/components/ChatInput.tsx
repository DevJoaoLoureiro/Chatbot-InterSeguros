"use client";

import {
  FormEvent,
  useRef,
  useState,
} from "react";

interface ChatInputProps {
  placeholder: string;
  disabled?: boolean;
  inputMode?: "text" | "tel";
  autoComplete?: string;
  onFocus?: () => void;
  onSend: (value: string) => void;
}

export default function ChatInput({
  placeholder,
  disabled = false,
  inputMode = "text",
  autoComplete = "off",
  onFocus,
  onSend,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const inputRef =
    useRef<HTMLInputElement | null>(null);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue || disabled) {
      return;
    }

    onSend(trimmedValue);
    setValue("");

    /*
     * Mantém o input ativo entre perguntas.
     * O timeout espera o React atualizar o estado.
     */
    window.setTimeout(() => {
      inputRef.current?.focus({
        preventScroll: true,
      });

      onFocus?.();
    }, 100);
  }

  function handleFocus() {
    onFocus?.();
  }

  return (
    <form
      className="chat-input-form"
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        className="chat-input"
        type={
          inputMode === "tel"
            ? "tel"
            : "text"
        }
        inputMode={inputMode}
        autoComplete={autoComplete}
        enterKeyHint="send"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={100}
        aria-label={placeholder}
        onFocus={handleFocus}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />

      <button
        className="send-button"
        type="submit"
        disabled={
          disabled ||
          value.trim().length === 0
        }
      >
        Enviar
      </button>
    </form>
  );
}