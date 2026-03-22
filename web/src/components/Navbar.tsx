"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          DesignEval
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/evaluate"
                className="text-sm hover:text-blue-600 dark:hover:text-blue-400"
              >
                新規評価
              </Link>
              <Link
                href="/compare"
                className="text-sm hover:text-blue-600 dark:hover:text-blue-400"
              >
                比較
              </Link>
              <Link
                href="/interview"
                className="text-sm hover:text-blue-600 dark:hover:text-blue-400"
              >
                AI面接
              </Link>
              <Link
                href="/dashboard"
                className="text-sm hover:text-blue-600 dark:hover:text-blue-400"
              >
                履歴
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
