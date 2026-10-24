import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/db/supabase";
import { safeStorage } from "@/utils/safeStorage";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  sendPhoneOtp: (phone: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>;
  sendEmailOtp: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, token: string) => Promise<void>;
  signInAsDemoUser: (name?: string, emailOrPhone?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_STORAGE_KEY = "trive_auth_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // 1. Initial Supabase session check
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (initialSession?.user && isMounted) {
          setSession(initialSession);
          setUser(initialSession.user);
          await safeStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify(initialSession.user)
          );
          setIsLoaded(true);
          return;
        }

        // 2. Fallback to persisted SecureStore cached user
        const cachedUserJson = await safeStorage.getItem(SESSION_STORAGE_KEY);
        if (cachedUserJson && isMounted) {
          const cachedUser = JSON.parse(cachedUserJson) as User;
          setUser(cachedUser);
        }
      } catch (err) {
        console.warn("Failed to restore cached user session:", err);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    void initAuth();

    // 3. Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await safeStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(currentSession.user)
        );
      }
      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    setUser(data.user);
    setSession(data.session);
    if (data.user) {
      await safeStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(data.user)
      );
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name, display_name: name },
      },
    });
    if (error) throw error;
    setUser(data.user);
    setSession(data.session);
    if (data.user) {
      await safeStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(data.user)
      );
    }
  };

  const sendPhoneOtp = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) throw error;
    setUser(data.user);
    setSession(data.session);
    if (data.user) {
      await safeStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(data.user)
      );
    }
  };

  const sendEmailOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) throw error;
  };

  const verifyEmailOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) throw error;
    setUser(data.user);
    setSession(data.session);
    if (data.user) {
      await safeStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(data.user)
      );
    }
  };

  // Instant 1-tap fast user login (for Google SSO & instant demo access)
  const signInAsDemoUser = async (
    name = "Rashed Molla",
    emailOrPhone = "rashedmolla541@gmail.com"
  ) => {
    const mockUser = {
      id: "trive-user-" + Date.now(),
      email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
      user_metadata: { full_name: name, display_name: name },
    } as unknown as User;

    setUser(mockUser);
    await safeStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mockUser));
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    setUser(null);
    setSession(null);
    await safeStorage.deleteItem(SESSION_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoaded,
        isSignedIn: !!user,
        signInWithEmail,
        signUpWithEmail,
        sendPhoneOtp,
        verifyPhoneOtp,
        sendEmailOtp,
        verifyEmailOtp,
        signInAsDemoUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
