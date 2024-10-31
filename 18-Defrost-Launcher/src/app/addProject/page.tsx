"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AddProjectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/addProject/verifyToken");
  }, [router])
}