import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { CHAT_MODEL, SYSTEM_PROMPT, GENERATION_CONFIG } from '@/lib/ai/config';

// Route dynamique, jamais mise en cache : chaque conversation est unique.
export const dynamic = 'force-dynamic';

/**
 * Reçoit l'historique de conversation envoyé par useChat côté client,
 * appelle le modèle via streamText, et renvoie un flux de réponse au
 * format attendu par useChat (Server-Sent Events).
 *
 * SÉCURITÉ : la clé API (GROQ_API_KEY, définie dans .env.local) est lue
 * automatiquement par le SDK côté serveur uniquement. Elle n'est jamais
 * envoyée au navigateur — c'est ce fichier qui parle au provider, pas
 * le client.
 */
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: CHAT_MODEL,
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    ...GENERATION_CONFIG,
  });

  // toUIMessageStreamResponse() gère nativement l'annulation : quand le
  // client appelle stop(), le fetch est abandonné (AbortController) et
  // streamText interrompt l'appel au modèle côté serveur.
  return result.toUIMessageStreamResponse();
}