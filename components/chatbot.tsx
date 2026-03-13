"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { GrayscalePreview } from "@/components/grayscale-preview";
import { extractGrayscaleValue } from "@/lib/color-utils";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  grayscaleValue?: number;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  function handleSend(input: string) {
    const cleaned = input.replace(/[^0-9]/g, "");

    if (!cleaned) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        type: "bot",
        content: "Please enter a valid number.",
        grayscaleValue: 50,
      };
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), type: "user", content: input },
        errorMsg,
      ]);
      return;
    }

    const value = extractGrayscaleValue(cleaned);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content: input,
    };

    const botMsg: Message = {
      id: crypto.randomUUID(),
      type: "bot",
      content: cleaned,
      grayscaleValue: value,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);

    // Announce to screen readers
    if (liveRef.current) {
      liveRef.current.textContent = `Acknowledged number ${cleaned}. Shade: ${value} percent darkness.`;
    }
  }

  return (
    <div className="mx-auto flex h-dvh max-w-lg flex-col bg-card">
      {/* Header */}
      <header className="flex flex-col border-b border-border bg-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-primary-foreground" aria-hidden="true">
              GS
            </span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              Grayscale Bot
            </h1>
            <p className="text-xs text-muted-foreground">
              Type a number (0-100) to see its shade
            </p>
          </div>
        </div>
        <GrayscalePreview />
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        role="list"
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <span className="text-2xl text-muted-foreground font-semibold" aria-hidden="true">
                #
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Enter any number
              </p>
              <p className="mt-1 max-w-[250px] text-xs leading-relaxed text-muted-foreground">
                The last two digits set the shade. 00 is white, 50 is gray, and 100 is black. Numbers 0-100 map directly.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              type={msg.type}
              content={msg.content}
              grayscaleValue={msg.grayscaleValue}
            />
          ))}
        </div>
      </div>

      {/* Live region for screen readers */}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
