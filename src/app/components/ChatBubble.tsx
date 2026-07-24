import type { ChatMessage } from "@/src/types/chat";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isBot = message.sender === "bot";

  return (
    <div
      className={`message-row ${
        isBot ? "message-row-bot" : "message-row-user"
      }`}
    >
      <div
        className={`message-bubble ${
          isBot ? "message-bubble-bot" : "message-bubble-user"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}