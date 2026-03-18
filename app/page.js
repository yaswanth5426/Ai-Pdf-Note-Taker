"use client"
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // ✅ wait for Clerk to load

    if (!user) {
      router.replace("/sign-in"); // ✅ not logged in → sign in
      return;
    }

    CheckUser();
  }, [user, isLoaded]);

  const CheckUser = async () => {
    await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });
    router.replace("/dashboard"); // ✅ logged in → dashboard
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>
  );
}