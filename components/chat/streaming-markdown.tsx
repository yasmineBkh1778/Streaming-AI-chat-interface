'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Rendu markdown "streaming-aware".
 *
 * Problème : si on passe le texte brut à ReactMarkdown pendant qu'il
 * arrive token par token, un `**gras` non fermé ou un ``` sans clôture
 * casse visuellement le rendu à chaque frame.
 *
 * Solution : on découpe le texte en blocs (séparés par une ligne vide).
 * Tous les blocs SAUF le dernier sont considérés "terminés" (une ligne
 * vide après un paragraphe = l'IA est passée au suivant) et rendus en
 * Markdown normalement. Le dernier bloc, potentiellement encore en
 * cours d'écriture, est affiché en texte brut le temps qu'il se termine.
 */
export function StreamingMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  const completedBlocks = blocks.slice(0, -1);
  const lastBlock = blocks[blocks.length - 1] ?? '';

  return (
    <div className="streaming-markdown">
      {completedBlocks.map((block, i) => (
        <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
          {block}
        </ReactMarkdown>
      ))}
      {lastBlock.length > 0 && <span className="last-block">{lastBlock}</span>}

      <style jsx>{`
        .streaming-markdown :global(p) {
          margin: 0 0 8px;
        }
        .streaming-markdown :global(p:last-child) {
          margin-bottom: 0;
        }
        .streaming-markdown :global(pre) {
          background: #0d1117;
          color: #e6edf3;
          padding: 10px 12px;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 13px;
        }
        .streaming-markdown :global(code) {
          font-family: ui-monospace, monospace;
          font-size: 13px;
        }
        .last-block {
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}