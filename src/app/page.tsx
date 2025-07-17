"use client";

import { useChatStore } from "@/store/chatRooms";
import { Loader2, Search, SquarePen, Trash2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "./components/ui/input";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { chatrooms, addChatroom, deleteChatroom, loading, deleting } =
    useChatStore();
  const router = useRouter();
  const [filteredRooms, setFilteredRooms] = useState(chatrooms);

  const handleCreate = () => {
    addChatroom();
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    deleteChatroom(id);
  };

  // debounce the search
  let searchTimer: NodeJS.Timeout;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimer);

    const query = e.target.value.toLowerCase();
    searchTimer = setTimeout(() => {
      const filtered = (chatrooms || []).filter((room) =>
        room.title.toLowerCase().includes(query)
      );
      setFilteredRooms(filtered);
    }, 500);
  };

  useEffect(() => {
    if (filteredRooms?.length !== chatrooms?.length)
      setFilteredRooms(chatrooms);
  }, [chatrooms]);

  return (
    <div className="pt-6 w-full flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex justify-between items-center mx-auto sm:px-10 px-4 sm:max-w-[1000px] w-full">
        <h2 className="text-3xl font-bold">Your Chatrooms</h2>
        <Button
          onClick={handleCreate}
          disabled={loading}
          className="sm:w-[200px] w-[50px]"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <SquarePen className="size-5 sm:size-4" />
              <p className="sm:block hidden">New Chat</p>
            </>
          )}
        </Button>
      </div>
      <div className="mx-auto sm:px-10 px-4 sm:max-w-[1000px] w-full relative">
        <Search className="absolute top-1/2 -translate-y-1/2 sm:left-14 left-7 opacity-40" />
        <Input
          placeholder="Search by title"
          className="px-12"
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-auto pb-6 grow">
        {!filteredRooms?.length ? (
          <div className="text-center gap-2 flex flex-col text-xl min-h-full justify-center items-center mx-auto sm:px-10 px-4 sm:max-w-[1000px] w-full">
            <p> No chatrooms found.</p>
          </div>
        ) : (
          <div className="sm:space-y-4 space-y-2 mx-auto sm:px-10 px-4 sm:max-w-[1000px] w-full">
            {filteredRooms?.map((room) => (
              <Card
                onClick={() => router.push(`/${room.id}`)}
                key={room.id}
                className=" sm:p-6 p-4 flex-row justify-between items-center cursor-pointer"
              >
                <div>
                  <h3 className="text-lg font-semibold">{room.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    ID: {room.id}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => handleDelete(e, room.id)}
                  disabled={deleting === room.id}
                >
                  {deleting === room.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
