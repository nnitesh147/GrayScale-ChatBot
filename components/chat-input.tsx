"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  const isValid = value.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
      role="form"
      aria-label="Send a number"
    >
      <label htmlFor="chat-input" className="sr-only">
        Type a number
      </label>
      <input
        ref={inputRef}
        id="chat-input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type any number..."
        disabled={disabled}
        autoComplete="off"
        className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        aria-describedby="input-hint"
      />
      <p id="input-hint" className="sr-only">
        Enter a number. The last two digits determine the grayscale shade: 00
        is white, 50 is gray, 100 is black.
      </p>
      <button
        type="submit"
        disabled={disabled || !isValid}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Send number"
      >
        <SendHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
