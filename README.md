# 🤖 Simulated AI Chat App 

## 📋 Overview

This is a simulation-based frontend project built with **NextJS**, **Zustand**, **Tailwind CSS**, and **ShadCN**. The application provides:

- Phone Authentication via OTP with proper validations.
- An interactive dashboard to visualize, create and delete chatrooms.
- Individual Chatrooms to interact with AI.

---

## 🚀 Features

### 🔐 Authentication Module

- Allows users to **log in using phone number and OTP**.
- **Country codes** are fetched dynamically from `restcountries.com`.
- OTP verification is **simulated** using `setTimeout` and stored in `localStorage`.
- Form validation is handled using **React Hook Form** and **Zod**.
- State is managed globally using **Zustand**.
- **Dark mode toggle** with theme persisted in `localStorage`.

### 📊 Dashboard Module

- Displays a **list of chatrooms** with their title and ID.
- Users can **create** or **delete chatrooms**, with confirmation via `react-toastify`.
- New chatrooms are given **random AI-style titles**.
- Includes **debounced search functionality** to filter chatrooms by title.
- Uses **Zustand with localStorage persist** to store chatroom data.
- Responsive design with **adaptive card layout** for all screen sizes.

### 💬 Chatroom Module

- Dedicated chat interface for each chatroom accessed via `/[roomId]`.
- Supports **text and image messages**, with **image preview**.
- Displays messages from both the user and a **simulated AI assistant**.
- Shows **timestamps** with each message.
- AI responses are **delayed using `setTimeout`** to simulate typing/thinking.
- **AI's processing status**: "Analyzing..." etc shown during AI response.
- Implements **reverse infinite scroll** to fetch older messages with `IntersectionObserver`.
- Messages are paginated with **20 per page**.
- Auto-scrolls to the latest message on new message or room change.
- **Copy-to-clipboard** icon appears on message hover.

---

## 🧱 Folder Structure

```
src/
├── app/
│   ├── [roomId]/
│   │   ├── ChatSkeletons.tsx
│   │   ├── MessageCard.tsx
│   │   └── page.tsx
│   ├── auth/
│   │   ├── phone/
│   │   │   ├── page.tsx
│   │   │   └── PhoneInput.tsx
│   │   └── verify/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── LayoutWrapper.tsx
│   ├── hooks/
│   │   └── useInfiniteScroll.ts
│   ├── lib/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── store/
    ├── auth.ts
    ├── chatMessages.ts
    └── chatRooms.ts
```


---

## 🧪 Tech Stack

- NextJS
- Zustand
- Tailwind CSS + ShadCN
- React Hook Form + Zod
- TypeScript

---

## ▶️ How to Run Locally

```bash
# Step 1: Clone the repository
git clone https://github.com/Anubhav0391/simulated-ai-chatapp.git
cd simulated-ai-chatapp

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev
```
---

## 🔄 Project Flow Overview

### 🧠 AI Response Simulation
- When a user sends a message:
  - It's immediately added to the chat window.
  - A **simulated AI response** is triggered using `setTimeout` with delays:
    - `"Analyzing..."` → after 1500ms → `"Just a sec..."` → after 1000ms → actual reply.
  - The AI's reply is randomly selected from a set of predefined strings.
  - Typing indicators are shown during the delay for a more realistic experience.

### 🔍 Debounced Search in Dashboard
- The dashboard includes a **search input** to filter chatrooms by title.
- A custom `debounce` function delays filtering:
  - Reduces unnecessary renders and API/state calls.
  - Triggers the search logic **after a short pause in typing** (e.g., 300ms).
- Chatrooms are filtered using `.includes()` on lowercase titles.

### ✅ Form Validation with React Hook Form + Zod
- Phone number and OTP inputs are validated using:
  - [`react-hook-form`](https://react-hook-form.com/) for form state.
  - [`zod`](https://github.com/colinhacks/zod) for schema-based validation.
- Example validations:
  - Phone number must contain only digits and have a specific length.
  - OTP must match the value stored in `localStorage`.
- Errors are displayed dynamically beneath each input field.

### 🔐 Authentication Flow
1. User enters their **phone number**.
2. A simulated OTP is **generated and saved to `localStorage`**.
3. User enters OTP to verify.
4. On success, user is marked as logged in (`isLoggedIn: true` in Zustand).

### 💬 Chatroom & Messages Flow
- **Dashboard:**
  - Shows list of chatrooms from Zustand store (`persist`ed to `localStorage`).
  - Allows creating and deleting rooms with UI feedback and fake delays.
- **Chatroom Page:**
  - Loads the latest messages (20 per page) for the selected chatroom.
  - Implements **reverse infinite scroll** using `IntersectionObserver`.
  - Shows image previews and timestamps.
  - Supports **copy-to-clipboard** on message hover.

### 🧠 State Management
- State is managed using **Zustand** with `persist` middleware.
- Separate slices for:
  - Auth (`useAuthStore`)
  - Chatrooms (`useChatStore`)
  - Chat messages (`useChatMsgStore`)
- Shared state updates UI reactively across pages.


