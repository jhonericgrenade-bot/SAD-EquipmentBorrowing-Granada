import { supabase } from './supabase.js';
import { getAvailableEquipment } from './equipment.js';

let transactions = [];
let equipmentById = new Map();
const byId = (id) => document.querySelector(id);
const today = () => new Date().toISOString().slice(0, 10);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;' })[char]);
const effectiveStatus = (row) => row.status !== 'Returned' && row.due_date < today() ? 'Overdue' : row.status;
const badge = (value) => `<span class="badge status-${String(value).toLowerCase()}">${escapeHtml(value)}</span>`;

export async function loadTransactions(allEquipment) {
  equipmentById = new Map(allEquipment.map((item) => [item.id, item]));
  const { data, error } = await supabase.from('borrow_transactions').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  transactions = data || [];
  await saveOverdueStatuses();
  renderTransactions(); renderRecentTransactions();
  return transactions;
}

async function saveOverdueStatuses() {
  const overdueIds = transactions.filter((row) => effectiveStatus(row) === 'Overdue' && row.status !== 'Overdue').map((row) => row.id);
  if (!overdueIds.length) return;
  const { error } = await supabase.from('borrow_transactions').update({ status: 'Overdue' }).in('id', overdueIds);
  if (!error) transactions = transactions.map((row) => overdueIds.includes(row.id) ? { ...row, status:'Overdue' } : row);
}

export function setupTransactions(onChanged, getUser) {
  byId('#add-transaction-button').addEventListener('click', () => openTransactionDialog());
  byId('#transaction-search').addEventListener('input', renderTransactions);
  byId('#transaction-filter').addEventListener('change', renderTransactions);
  byId('#date-borrowed').addEventListener('change', () => { byId('#due-date').min = byId('#date-borrowed').value; });
  byId('#transaction-form').addEventListener('submit', async (event) => { event.preventDefault(); await saveTransaction(onChanged, getUser); });
  byId('#transaction-table').addEventListener('click', async (event) => { if (event.target.closest('[data-action="return"]')) await returnEquipment(Number(event.target.dataset.id), onChanged); });
}

export function getTransactions() { return transactions; }
function renderTransactions() {
  const term = byId('#transaction-search').value.trim().toLowerCase(); const filter = byId('#transaction-filter').value;
  const rows = transactions.filter((row) => { const item = equipmentById.get(row.equipment_id); const status = effectiveStatus(row); return (filter === 'All' || status === filter) && (!term || `${row.borrower_name} ${item?.equipment_name ?? ''} ${item?.asset_code ?? ''}`.toLowerCase().includes(term)); });
  byId('#transaction-table').innerHTML = transactionTable(rows, true);
}
function renderRecentTransactions() { byId('#recent-transactions').innerHTML = transactionTable(transactions.slice(0, 5), false); }
function transactionTable(rows, includeActions) { return rows.length ? `<table><thead><tr><th>Equipment</th><th>Borrower</th><th>Department</th><th>Borrowed</th><th>Due date</th><th>Status</th>${includeActions ? '<th>Action</th>' : ''}</tr></thead><tbody>${rows.map((row) => { const item = equipmentById.get(row.equipment_id); const status = effectiveStatus(row); return `<tr><td>${escapeHtml(item?.equipment_name ?? 'Deleted equipment')}<br><small>${escapeHtml(item?.asset_code ?? '')}</small></td><td>${escapeHtml(row.borrower_name)}<br><small>${escapeHtml(row.borrower_type)}</small></td><td>${escapeHtml(row.department)}</td><td>${row.date_borrowed}</td><td>${row.due_date}</td><td>${badge(status)}</td>${includeActions ? `<td>${status === 'Returned' ? '-' : `<button class="small-button" data-action="return" data-id="${row.id}">Return</button>`}</td>` : ''}</tr>`; }).join('')}</tbody></table>` : '<div class="empty-state">No transactions found.</div>'; }
function openTransactionDialog() { const available = getAvailableEquipment(); const select = byId('#transaction-equipment'); byId('#transaction-form').reset(); byId('#transaction-message').textContent = ''; byId('#date-borrowed').value = today(); byId('#due-date').min = byId('#date-borrowed').value; select.innerHTML = available.length ? `<option value="">Select available equipment</option>${available.map((item) => `<option value="${item.id}">${escapeHtml(item.asset_code)} - ${escapeHtml(item.equipment_name)}</option>`).join('')}` : '<option value="">No equipment is available</option>'; byId('#transaction-dialog').showModal(); }
async function saveTransaction(onChanged, getUser) {
  const message = byId('#transaction-message');
  const equipmentId = Number(byId('#transaction-equipment').value);
  const borrowed = byId('#date-borrowed').value;
  const due = byId('#due-date').value;

  message.textContent = '';
  if (!equipmentId) {
    message.textContent = 'Select available equipment.';
    return;
  }
  if (due < borrowed) {
    message.textContent = 'Due date cannot be earlier than borrowing date.';
    return;
  }

  // Reserve the equipment first, so a second borrowing attempt is rejected.
  const { data: reservedEquipment, error: reserveError } = await supabase
    .from('equipment')
    .update({ availability: 'Borrowed' })
    .eq('id', equipmentId)
    .eq('availability', 'Available')
    .select('id');

  if (reserveError) {
    message.textContent = reserveError.message;
    return;
  }
  if (!reservedEquipment?.length) {
    message.textContent = 'This equipment is no longer available. Refresh and choose another item.';
    return;
  }

  const user = await getUser();
  const { error } = await supabase.from('borrow_transactions').insert({
    equipment_id: equipmentId,
    borrower_name: byId('#borrower-name').value.trim(),
    borrower_type: byId('#borrower-type').value,
    department: byId('#borrower-department').value.trim(),
    date_borrowed: borrowed,
    due_date: due,
    status: 'Borrowed',
    user_id: user.id,
  });

  if (error) {
    await supabase.from('equipment').update({ availability: 'Available' }).eq('id', equipmentId);
    message.textContent = error.message;
    return;
  }

  byId('#transaction-dialog').close();
  await onChanged();
}
async function returnEquipment(transactionId, onChanged) { const row = transactions.find((item) => item.id === transactionId); if (!row || !confirm('Mark this equipment as returned today?')) return; const { error } = await supabase.from('borrow_transactions').update({ status:'Returned', date_returned:today() }).eq('id', transactionId).neq('status', 'Returned'); if (error) { alert(error.message); return; } const { error:updateError } = await supabase.from('equipment').update({ availability:'Available' }).eq('id', row.equipment_id); if (updateError) { alert(updateError.message); return; } await onChanged(); }
