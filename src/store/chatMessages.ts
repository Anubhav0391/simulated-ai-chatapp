import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Message = {
  id: string;
  sender: "user" | "ai";
  content: string;
  type: "text" | "image";
  timestamp: string;
};

interface ChatStates {
  currentRoomId: string | null;
  messages: Message[];
  page: number;
  hasMore: boolean;
  chatMessages: Record<string, Message[]>;
  loading?:
    | "initial-messages"
    | "Analyzing..."
    | "Just a sec..."
    | "more-messages"
    | null;

  openRoom: (roomId: string) => void;
  deleteChatByID:(roomId: string)=>void;
  sendMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  loadOlderMessages: () => void;
}

const randomMsgs = [
  "Hello! How can I assist you today?",
  "I'm here to help. What do you need?",
  "That's an interesting query. Let me look into that for you.",
  "Understood. I'm processing your request now. Please wait a moment.",
  "Affirmative. I have the information you seek. Would you like me to elaborate further on any specific aspect?",
  "Apologies, I didn't quite catch that. Could you please rephrase your question?",
  "My apologies, but I am unable to fulfill that specific request at this time. Is there something else I can assist you with?",
  "Yes, I can certainly help with that! What are the details?",
  "I'm ready for your next command.",
  "Indeed. Your inquiry has been noted and I am formulating the most accurate response possible. Thank you for your patience.",
];

export const useChatMsgStore = create<ChatStates>()(
  persist(
    (set, get) => ({
      currentRoomId: null,
      hasMore: false,
      page: 1,
      loading: null,
      messages: [],
      chatMessages: {},

      openRoom: (roomId) => {
        const allMsgs = get().chatMessages[roomId] || [];
        set({
          currentRoomId: roomId,
          messages: allMsgs.slice(0, 20),
          hasMore: allMsgs.length > 20,
          loading: "initial-messages",
        });
        setTimeout(() => set({ loading: null }), 1500);
      },

      deleteChatByID: (roomId) => {
        const chatMessages = { ...get().chatMessages };
        delete chatMessages[roomId];
        set({ chatMessages });
      },

      loadOlderMessages: () => {
        const { currentRoomId, messages, hasMore, loading, page } = get();
        if (!currentRoomId) return;
        const parsed = get().chatMessages[currentRoomId] || [];
        if (!currentRoomId || !hasMore || loading === "more-messages") return;

        set({ loading: "more-messages" });
        setTimeout(() => {
          const newPage = page + 1;
          const updatedMsgs = [
            ...messages,
            ...parsed.slice(page * 20, newPage * 20),
          ];
          set({
            messages: updatedMsgs,
            page: newPage,
            hasMore: parsed.length > 20 * newPage,
            loading: null,
          });
        }, 2000);
      },

      sendMessage: (msg) => {
        const { currentRoomId, chatMessages, messages } = get();
        if (!currentRoomId) return;
        const prevMsgs = chatMessages[currentRoomId] || [];
        const id = crypto.randomUUID();
        const timestamp = new Date().toISOString();
        const newMsg: Message = { ...msg, id, timestamp };
        const updatedMsgs = [newMsg, ...messages];
        const updatedStoredMsg = [newMsg, ...prevMsgs];
        set({
          messages: updatedMsgs,
          chatMessages: {
            ...chatMessages,
            [currentRoomId]: updatedStoredMsg,
          },
          loading: "Analyzing...",
        });
        setTimeout(() => set({ loading: "Just a sec..." }), 1500);
        setTimeout(() => {
          const id = crypto.randomUUID();
          const timestamp = new Date().toISOString();
          const sender = "ai";
          const type = "text";
          const content =
            randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
          const aiMsg: Message = { id, sender, content, type, timestamp };
          const messages = [aiMsg, ...updatedMsgs];
          set({
            messages,
            chatMessages: {
              ...chatMessages,
              [currentRoomId]: [aiMsg, ...updatedStoredMsg],
            },
            loading: null,
          });
        }, 2500);
      },
    }),
    {
      name: "chat-messages",
      partialize: (state) => ({
        chatMessages: state.chatMessages,
      }),
    }
  )
);
