"use client";

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isTextUIPart, UIMessage } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, User, Bot, AlertCircle } from 'lucide-react';
import styles from './ChatAgent.module.css';

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    parts: [{ type: 'text', text: "Hi! I'm Vladyslav's AI Assistant. You can ask me anything about his experience, or use one of the suggestions below." }],
  },
];

const SUGGESTIONS = [
  "What's his biggest technical achievement?",
  "Has he led engineering teams?",
  "What automation has he shipped?",
];

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    document.addEventListener('open-chat', handler);
    return () => document.removeEventListener('open-chat', handler);
  }, []);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: INITIAL_MESSAGES,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <>
      {!isOpen && (
        <button
          className={styles.fab}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          <MessageCircle size={24} />
          <span className={styles.fabText}>Ask about my work</span>
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <Bot size={20} className={styles.headerIcon} />
              <span className={styles.headerTitle}>AI Career Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map(m => {
              const text = m.parts.filter(isTextUIPart).map(p => p.text).join('');
              return (
                <div key={m.id} className={`${styles.messageWrapper} ${m.role === 'user' ? styles.userWrapper : styles.botWrapper}`}>
                  <div className={styles.avatar}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`${styles.messageBubble} ${m.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                    {text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
                <div className={styles.avatar}><Bot size={16} /></div>
                <div className={`${styles.messageBubble} ${styles.botBubble}`}>
                  <span className={styles.typingDot}>.</span>
                  <span className={styles.typingDot}>.</span>
                  <span className={styles.typingDot}>.</span>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorBanner}>
                <AlertCircle size={16} />
                <span>
                  {error.message.includes('503')
                    ? "The API key hasn't been added yet! I'll be fully functional once it's configured."
                    : "Something went wrong communicating with the AI."}
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && !isLoading && (
            <div className={styles.suggestionsContainer}>
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  className={styles.suggestionChip}
                  onClick={() => sendMessage({ text: suggestion })}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            className={styles.inputForm}
          >
            <input
              className={styles.inputField}
              value={input}
              placeholder="Ask about Vladyslav's experience..."
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendButton} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
