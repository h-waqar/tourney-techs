"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import api from "@/utils/axios";

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get("/api/me");
        const user = res.data?.data?.user;  // FIX here

        if (user?.role === "admin") {
          setAuthorized(true);
        } else {
          router.push("/unauthorized");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) return <Loader/>
  if (!authorized) return null; 

  return <>{children}</>;
}
