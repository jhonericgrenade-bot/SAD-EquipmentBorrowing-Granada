import { supabase } from './supabase.js';

let equipment = [];
const byId = (id) => document.querySelector(id);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;' })[char]);
const badge = (value) => `<span class="badge status-${String(value).toLowerCase().replaceAll(' ', '-')}">${escapeHtml(value)}</span>`;

export async function loadEquipment() {
  const { data, error } = await supabase.from('equipment').select('*').order('asset_code');
  if (error) throw error;
  equipment = data || [];
  renderEquipment();
  return equipment;
}

export function getAvailableEquipment() { return equipment.filter((item) => item.availability === 'Available'); }
export function setupEquipment(onChanged) {
  byId('#add-equipment-button').addEventListener('click', () => openEquipmentDialog());
  byId('#equipment-search').addEventListener('input', renderEquipment);
  byId('#equipment-filter').addEventListener('change', renderEquipment);
  byId('#equipment-form').addEventListener('submit', async (event) => { event.preventDefault(); await saveEquipment(onChanged); });
  byId('#equipment-table').addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]'); if (!button) return;
    const item = equipment.find((row) => row.id === Number(button.dataset.id));
    if (button.dataset.action === 'edit') openEquipmentDialog(item);
    if (button.dataset.action === 'delete' && item && confirm(`Delete ${item.equipment_name}? This cannot be undone.`)) {
      const { error } = await supabase.from('equipment').delete().eq('id', item.id);
      if (error) alert(error.message.includes('foreign key') ? 'This equipment has transaction history and cannot be deleted.' : error.message);
      else { await onChanged(); }
    }
  });
}

function renderEquipment() {
  const term = byId('#equipment-search').value.trim().toLowerCase(); const availability = byId('#equipment-filter').value;
  const rows = equipment.filter((item) => (availability === 'All' || item.availability === availability) && (!term || `${item.equipment_name} ${item.asset_code}`.toLowerCase().includes(term)));
  byId('#equipment-table').innerHTML = rows.length ? `<table><thead><tr><th>Asset code</th><th>Equipment</th><th>Category</th><th>Condition</th><th>Availability</th><th>Actions</th></tr></thead><tbody>${rows.map((item) => `<tr><td>${escapeHtml(item.asset_code)}</td><td>${escapeHtml(item.equipment_name)}</td><td>${escapeHtml(item.category)}</td><td>${badge(item.condition)}</td><td>${badge(item.availability)}</td><td class="actions"><button class="small-button" data-action="edit" data-id="${item.id}">Edit</button><button class="small-button delete" data-action="delete" data-id="${item.id}">Delete</button></td></tr>`).join('')}</tbody></table>` : '<div class="empty-state">No equipment records found.</div>';
}

function openEquipmentDialog(item = null) {
  const form = byId('#equipment-form'); form.reset(); byId('#equipment-message').textContent = '';
  byId('#equipment-dialog-title').textContent = item ? 'Edit equipment' : 'Add equipment';
  byId('#equipment-id').value = item?.id ?? ''; byId('#equipment-name').value = item?.equipment_name ?? ''; byId('#equipment-category').value = item?.category ?? ''; byId('#equipment-code').value = item?.asset_code ?? ''; byId('#equipment-condition').value = item?.condition ?? 'Good';
  byId('#equipment-dialog').showModal();
}

async function saveEquipment(onChanged) {
  const id = byId('#equipment-id').value; const message = byId('#equipment-message'); message.textContent = '';
  const record = { equipment_name: byId('#equipment-name').value.trim(), category: byId('#equipment-category').value.trim(), asset_code: byId('#equipment-code').value.trim().toUpperCase(), condition: byId('#equipment-condition').value };
  let result;
  if (id) result = await supabase.from('equipment').update(record).eq('id', id); else result = await supabase.from('equipment').insert({ ...record, availability: 'Available' });
  if (result.error) { message.textContent = result.error.code === '23505' ? 'Asset code must be unique.' : result.error.message; return; }
  byId('#equipment-dialog').close(); await onChanged();
}
