# Frontend - Real-Time Chat

Este é o frontend do sistema de chat em tempo real, desenvolvido com **React**, **Vite** e **TypeScript**.

![image](https://github.com/user-attachments/assets/fe08173e-a543-4689-ae36-607db5f647a8)


## 🧱 Tecnologias Principais

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [React Router](https://reactrouter.com/)

## ⚙️ Configuração e Execução

## - Local:

### 1. Instale as dependências

```bash
npm install
```

### 2. Crie um arquivo ``.env`` seguindo o exemplo do ``env.example`` com o enderenço da API

``
VITE_API_URL=http://localhost:3000
``

### 3. Execute o comando
```bash
npm run dev
```

### 4. Acesse
``http://localhost:5174/``

## - Docker:

### 1. Execute o comando

```bash
docker compose -f docker-compose.dev.yml up --build
```

### 2. Acesse
``http://localhost:5174/``

## Para que o projeto funcione corretamente é necessário executar também o backend:
- [Backend](https://github.com/Tavares-ltc/real-time-chat-back)
- [Monorepo](https://github.com/Tavares-ltc/real-time-chat)

