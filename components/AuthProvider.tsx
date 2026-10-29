'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/lib/auth';
import { DEMO_ACCOUNTS } from '@/lib/auth';
import {
  getCurrentUserAction,
  loginAction,
  logoutAction,
  registerUserAction,
  type RegisterUserInput,
} from '@/app/auth-actions';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; remainingSeconds?: number }>;
  register: (input: RegisterUserInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'admin' | 'ngo' | 'corporate') => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  // Load current session from cookie on initial mount
  React.useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const currentUser = await getCurrentUserAction();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('[AuthProvider] Failed to verify session:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = React.useCallback(
    async (email: string, password: string) => {
      try {
        const res = await loginAction(email, password);
        if (res.success) {
          setUser(res.user);
          router.refresh();
          return { success: true };
        } else {
          return {
            success: false,
            error: res.error,
            remainingSeconds: res.remainingSeconds,
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Authentication failed due to an unexpected error.',
        };
      }
    },
    [router]
  );

  // Register handler
  const register = React.useCallback(
    async (input: RegisterUserInput) => {
      try {
        const res = await registerUserAction(input);
        if (res.success) {
          setUser(res.user);
          router.refresh();
          return { success: true };
        } else {
          return {
            success: false,
            error: res.error,
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Registration failed due to an unexpected error.',
        };
      }
    },
    [router]
  );

  // Logout handler
  const logout = React.useCallback(async () => {
    try {
      await logoutAction();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('[AuthProvider] Logout error:', err);
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  // Demo role switcher for testing convenience
  const switchDemoRole = React.useCallback(
    async (role: 'admin' | 'ngo' | 'corporate') => {
      const demoAccount = DEMO_ACCOUNTS.find((acc) => acc.role === role);
      if (demoAccount) {
        await loginAction(demoAccount.email, demoAccount.plainDemoPassword);
        const updated = await getCurrentUserAction();
        setUser(updated);
        router.refresh();
      }
    },
    [router]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

