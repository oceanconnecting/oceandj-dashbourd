"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const LogoutButton = ({ isOpen }) => {
  return (
    <Button
      onClick={() => signOut()}
      variant="outline"
      className="w-full justify-center h-10 mt-5"
    >
      <span className={cn(isOpen === false ? "" : "mr-4")}>
        <LogOut size={18} />
      </span>
      <p
        className={cn(
          "whitespace-nowrap",
          isOpen === false ? "opacity-0 hidden" : "opacity-100"
        )}
      >
        Sign out
      </p>
    </Button>
  )
}

export default LogoutButton;