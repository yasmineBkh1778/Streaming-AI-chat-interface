'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { StreamingMarkdown } from './streaming-markdown';

export function ChatWindow() {
  const { messages, sendMessage, status, stop } = useChat();

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  // 'submitted' = requête envoyée, en attente du 1er token (indicateur de réflexion)
  // 'streaming' = tokens en train d'arriver
  const isStreaming = status === 'submitted' || status === 'streaming';

  // --- Auto-scroll qui respecte le scroll manuel de l'utilisateur ---
  // On ne force le scroll vers le bas QUE si l'utilisateur était déjà en
  // bas. Dès qu'il remonte pour relire un message, on relâche le pin :
  // les nouveaux tokens n'interrompent plus sa lecture.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isPinnedToBottom) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, isPinnedToBottom]);

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    // Tolérance de 80px : on considère l'utilisateur "en bas" même s'il
    // n'est pas exactement au pixel près.
    setIsPinnedToBottom(distanceFromBottom < 80);
  }

  function scrollToBottom() {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
    setIsPinnedToBottom(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput('');
    setIsPinnedToBottom(true);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="chat-root">
      <div className="chat-messages" ref={scrollRef} onScroll={handleScroll}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble ${
              message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
            }`}
          >
            {message.parts.map((part, i) =>
              part.type === 'text' ? <StreamingMarkdown key={i} text={part.text} /> : null,
            )}
          </div>
        ))}

        {/* Indicateur de réflexion : affiché tant que la requête est
            envoyée mais qu'aucun token n'est encore arrivé. Il disparaît
            au profit du texte streamé dès que status passe à 'streaming',
            sans jamais laisser un frame "vide" entre les deux. */}
        {status === 'submitted' && (
          <div className="chat-bubble chat-bubble-assistant chat-thinking" aria-label="L'assistant réfléchit">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
      </div>

      {!isPinnedToBottom && (
        <button className="jump-to-latest" onClick={scrollToBottom} type="button">
          ↓ Revenir en bas
        </button>
      )}

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écris ton message..."
          rows={1}
          disabled={isStreaming}
        />

        {isStreaming ? (
          // Le stop button coupe le flux côté client SANS effacer le texte
          // déjà reçu : le message partiel reste affiché tel quel, et
          // l'input se réactive immédiatement pour permettre un nouvel envoi.
          <button type="button" className="btn-stop" onClick={stop}>
            Stop
          </button>
        ) : (
          <button type="submit" className="btn-send" disabled={!input.trim()}>
            Envoyer
          </button>
        )}
      </form>

      <style jsx>{`
        .chat-root {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          max-width: 720px;
          margin: 0 auto;
          padding: 0 12px;
          box-sizing: border-box;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 4px;
        }
        .chat-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 14px;
          line-height: 1.5;
          font-size: 15px;
          word-wrap: break-word;
        }
        .chat-bubble-user {
          align-self: flex-end;
          background: #2563eb;
          color: white;
          border-bottom-right-radius: 4px;
        }
        .chat-bubble-assistant {
          align-self: flex-start;
          background: #f1f1f1;
          color: #1a1a1a;
          border-bottom-left-radius: 4px;
        }
        .chat-thinking {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 14px 16px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #999;
          animation: blink 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }
        .jump-to-latest {
          align-self: center;
          margin-bottom: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid #ddd;
          background: white;
          font-size: 13px;
          cursor: pointer;
        }
        .chat-input-row {
          display: flex;
          gap: 8px;
          padding: 12px 4px calc(12px + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid #eee;
        }
        .chat-input-row textarea {
          flex: 1;
          resize: none;
          border-radius: 10px;
          border: 1px solid #ddd;
          padding: 10px 12px;
          font-size: 15px;
          font-family: inherit;
          max-height: 120px;
        }
        .btn-send,
        .btn-stop {
          border: none;
          border-radius: 10px;
          padding: 0 18px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-send {
          background: #2563eb;
          color: white;
        }
        .btn-send:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }
        .btn-stop {
          background: #ef4444;
          color: white;
        }
        @media (max-width: 480px) {
          .chat-bubble {
            max-width: 92%;
          }
        }
      `}</style>
    </div>
  );
}