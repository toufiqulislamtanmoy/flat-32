"use client";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
