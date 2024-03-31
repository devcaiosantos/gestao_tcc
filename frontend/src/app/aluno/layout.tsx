"use client";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token) {
    router.push("/erro/404");
    return null;
  }

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const apiUrl = `http://localhost:3333/alunoAuth/token/${token}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          router.push("/erro/404");
          return;
        }

        const verify = await response.json();

        if (!verify) {
          router.push("/erro/404");
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        router.push("/erro/404");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <AuthProvider>
      <html lang="en">
        <body className="bg-[var(--primary-color)] flex justify-center">
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
