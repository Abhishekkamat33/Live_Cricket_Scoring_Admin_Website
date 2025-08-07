'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";



type Player = { name: string };

interface MatchData {
  teamA: { name: string; benchPlayers?: Player[] };
  teamB: { name: string; benchPlayers?: Player[] };
}

updateMatchData: (updatedData: MatchData) => Promise<void>;


export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Send Firebase ID token to API to set session cookie
  const handleSession = async (user: User) => {
    const idToken = await user.getIdToken();

    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create session");
    }
  };

  // useEffect(() => {
  //   // Monitor Firebase auth state
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     const sessionCookie = document.cookie.includes("session");

  //     if (user) {
  //       if (!user.emailVerified) {
  //         setError("Please verify your email before logging in.");
  //         await signOut(auth);
  //         setCheckingAuth(false);
  //         return;
  //       }

  //       if (!sessionCookie) {
  //         // Session cookie missing but Firebase user exists - sign out to force login
  //         await signOut(auth);
  //         setCheckingAuth(false);
  //         return;
  //       }

  //       try {
  //         // Refresh session cookie if needed
  //         await handleSession(user);
  //         router.push("/dashboard");
  //       } catch (sessionError: any) {
  //         setError(sessionError.message || "Failed to establish session");
  //       }
  //     }
  //     setCheckingAuth(false);
  //   });

  //   return () => unsubscribe();
  // }, [router]);

  // Handle email/password form login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // if (!user.emailVerified) {
      //   setError("Please verify your email before logging in.");
      //   await signOut(auth);
      //   setLoading(false);
      //   return;
      // }

      // Save Firestore user doc if does not exist
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          id: user.uid,
        });
      }

      // Establish session cookie via API
      await handleSession(user);

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Email/password sign-in failed");
      }
    }

    finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // if (!user.emailVerified) {
      //   setError("Please verify your email before logging in.");
      //   await signOut(auth);
      //   setLoading(false);
      //   return;
      // }

      // Save user in Firestore if not exists
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          id: user.uid,
        });
      }

      // Establish session cookie
      await handleSession(user);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  // if (checkingAuth) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-300">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Cricket Scoring Login</h2>

        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="on">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-blue-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-gray-800 placeholder-gray-400"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-blue-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-gray-800 placeholder-gray-400"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-4"
        >
          {loading ? "Signing In..." : "Sign in with Google"}
        </button>

        {error && (
          <p className="text-red-500 mt-2 text-center" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
