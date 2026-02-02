# 🍔 Burger Box API

Modern backend API for Burger Box application with Google OAuth authentication.

---

## 🚀 Quick Start

### Installation

```bash
git clone <repository-url>
cd burger-box-api
npm install
```

### Environment Setup

Create `.env` file:

```env
PORT=5000
NODE_ENV=development

GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Run Server

```bash
npm run start:dev
```

Server runs at: `http://localhost:5000`

---

## 🔐 Authentication Flow

1. User clicks "Sign in with Google" → Frontend gets Google ID token
2. Frontend sends token to `/auth/google`
3. Backend verifies with Google & creates/finds user
4. Backend returns JWT access token
5. Frontend stores token & uses for API requests

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

---

### **Login with Google**

**Endpoint:** `POST /auth/google`

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  "platform": "web"
}
```

**Response (Web Platform):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
> **Note:** Refresh token sent as HTTP-only cookie

**Response (Mobile Platform):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Details:**
- Access Token: Expires in **1 hour**
- Refresh Token: Expires in **7 days**

**Decoded Token Payload:**
```json
{
  "sub": "7f5cb06b-47c0-4be6-b77f-156d9930f337",
  "email": "user@gmail.com",
  "name": "John Doe",
  "img_url": "https://lh3.googleusercontent.com/...",
  "platform": "web",
  "iat": 1770041537,
  "exp": 1770045137
}
```

---

## 🎨 Frontend Integration Examples

### React/Next.js

#### 1. Install Google OAuth Package

```bash
npm install @react-oauth/google jwt-decode
```

#### 2. Setup Google Login

```jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <LoginPage />
    </GoogleOAuthProvider>
  );
}

export default App;
```

#### 3. Login Component

```jsx
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function LoginPage() {
  const handleLogin = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          idToken: credentialResponse.credential,
          platform: 'web'
        })
      });

      const data = await response.json();
      
      localStorage.setItem('token', data.access_token);
      
      const user = jwtDecode(data.access_token);
      console.log('Logged in user:', user);
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h1>Login to Burger Box</h1>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log('Login Failed')}
      />
    </div>
  );
}

export default LoginPage;
```

#### 4. Get User Info from Token

```jsx
import { jwtDecode } from 'jwt-decode';

function Profile() {
  const token = localStorage.getItem('token');
  const user = jwtDecode(token);

  return (
    <div>
      <img src={user.img_url} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

export default Profile;
```

#### 5. Protected API Requests

```jsx
async function fetchUserData() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/orders', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
}
```

#### 6. Auto-Refresh Token Check

```jsx
import { jwtDecode } from 'jwt-decode';

function isTokenExpired(token) {
  if (!token) return true;
  
  const decoded = jwtDecode(token);
  return decoded.exp * 1000 < Date.now();
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

---

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
  <div id="g_id_onload"
       data-client_id="YOUR_GOOGLE_CLIENT_ID"
       data-callback="handleCredentialResponse">
  </div>
  
  <div class="g_id_signin" data-type="standard"></div>

  <script>
    async function handleCredentialResponse(response) {
      const res = await fetch('http://localhost:5000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          idToken: response.credential,
          platform: 'web'
        })
      });
      
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      
      console.log('Login successful!');
    }
  </script>
</body>
</html>
```

---

### React Native / Mobile

```jsx
import { GoogleSignin } from '@react-native-google-signin/google-signin';

async function handleGoogleLogin() {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    const response = await fetch('http://localhost:5000/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken: userInfo.idToken,
        platform: 'mobile'
      })
    });

    const { access_token, refresh_token } = await response.json();
    
    await AsyncStorage.setItem('access_token', access_token);
    await AsyncStorage.setItem('refresh_token', refresh_token);
    
  } catch (error) {
    console.error(error);
  }
}
```

---

## 🔒 Security Features

- ✅ Access tokens expire in 1 hour
- ✅ Refresh tokens expire in 7 days
- ✅ HTTP-only cookies for web (prevents XSS)
- ✅ CORS protection enabled
- ✅ JWT signature verification
- ✅ Google token validation

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  img_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🛠️ Tech Stack

- NestJS
- TypeScript
- Supabase (PostgreSQL)
- JWT Authentication
- Google OAuth 2.0

---

## 🚀 Deployment

### Production Environment Variables

```env
NODE_ENV=production
PORT=5000
GOOGLE_CLIENT_ID=your_production_client_id
JWT_SECRET=strong_random_secret_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### Build & Run

```bash
npm run build
npm run start:prod
```

---

## 📞 Error Handling

### Common Errors

**401 Unauthorized - Invalid Token**
```json
{
  "message": "Invalid Google ID token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

**401 Unauthorized - User Creation Failed**
```json
{
  "message": "Failed to create user",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

## ⚡ Coming Soon

- [ ] Refresh token endpoint
- [ ] Menu management API
- [ ] Order management API
- [ ] User profile update
- [ ] Admin dashboard

---

## 📝 License

MIT

---
