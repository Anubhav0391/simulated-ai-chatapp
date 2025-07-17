"use client";

import { Message } from "@/store/chatMessages";
import React, { memo } from "react";
import { cn } from "../lib/utils";
import { Copy, LoaderPinwheel } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

const MessageCard = ({ timestamp, type, sender, content }: Message) => {
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <div
      className={cn(
        "group relative max-w-[80%] flex gap-1 rounded-[20px]",
        sender === "user" && "self-end bg-accent text-accent-foreground",
        sender === "ai" && "self-start ",
        sender === "user" && type === "text" && "rounded-tr-[2px] p-3"
      )}
    >
      {sender === "ai" && <LoaderPinwheel className="min-w-6" />}
      {type === "text" ? (
        <p className=" break-words w-full">{content}</p>
      ) : (
        <Image
          src={content}
          alt="uploaded"
          width={200}
          height={200}
          className="rounded-xl border"
        />
      )}
      <span
        className={`text-xs absolute -bottom-5 text-gray-400 ${
          sender == "user" ? "right-1" : "left-7"
        }`}
      >
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {type === "text" && (
        <Copy
          onClick={() => copyMessage(content)}
          className={`absolute bottom-1  ${
            sender == "user" ? "-left-6" : "-right-6"
          } size-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer`}
        />
      )}
    </div>
  );
};

export default memo(MessageCard);
