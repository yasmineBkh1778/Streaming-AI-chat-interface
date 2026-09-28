# Streaming AI Chat Interface

Un projet Next.js qui affiche un chat IA en streaming avec Groq, en utilisant l’API `@ai-sdk/react` et `streamText`.

## Prérequis

Avant de commencer, vérifie que tu as installé :

- Node.js 18+
- npm ou pnpm ou yarn
- un compte Groq avec une clé API active

## 1. Cloner le projet

```bash
git clone https://github.com/yasmineBkh1778/Streaming-AI-chat-interface

```

## 2. Installer les dépendances

```bash
npm install
```

## 3. Créer le fichier d’environnement

Crée un fichier `.env.local` à la racine du projet :

```bash
GROQ_API_KEY=votre_cle_api_groq
```

Important :
- cette clé est lue côté serveur uniquement
- elle ne doit jamais être exposée dans le navigateur

## 4. Lancer le projet localement

```bash
npm run dev
```

Ouvre ensuite :

```text
http://localhost:3000/chat
```

## 5. Structure du projet

```text
streaming-chat-capstone/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── chat/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── chat/
│       ├── chat-window.tsx
│       └── streaming-markdown.tsx
├── lib/
│   └── ai/
│       └── config.ts
├── .env.local
├── package.json
├── next.config.ts
├── tsconfig.json
├── README.md
└── ...
```

## 6. Changer le modèle Groq

Le modèle utilisé est défini dans :

```ts
lib/ai/config.ts
```

Exemple :

```ts
export const CHAT_MODEL = groq('openai/gpt-oss-20b');
```

Tu peux remplacer le nom du modèle par un autre modèle autorisé par ton compte Groq.


## 7. Fonctionnalités

- Streaming de réponses en temps réel
- affichage Markdown dans le chat
- bouton Stop pour interrompre la génération
- interface responsive mobile
- gestion de l’historique de conversation

## 8 Bonnes pratiques

- ne jamais committer le fichier `.env.local`
- vérifier les limites de modèle sur la console Groq
- utiliser un modèle disponible pour ton organisation

## 9. Checklist du projet

- [x] Chat streaming token par token
- [x] API côté serveur uniquement
- [x] Gestion de la conversation
- [x] Support Markdown
- [x] Interface responsive
- [x] Compatible avec Vercel
