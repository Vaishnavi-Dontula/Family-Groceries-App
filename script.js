import { supabase } from './supabaseClient.js';

const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const addForm = document.getElementById('addForm');
const itemInput = document.getElementById('itemInput');
const groceryList = document.getElementById('groceryList');
const markAllDoneBtn = document.getElementById('markAllDone');
const clearAllBtn = document.getElementById('clearAll');
const toggleMode = document.getElementById('toggleMode');
const allDoneMessage = document.getElementById('allDoneMessage');

let familyId = null;

const emojiMap = {
  salt: "🧂", sugar: "🍬", milk: "🥛", bread: "🍞", eggs: "🥚",
  rice: "🍚", flour: "🌾", tea: "🍵", coffee: "☕", tomato: "🍅",
  onion: "🧅", potato: "🥔", banana: "🍌", apple: "🍎", oil: "🛢️",
  default: "🛒"
};

function getEmoji(name) {
  const key = name.toLowerCase();
  for (const word in emojiMap) {
    if (key.includes(word)) return emojiMap[word];
  }
  return emojiMap.default;
}

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// ✅ Single login handler
loginBtn.addEventListener('click', async () => {
  const family = usernameInput.value.trim().toLowerCase();
  if (!family) return;
  familyId = family;

  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  loadItems();

  // ✅ Real-time sync
  supabase
    .channel('grocery-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'groceries',
        filter: `family=eq.${familyId}`
      },
      (payload) => {
        console.log('🔔 Real-time update received:', payload);
        loadItems(); // Refresh UI
      }
    )
    .subscribe();
});

async function loadItems() {
  groceryList.innerHTML = '';
  const { data } = await supabase.from('groceries').select('*').eq('family', familyId);
  data?.forEach(item => renderItem(item));
  checkIfAllDone();
}

function renderItem(item) {
  const li = document.createElement('li');
  li.id = item.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = item.checked;

  const span = document.createElement('span');
  span.textContent = `${getEmoji(item.name)} ${item.name}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '❌';
  deleteBtn.className = 'delete-btn';

  checkbox.addEventListener('change', () => {
    supabase.from('groceries').update({ checked: checkbox.checked }).eq('id', item.id);
    checkIfAllDone();
  });

  deleteBtn.addEventListener('click', () => {
    supabase.from('groceries').delete().eq('id', item.id);
    li.remove();
    checkIfAllDone();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  li.classList.toggle('done', item.checked);
  groceryList.appendChild(li);
}

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = itemInput.value.trim();
  if (!name || !familyId) return;

  const { data } = await supabase
    .from('groceries')
    .insert([{ name, family: familyId, checked: false }])
    .select();

  if (data) renderItem(data[0]);
  itemInput.value = '';
});

markAllDoneBtn.addEventListener('click', async () => {
  const { data } = await supabase.from('groceries').select('*').eq('family', familyId);
  for (const item of data) {
    await supabase.from('groceries').update({ checked: true }).eq('id', item.id);
    document.getElementById(item.id)?.classList.add('done');
  }
  checkIfAllDone();
});

clearAllBtn.addEventListener('click', async () => {
  await supabase.from('groceries').delete().eq('family', familyId);
  groceryList.innerHTML = '';
  checkIfAllDone();
});

toggleMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleMode.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

async function checkIfAllDone() {
  const { data } = await supabase.from('groceries').select('*').eq('family', familyId);
  const allChecked = data.length > 0 && data.every(item => item.checked);
  allDoneMessage.classList.toggle('hidden', !allChecked);
  if (allChecked) launchConfetti();
}
