import { groq } from '@ai-sdk/groq';

/**
 * Configuration centralisée du modèle et du system prompt.
 * Un seul endroit à modifier si on change de provider, de modèle,
 * ou si on veut ajuster le comportement de l'assistant.
 *
 * Pour changer de provider plus tard (Claude, Gemini...), il suffit de
 * remplacer l'import + la ligne CHAT_MODEL ci-dessous. Le reste du code
 * (route handler, composant chat) ne bouge pas.
 */

// Modèle Groq compatible avec les comptes standard. On choisit ici un nom
// présent dans les limites Groq de l’organisation pour éviter les erreurs
// d’accès au modèle.
export const CHAT_MODEL = groq('openai/gpt-oss-20b');

// System prompt : définit le rôle et le ton de l'assistant.
// Adaptez ce texte à votre capstone (FE1 = qualification, FE2 = audit, FE3 = feature IA).
export const SYSTEM_PROMPT = `Tu es l'assistant IA de [nom de ton produit].
Réponds de façon claire, concise et utile.
Si tu n'es pas sûr d'une information, dis-le plutôt que d'inventer.
Formate tes réponses en Markdown quand c'est pertinent (listes, code, gras).`;

// Paramètres de génération. maxOutputTokens évite les réponses interminables
// (et donc des coûts/temps de streaming imprévisibles).
export const GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 1024,
};