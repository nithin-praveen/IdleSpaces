'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/lib/auth-client';
import { DEMO_ACCOUNTS } from '@/lib/auth-client';
import {
  getCurrentUserAction,
  loginAction,
  loginWithDemoAccountAction,
  logoutAction,
  registerUserAction,
  type RegisterUserInput,
} from '@/app/auth-actions';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; remainingSeconds?: number; user?: AuthUser }>;
  register: (input: RegisterUserInput) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
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
          return { success: true, user: res.user };
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
    []
  );

  // Register handler
  const register = React.useCallback(
    async (input: RegisterUserInput) => {
      try {
        const res = await registerUserAction(input);
        if (res.success) {
          setUser(res.user);
          return { success: true, user: res.user };
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
    []
  );

  // Logout handler
  const logout = React.useCallback(async () => {
    try {
      await logoutAction();
      setUser(null);
      window.location.href = '/login';
    } catch (err) {
      console.error('[AuthProvider] Logout error:', err);
      setUser(null);
      window.location.href = '/login';
    }
  }, []);

  // Demo role switcher for testing convenience — uses safe server-side account ID matching
  const switchDemoRole = React.useCallback(
    async (role: 'admin' | 'ngo' | 'corporate') => {
      const demoAccount = DEMO_ACCOUNTS.find((acc) => acc.role === role);
      if (demoAccount) {
        const res = await loginWithDemoAccountAction(demoAccount.id);
        if (res.success) {
          setUser(res.user);
          if (role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/discover';
          }
        }
      }
    },
    []
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
