# 💬 ArkThread API

A real-time chat backend built with **Node.js**, **Express**, **Socket.IO**, **PostgreSQL**, and **Redis**. This project covers JWT authentication, chat rooms, file/image sharing, GIF support via Giphy, online status, typing indicators, and paginated message history.

---

## 🛠️ Tech Stack

| Layer        | Tool                          |
| ------------ | ----------------------------- |
| Runtime      | Node.js                       |
| Framework    | Express.js                    |
| Real-time    | Socket.IO                     |
| Database     | PostgreSQL                    |
| ORM          | Prisma                        |
| Cache        | Redis                         |
| Auth         | JWT (Access + Refresh Tokens) |
| File Storage | Cloudinary                    |
| GIF Search   | Giphy API                     |
| Validation   | Zod                           |

---

## ✨ Features

- 🔐 JWT Authentication (Register, Login, Refresh Token)
- 🏠 Chat Rooms (Direct + Group)
- 💬 Real-time Messaging via Socket.IO
- 🟢 Online / Offline Status
- ✍️ Typing Indicators
- 🖼️ Image & File Sharing (via Cloudinary)
- 🎞️ GIF Search & Sharing (via Giphy API)
- 📜 Paginated Message History (Cursor-based)
- 🛡️ Rate Limiting & Input Validation
- 🐳 Docker Support

---

## 📁 Project Structure

```
arkthread/
├── src/
│   ├── config/          # DB, Redis, Cloudinary config
│   ├── controllers/     # Route handler logic
│   ├── middlewares/     # Auth, error handler, file upload
│   ├── routes/          # Express route definitions
│   ├── sockets/         # Socket.IO event handlers
│   ├── services/        # Business logic layer
│   ├── utils/           # JWT helpers, pagination utils
│   └── app.js           # App entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── .env.example         # Environment variable template
├── docker-compose.yml   # Docker setup
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Redis
- Cloudinary account
- Giphy API key

### Installation

```bash
# Clone the repo
git clone https://github.com/rayan-1005/arkthread.git
cd arkthread

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

### Using Docker

```bash
docker-compose up -d
```

---

## 🔑 Environment Variables

```env
# Server
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/arkthread

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Giphy
GIPHY_API_KEY=your_giphy_api_key
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | `/api/auth/register`      | Register a new user  |
| POST   | `/api/auth/login`         | Login and get tokens |
| POST   | `/api/auth/logout`        | Logout user          |
| POST   | `/api/auth/refresh-token` | Get new access token |

### Rooms

| Method | Endpoint                 | Description      |
| ------ | ------------------------ | ---------------- |
| POST   | `/api/rooms`             | Create a room    |
| GET    | `/api/rooms`             | Get my rooms     |
| GET    | `/api/rooms/:id`         | Get room details |
| POST   | `/api/rooms/:id/members` | Add a member     |
| DELETE | `/api/rooms/:id/members` | Leave a room     |

### Messages

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| GET    | `/api/rooms/:id/messages`        | Get paginated messages |
| POST   | `/api/rooms/:id/messages/upload` | Upload image/file      |
| GET    | `/api/gifs/search?q=query`       | Search GIFs via Giphy  |

---

## ⚡ Socket.IO Events

### Client → Server

| Event          | Payload                              | Description             |
| -------------- | ------------------------------------ | ----------------------- |
| `join_room`    | `{ roomId }`                         | Join a chat room        |
| `leave_room`   | `{ roomId }`                         | Leave a chat room       |
| `send_message` | `{ roomId, content, type, fileUrl }` | Send a message          |
| `typing`       | `{ roomId, isTyping }`               | Broadcast typing status |

### Server → Client

| Event          | Payload                          | Description              |
| -------------- | -------------------------------- | ------------------------ |
| `new_message`  | `{ message }`                    | New message received     |
| `user_typing`  | `{ userId, username, isTyping }` | Someone is typing        |
| `user_online`  | `{ userId }`                     | User came online         |
| `user_offline` | `{ userId }`                     | User went offline        |
| `room_joined`  | `{ roomId, members }`            | Joined room confirmation |

---

## 🗄️ Database Schema

Key models: `User`, `Room`, `RoomMember`, `Message`

Message types supported: `TEXT`, `IMAGE`, `FILE`, `GIF`

> See `prisma/schema.prisma` for the full schema.

---

## 🏗️ Development Phases

- [x] **Phase 1** — Express setup, Prisma, PostgreSQL, JWT Auth
- [ ] **Phase 2** — Rooms, Messages, Basic Socket.IO
- [ ] **Phase 3** — Real-time messaging, Online status, Typing indicators
- [ ] **Phase 4** — File/Image uploads, GIF sharing
- [ ] **Phase 5** — Validation, Rate limiting, Docker, Deployment

---

## 📦 Scripts

```bash
npm run dev        # Start dev server with nodemon
npm run start      # Start production server
npm run migrate    # Run Prisma migrations
npm run studio     # Open Prisma Studio (DB GUI)
```

---

## 🤝 Contributing

This is a personal learning project. Feel free to fork and build on it!

---

## 📄 License

MIT
