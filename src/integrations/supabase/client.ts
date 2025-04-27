
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ijjpmxdsstnltvrwxvaj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqanBteGRzc3RubHR2cnd4dmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMDM1NDIsImV4cCI6MjA2MDY3OTU0Mn0.HvRNMpRkBrZ2VKWrxL7U-2X4OYVIzW_WAZFC67wzjc0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Set session expiry to 5 days
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    const fiveDaysInSeconds = 5 * 24 * 60 * 60; // 5 days in seconds
    localStorage.setItem('sessionExpiry', String(Date.now() + (fiveDaysInSeconds * 1000)));
  }
});

// Check session expiry
const checkSessionExpiry = () => {
  const expiryTime = localStorage.getItem('sessionExpiry');
  if (expiryTime && Date.now() > Number(expiryTime)) {
    supabase.auth.signOut();
    localStorage.removeItem('sessionExpiry');
  }
};

// Run check on client initialization
checkSessionExpiry();
