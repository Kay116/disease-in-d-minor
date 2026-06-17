# Setup guide

Complete instructions for running this project locally and deploying it live — no prior experience needed.

---

## What you need

| Tool | What it is | Cost |
|---|---|---|
| A browser | Chrome, Firefox, Safari, Edge | Free |
| VS Code | Text editor for code | Free |
| GitHub account | Stores and hosts your project | Free |
| Groq API key | Powers the AI guide | Free |

---

## Part 1 — Run it on your computer

### Step 1: Download the project

**Option A — If you have Git:**
```bash
git clone https://github.com/yourusername/disease-in-d-minor.git
cd disease-in-d-minor
```

**Option B — No Git:**
Go to the repo on GitHub → click the green **Code** button → click **Download ZIP** → unzip it on your computer.

---

### Step 2: Get your free Groq AI key

1. Go to **[console.groq.com](https://console.groq.com)**
2. Click **Sign in with Google** — no credit card, completely free
3. In the left sidebar, click **API Keys**
4. Click **Create API Key** → give it any name (e.g. `disease-app`) → click Submit
5. Copy the key — it looks like `gsk_abc123xyz...`

> **Important:** Groq only shows your key once. Paste it somewhere safe (phone notes, password manager) before continuing.

---

### Step 3: Add your key to the project

Open VS Code → File → Open Folder → select the project folder.

Open the file `js/ai.js`. Near the top, find this line:

```js
const GROQ_KEY = 'YOUR_GROQ_KEY_HERE';
```

Replace `YOUR_GROQ_KEY_HERE` with your real key. Keep the single quote marks `'` on both sides:

```js
const GROQ_KEY = 'gsk_abc123xyz...';
```

Save the file with **Ctrl+S** (Windows) or **Cmd+S** (Mac).

---

### Step 4: Open in your browser

Find `index.html` in your project folder. Double-click it. It opens in your browser.

You should see the app with the dark theme, four disease cards, and the tab bar. Click **Play Healthy** on the Listen tab — you should hear music. Click the **Ask AI** tab, type a question, click **Ask** — you should get an AI response within a few seconds.

> **Nothing happening?** Most common fix: make sure you saved `js/ai.js` after adding your key. Press Ctrl+S and refresh the browser (F5).

---

## Part 2 — Put it live on the internet (free)

GitHub Pages turns your repo into a real public website at no cost.

### Step 1: Create a GitHub repo

1. Go to **[github.com](https://github.com)** and sign in
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - Repository name: `disease-in-d-minor`
   - Visibility: **Public** ← required for free Pages
   - Check **Add a README file**
4. Click **Create repository**

---

### Step 2: Upload your files

In your new repo, click **Add file → Upload files**.

Drag your entire project folder into the upload box, or click to browse and select all files. Make sure the folder structure is preserved:

```
index.html
README.md
SETUP.md
css/style.css
data/aminoacids.js
data/diseases.js
data/quiz.js
js/audio.js
js/render.js
js/ai.js        ← make sure your key is in here before uploading
js/app.js
```

Scroll down → write a commit message like `Initial upload` → click **Commit changes**.

---

### Step 3: Enable GitHub Pages

1. In your repo, click **Settings** (top tab)
2. In the left sidebar, scroll down and click **Pages**
3. Under "Build and deployment", set:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**

Wait about 60 seconds, then refresh the Settings → Pages page. You'll see a green box:

```
Your site is live at https://yourusername.github.io/disease-in-d-minor
```

Click that link — your app is live on the internet.

---

### Step 4: Update the live site anytime

Every time you make a change locally:

1. Edit the file in VS Code → save
2. Go to your GitHub repo → find the file → click the pencil (Edit) icon
3. Paste your updated code → click **Commit changes**
4. Wait 60 seconds → the live site updates automatically

Or use **GitHub Desktop** (free app at desktop.github.com) to sync changes without going through the browser.

---

## Part 3 — Adding a new disease

All disease data lives in `data/diseases.js`. To add a new disease, open that file and add a new entry following the same pattern as the existing four.

Each entry needs:

```js
your_key: {
  name: 'Display name',
  tag:  'Short description · stat',
  icon: '◉',                          // any single symbol
  quote: 'One-sentence human story.',
  facts: ['Fact 1', 'Fact 2', 'Fact 3'],
  mutation: 'HTML description of the mutation.',
  healthy: { name: 'Sequence label', seq: 'AMINOACIDLETTERS' },
  mutant:  { name: 'Sequence label', seq: 'AMINOACIDLETTERS' },
  mut: [5],                            // zero-indexed position(s) of mutation
  hStats: { len: 20, charge: -1, np: 12, pol: 4, pos: 2, neg: 2 },
  mStats: { len: 20, charge:  0, np: 13, pol: 4, pos: 2, neg: 1 },
  insight: 'One sentence explaining what changed and why it matters.',
}
```

Where to get sequences: [SAbDab](https://opig.stats.ox.ac.uk/webapps/sabdab-sabpred/sabdab), [UniProt](https://www.uniprot.org), [RCSB PDB](https://www.rcsb.org).

---

## Groq free tier limits

| Limit | Value |
|---|---|
| Requests per minute | 30 |
| Requests per day | 14,400 |
| Cost | $0 forever |

For a personal or student project, these limits are effectively unlimited. If you ever hit the per-minute limit, the app shows a friendly error and the user can try again in a moment.

---

## Troubleshooting

**AI not responding**
- Check that your key in `js/ai.js` starts with `gsk_` and has no extra spaces
- Make sure you saved the file after editing
- Check the browser console (F12 → Console tab) for error messages

**Music not playing**
- Some browsers block audio until the user clicks something — clicking the Play button counts, so this should work automatically
- If on iOS Safari, make sure your phone is not on silent mode

**Site not updating after changes**
- GitHub Pages can take up to 2 minutes to rebuild
- Try a hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Sequence validation error**
- Only the 20 standard amino acid letters are valid: A C D E F G H I K L M N P Q R S T V W Y
- Remove any spaces, numbers, or FASTA header lines (lines starting with `>`)

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Structure | HTML5 | Single page, no framework needed |
| Design | CSS3 custom properties | Dark theme, responsive, no library |
| Audio | Web Audio API | Built into every browser, no install |
| AI | Groq + Llama 3.1 | Free tier, fast responses |
| Hosting | GitHub Pages | Free, permanent, automatic HTTPS |
| Fonts | Google Fonts (Space Grotesk + Inter) | Clean, modern, free |
