"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowUp, Plus, LoaderPinwheel, CircleX } from "lucide-react";
import Image from "next/image";
import { Textarea } from "../components/ui/textarea";
import { useChatMsgStore } from "@/store/chatMessages";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useChatStore } from "@/store/chatRooms";
import MessageCard from "./MessageCard";
import ChatSkeletons from "./ChatSkeletons";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

export default function ChatPage() {
  const { roomId } = useParams();
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { messages, sendMessage, openRoom, loading, loadOlderMessages } =
    useChatMsgStore();
  const { chatrooms } = useChatStore();
  
  useInfiniteScroll(topRef, scrollRef, loadOlderMessages);

  useEffect(() => {
    if (chatrooms === null) return;
    const isExist = chatrooms.find((room) => room.id === roomId);
    if (!isExist) return router.push("/");
    if (roomId) openRoom(roomId as string);
  }, [roomId, chatrooms]);

  const handleSend = () => {
    if (loading) return;
    if (image) sendMessage({ sender: "user", content: image, type: "image" });
    if (input) sendMessage({ sender: "user", content: input, type: "text" });
    setInput("");
    setImage(null);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full mx-auto sm:px-10 px-4 pb-6  sm:max-w-[800px] w-full">
      <div
        ref={scrollRef}
        className="overflow-auto flex-1 gap-8 py-6 flex flex-col-reverse hide-scrollbar"
      >
        {loading !== "initial-messages" && (
          <div ref={bottomRef} className="min-h-32" />
        )}
        {(loading === "Analyzing..." || loading === "Just a sec...") && (
          <div className="flex gap-1 self-start">
            <LoaderPinwheel className="min-w-6 animate-spin scale-105 transition-all duration-300" />{" "}
            {loading}
          </div>
        )}
        {loading === "initial-messages" && <ChatSkeletons n={20} />}
        {!!messages.length ? (
          messages.map((msg) => <MessageCard key={msg.id} {...msg} />)
        ) : (
          <p className="text-4xl text-center"> Welcome !</p>
        )}
        {loading === "more-messages" && <ChatSkeletons />}
        <div ref={topRef} className="min-h-7" />
      </div>

      <Card className="  gap-1 p-2 rounded-3xl">
        {image && (
          <div className="relative w-fit group">
            <Image
              src={image}
              alt="uploaded"
              width={1}
              height={1}
              className="rounded-2xl w-[80px] border  aspect-square object-cover"
            />
            <CircleX
              onClick={() => setImage(null)}
              className="absolute top-1 hidden group-hover:block right-1 size-5 text-[gray] cursor-pointer "
            />
          </div>
        )}
        <Textarea
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border-0 focus-visible:border-0"
          onKeyDown={handleEnter}
        />
        <div className="flex flex-row justify-between items-center">
          <Button variant={"ghost"} className=" rounded-full h-fit p-0">
            <label htmlFor="upload" className="p-2 cursor-pointer">
              <Plus className="text-muted-foreground size-5" />
            </label>
          </Button>
          <input
            id="upload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />
          <Button
            disabled={!!loading || (!input && !image)}
            className=" rounded-full h-fit has-[>svg]:p-2"
            onClick={handleSend}
          >
            <ArrowUp className="size-6" />
          </Button>
        </div>
      </Card>
      <p className="text-muted-foreground text-xs text-center mt-2 -mb-2">
        Gemini can make mistakes, so double-check it
      </p>
    </div>
  );
}
