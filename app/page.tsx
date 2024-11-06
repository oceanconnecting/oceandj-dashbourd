"use client";

import { LoginForm } from "@/components/form/login-form";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {loading ? <Spinner size="lg" className="text-white"/> : <LoginForm />}
    </div>
  );
}
