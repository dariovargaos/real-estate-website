"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Spinner } from "@chakra-ui/react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let redirected = false;

    const redirect = (path: string) => {
      if (!redirected) {
        redirected = true;
        router.push(path);
      }
    };

    // Supabase auto-exchanges the PKCE ?code= on client init (detectSessionInUrl: true).
    // We just listen for the resulting SIGNED_IN event instead of calling exchangeCodeForSession.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        redirect("/");
      }
    });

    // Also check immediately — the exchange may already be done by the time this runs.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) redirect("/");
    });

    // Fallback: if nothing happens within 8 seconds, something went wrong.
    const timeout = setTimeout(() => redirect("/auth/auth-code-error"), 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <Flex minH="100vh" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="hsl(35, 80%, 56%)" />
    </Flex>
  );
}
