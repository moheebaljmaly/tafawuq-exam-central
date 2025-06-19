// Legacy compatibility layer for Supabase calls
// This file provides a bridge between old Supabase code and new API calls

const API_BASE = '/api';

export const supabase = {
  auth: {
    signUp: async ({ email, password, options }: any) => {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName: options?.data?.full_name || '',
          role: options?.data?.role || 'student'
        })
      });
      const data = await response.json();
      return { data: data.success ? { user: data.profile } : null, error: data.error ? { message: data.error } : null };
    },

    signInWithPassword: async ({ email, password }: any) => {
      const response = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      return { data: data.success ? { user: data.profile } : null, error: data.error ? { message: data.error } : null };
    },

    signOut: async () => {
      // Handle client-side logout
      localStorage.removeItem('user_session');
      return { error: null };
    },

    getSession: async () => {
      const session = localStorage.getItem('user_session');
      return { data: { session: session ? JSON.parse(session) : null } };
    }
  },

  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          const response = await fetch(`${API_BASE}/${table}?${column}=${value}`);
          return response.json();
        }
      }),
      order: (column: string, options?: any) => ({
        eq: (filterColumn: string, filterValue: any) => ({
          async execute() {
            const response = await fetch(`${API_BASE}/${table}?${filterColumn}=${filterValue}&order=${column}`);
            return response.json();
          }
        })
      })
    }),

    insert: (data: any) => ({
      select: () => ({
        async single() {
          const response = await fetch(`${API_BASE}/${table}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          return response.json();
        }
      })
    }),

    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        async execute() {
          const response = await fetch(`${API_BASE}/${table}/${value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          return response.json();
        }
      })
    })
  }),

  rpc: async (functionName: string, params?: any) => {
    // Handle RPC calls
    const response = await fetch(`${API_BASE}/rpc/${functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {})
    });
    return response.json();
  }
};