import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useChatMsgStore } from "./chatMessages";

export interface Chatroom {
  id: string;
  title: string;
}

interface ChatRoomStates {
  chatrooms: Chatroom[] | null;
  loading: boolean;
  deleting: string;
  addChatroom: () => void;
  deleteChatroom: (id: string) => void;
}

const randomTitles = [
  "AI Strategy Session",
  "Code Assistant GPT",
  "Product Ideas",
  "Daily Standup",
  "Marketing Brainstorm",
  "Chat with DevBot",
  "Design Review",
  "Investor Pitch Prep",
  "React Debug Session",
  "Prompt Playground",
];

export const useChatStore = create<ChatRoomStates>()(
  persist(
    (set, get) => ({
      chatrooms: null,
      loading: false,
      deleting: "",

      addChatroom: () => {
        set({ loading: true });
        setTimeout(() => {
          const newRoom = {
            id: crypto.randomUUID(),
            title:
              randomTitles[Math.floor(Math.random() * randomTitles.length)],
          };
          const updated = [...(get().chatrooms || []), newRoom];
          set({ chatrooms: updated, loading: false });
          toast.success("Chatroom created.");
        }, 1000);
      },

      deleteChatroom: (id) => {
        set({ deleting: id });
        setTimeout(() => {
          const deleteChatByID = useChatMsgStore.getState().deleteChatByID;
          // this will delete chats related to target chatroom
          deleteChatByID(id);
          const updated = (get().chatrooms || []).filter((c) => c.id !== id);
          set({ chatrooms: updated, deleting: "" });
          toast.error("Chatroom deleted.");
        }, 1000);
      },
    }),
    {
      name: "chatrooms",
      partialize: (state) => ({ chatrooms: state.chatrooms }),
    }
  )
);
