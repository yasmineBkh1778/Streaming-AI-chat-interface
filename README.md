# Chat en streaming — installation

## 1. Dépendances

```bash
npm install ai @ai-sdk/react @ai-sdk/groq react-markdown remark-gfm
```

## 2. Clé API Groq (gratuite)

1. Créez un compte sur https://console.groq.com (aucune carte bancaire requise)
2. Générez une clé API
3. Créez un fichier `.env.local` à la racine du projet :

```
GROQ_API_KEY=votre_clé_ici
```

Le SDK `@ai-sdk/groq` lit automatiquement cette variable côté serveur.
Elle n'est jamais transmise au navigateur.

## 3. Où placer les fichiers

Copiez l'arborescence telle quelle dans un projet Next.js (App Router) :

```
lib/ai/config.ts              → config modèle + system prompt
app/api/chat/route.ts         → route handler (streamText)
app/chat/page.tsx             → page qui affiche le chat
components/chat/chat-window.tsx        → composant principal (useChat)
components/chat/streaming-markdown.tsx → rendu markdown sécurisé
```

## 4. Lancer

```bash
npm run dev
```

Puis ouvrez `http://localhost:3000/chat`.

## 5. Changer de modèle plus tard

Un seul fichier à toucher : `lib/ai/config.ts`. Exemple pour passer à
Gemini :

```typescript
import { google } from '@ai-sdk/google';
export const CHAT_MODEL = google('gemini-2.5-flash');
```

(nécessite `npm install @ai-sdk/google` et une clé `GOOGLE_GENERATIVE_AI_API_KEY`
dans `.env.local`, obtenue gratuitement sur https://aistudio.google.com)

## Checklist vs. les critères d'évaluation du brief

- [x] Réponses en streaming token par token → `streamText` + `useChat`
- [x] Stop mid-stream sans casser l'état → bouton `stop()`, message partiel conservé
- [x] État de conversation sur plusieurs tours → `useChat` gère l'historique
- [x] Clé API côté serveur uniquement → lue dans `route.ts`, jamais exposée
- [x] Utilisable au format mobile → `100dvh`, `env(safe-area-inset-bottom)`, textarea adaptative
