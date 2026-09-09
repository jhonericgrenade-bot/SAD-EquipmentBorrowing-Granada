import { supabase, isConfigured } from './supabase.js';

export function setupAuth({ onSignedIn, onSignedOut }) {
  const form = document.querySelector('#login-form');
  const message = document.querySelector('#login-message');
  document.querySelector('#logout-button').addEventListener('click', async () => {
    await supabase.auth.signOut();
    onSignedOut();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.className = 'form-message';
    if (!isConfigured) { message.textContent = 'Add your Supabase URL and anon key in js/supabase.js first.'; return; }
    const { error } = await supabase.auth.signInWithPassword({ email: document.querySelector('#login-email').value, password: document.querySelector('#login-password').value });
    if (error) { message.textContent = error.message; return; }
    form.reset(); message.textContent = ''; onSignedIn();
  });
}

export async function getCurrentUser() { if (!isConfigured) return null; const { data } = await supabase.auth.getUser(); return data.user; }
