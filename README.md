# 📚 BIBLIOTECH

Gerenciador de leituras pessoal com integração com a API do Google Books.

## Funcionalidades

- 📖 Organize livros por status: *Lendo*, *Já li*, *Quero ler*
- 🔍 Busca automática de capa, autor e gênero via Google Books
- ⭐ Sistema de avaliação por estrelas
- 💾 Dados salvos no localStorage (sem backend necessário)
- 🎨 Interface moderna com Tailwind CSS

## Tecnologias

- React 18
- Vite
- Tailwind CSS
- Google Books API

## Como rodar

```bash
npm install
cp .env.example .env
# Preencha .env com os valores do Firebase
npm run dev
```

## Configuração do Firebase

1. No Firebase Console, crie o app e copie o `firebaseConfig`.
2. Cole as credenciais em `.env` usando as variáveis:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Deploy no Vercel

Este projeto já inclui `vercel.json` para deploy estático. No Vercel:

1. Conecte o repositório `bibliotech`.
2. Defina as variáveis de ambiente no painel do Vercel com os mesmos nomes de `.env`.
3. Use o build command padrão `npm run build`.
4. O diretório de saída é `dist`.
