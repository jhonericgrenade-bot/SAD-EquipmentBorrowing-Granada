import { isConfigured } from './supabase.js';
import { setupAuth, getCurrentUser } from './auth.js';
import { setupEquipment, loadEquipment } from './equipment.js';
import { setupTransactions, loadTransactions, getTransactions } from './transactions.js';

let currentUser = null;
const byId = (id) => document.querySelector(id);
const titles = { dashboard:['Overview','Dashboard'], equipment:['Inventory','Equipment'], transactions:['Borrowing records','Transactions'] };
function showView(view) { document.querySelectorAll('.view').forEach((item) => item.classList.toggle('hidden', item.id !== `${view}-view`)); document.querySelectorAll('.nav-link').forEach((item) => item.classList.toggle('active', item.dataset.view === view)); byId('#page-kicker').textContent = titles[view][0]; byId('#page-title').textContent = titles[view][1]; }
async function refresh() { try { const equipment = await loadEquipment(); await loadTransactions(equipment); const tx = getTransactions(); byId('#total-equipment').textContent = equipment.length; byId('#available-equipment').textContent = equipment.filter((item) => item.availability === 'Available').length; byId('#borrowed-equipment').textContent = equipment.filter((item) => item.availability === 'Borrowed').length; byId('#returned-transactions').textContent = tx.filter((item) => item.status === 'Returned').length; byId('#overdue-transactions').textContent = tx.filter((item) => item.status === 'Overdue').length; } catch (error) { alert(`Could not load data: ${error.message}`); } }
async function signedIn() { currentUser = await getCurrentUser(); if (!currentUser) return; byId('#user-email').textContent = currentUser.email; byId('#auth-screen').classList.add('hidden'); byId('#app-screen').classList.remove('hidden'); await refresh(); }
function signedOut() { currentUser = null; byId('#app-screen').classList.add('hidden'); byId('#auth-screen').classList.remove('hidden'); }
document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => byId(`#${button.dataset.close}`).close()));
setupAuth({ onSignedIn:signedIn, onSignedOut:signedOut }); setupEquipment(refresh); setupTransactions(refresh, () => currentUser);
if (!isConfigured) byId('#login-message').textContent = 'Project is ready. Add the Supabase URL and anon key in js/supabase.js.';
else signedIn();
