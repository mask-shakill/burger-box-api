# 🍔 Burger_Box API

A modern, secure backend API for the **Burger_Box** application featuring Google OAuth authentication and efficient user data management.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>=16.x)
- Package manager: **pnpm**, **yarn**, or **bun**

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd burger-box-api
```

2. Install dependencies:

```bash
npm install

```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure your `.env` file with:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

### Development Server

Start the development server:

```bash
pnpm dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the API.

---

## 🔐 Auth Module Structure

The authentication module implements **Google OAuth 2.0** for user login and **JWT** for secure session management.

```
src/
└── auth/
    ├── dto/
    │   └── google-login.dto.ts       # Validates Google ID token payload
    ├── guards/
    │   └── jwt-auth.guard.ts         # JWT token validation guard
    ├── strategies/
    │   └── google.strategy.ts        # Google OAuth strategy (optional)
    ├── auth.controller.ts            # Authentication route handlers
    ├── auth.service.ts               # Authentication business logic
    ├── auth.module.ts                # Auth module configuration
    └── constants.ts                  # JWT secrets and configuration
```

### Key Components

- **DTOs (Data Transfer Objects)**: Validate and type-check incoming authentication requests
- **Guards**: Protect routes requiring authentication
- **Strategies**: Define authentication methods (Google OAuth)
- **Service Layer**: Handles token generation, validation, and user management
- **Controller**: Exposes authentication endpoints

---

## 📡 API Endpoints

### Authentication

#### `POST /auth/google/login`

Authenticate user with Google ID token

**Request Body:**

```json
{
  "idToken": "google_id_token_here"
}
```

**Response:**

```json
{
  "accessToken": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "profile_picture_url"
  }
}
```

#### `GET /auth/profile`

Get current user profile (requires authentication)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "profile_picture_url"
}
```

#### `POST /auth/logout`

Invalidate current session

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

---

## 🛠️ Technologies Used

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Passport.js](http://www.passportjs.org/)** - Authentication middleware
- **[Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)** - Third-party authentication
- **[JWT](https://jwt.io/)** - JSON Web Tokens for session management
- **[Prisma](https://www.prisma.io/)** / **[TypeORM](https://typeorm.io/)** - Database ORM
- **[PostgreSQL](https://www.postgresql.org/)** / **[MongoDB](https://www.mongodb.com/)** - Database

---

## 📚 Learn More

### NestJS Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Authentication Guide](https://docs.nestjs.com/security/authentication)
- [Google OAuth with Passport](https://docs.nestjs.com/recipes/passport#google-strategy)

### Google OAuth Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

---

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy your NestJS API is using the [Vercel Platform](https://vercel.com/).

```bash
vercel deploy
```

### Deploy on Railway

1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Deploy with Docker

```bash
# Build image
docker build -t burger-box-api .

# Run container
docker run -p 3000:3000 --env-file .env burger-box-api
```

### Environment Variables for Production

Ensure these are set in your deployment platform:

- `NODE_ENV=production`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `JWT_SECRET`
- `DATABASE_URL`
- `ALLOWED_ORIGINS` (for CORS)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
