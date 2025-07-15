# 🛒 Family Grocery List App (Supabase)

A beautiful, real-time, collaborative grocery list web app for families — built with HTML, CSS, JavaScript, and Supabase as the backend database.

## ✨ Features

- 👨‍👩‍👧 Login with Family Name (no password needed)
- ➕ Add grocery items with auto-emoji mapping
- ✅ Mark individual or all items as done
- ❌ Delete individual or all items
- 🎉 Confetti animation when all items are completed
- 🌙 Dark/Light mode toggle
- 📱 Responsive design for all devices
- 🔒 Data stored securely in Supabase (scalable and persistent)

## 🔧 Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Confetti**: canvas-confetti CDN
- **Icons**: Remix Icon CDN
- **Font**: Google Fonts (Poppins)

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone https://github.com/your-username/family-grocery-list.git
cd family-grocery-list
```

### 2. Set up Supabase

- Go to [https://app.supabase.com](https://app.supabase.com) and create a new project.
- Create a table called `groceries` with these columns:

```sql
create table groceries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  checked boolean default false,
  family text not null
);
```

- Enable **Row Level Security (RLS)**.
- Add this simple RLS policy:

```sql
-- Allow read and write if family name is provided
create policy "Family access" on groceries
  for all
  using (true)
  with check (true);
```

- Go to `Settings > API` in Supabase and copy:
  - Project URL
  - Public Anon Key

### 3. Update `supabaseClient.js`

```js
export const supabase = createClient(
  'https://your-project-id.supabase.co',
  'your-anon-public-key'
);
```

### 4. Open the app

Open `index.html` in a browser or host it on Netlify, Vercel, GitHub Pages, etc.

## 📸 Screenshot

![App Screenshot](https://your-screenshot-link.png)

## 🧠 Future Enhancements

- 🔔 Push notifications
- 👤 Authenticated user accounts
- 📱 PWA support for mobile install
- 🗃️ Filter/search items

## 📄 License

MIT License © 2025 Vaishnavi Dontula
