# TokenRadar - Crypto Launch & Listing Watchlist (WAT)

A mobile-first Android Progressive Web Application (PWA) built for researching upcoming cryptocurrency token launches and exchange listings over the next 7 days, tailored for beginner market observation with a strict **$10 maximum trade model** and localized to **Nigerian Time (WAT / Africa-Lagos, UTC+1)**.

![TokenRadar](https://img.shields.io/badge/Platform-Android%20PWA-cyan)
![Node.js](https://img.shields.io/badge/Runtime-Node.js%20%7C%20Express-emerald)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20v4-indigo)

---

## 🌟 Key Features

- **7-Day Multi-Venue Research Radar:** Scans centralized exchanges (Binance, Bybit, KuCoin, Gate.io, OKX, Bitget, MEXC) and decentralized launchpads/pools (Uniswap, Aerodrome, Raydium, PancakeSwap).
- **Nigerian WAT Timing & Live Countdown:** All listings converted to West Africa Time (UTC+1 / Africa-Lagos) with live countdown timers.
- **$10 Position Feasibility Calculator:** Evaluates roundtrip gas fees, DEX swap fees, and slippage based on pool depth (flags high-gas traps on Ethereum L1 vs. low-gas networks like Base and Solana).
- **Social Engagement Quality Audit:** Audits observable evidence (post frequency, organic discussions vs. bot giveaway spam). Strictly labels and blacklists unconfirmed rumors.
- **Observation Strategy:** Guides entry ~1 hour prior and target exit within 3–5 minutes after listing commences.
- **Price Alerts & Push Notifications:** Configurable price thresholds with browser/Android push notifications, synthesized 2-tone audio chime, haptic vibration, and heads-up banner.
- **Android PWA Support:** Installable directly from Chrome on Android as a standalone app with home screen icon and offline support.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn` / `pnpm`

### 2. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
cd <YOUR_REPO_NAME>
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API Key in `.env`:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 How to Push This App to GitHub

### Step 1: Create a New Repository on GitHub
1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **`+`** icon in the top right corner and select **"New repository"**.
3. Name your repository (e.g., `tokenradar-crypto-watchlist`).
4. Keep it Public or Private, and **do NOT** check "Add a README file" (we already created one).
5. Click **"Create repository"**.

### Step 2: Push from Terminal
Run the following commands in the project root directory:

```bash
# Initialize git repository
git init

# Add all project files
git add .

# Create the initial commit
git commit -m "feat: initial commit TokenRadar crypto launch watchlist"

# Rename branch to main
git branch -M main

# Link to your new GitHub repository (replace with your repository URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git

# Push code to GitHub
git push -u origin main
```

---

## 📱 Installing on Android Phone

1. Open your hosted app URL in **Google Chrome** on an Android phone.
2. Tap the **three dots menu (`⋮`)** in the top right corner of Chrome.
3. Select **"Install app"** or **"Add to Home screen"**.
4. Tap **"Install"** to add TokenRadar to your Android home screen and app drawer.

---

## 🛡️ Security & Disclaimers

- This application is strictly an educational research and observation tool.
- It does **NOT** execute trades, connect to private crypto wallets, require wallet approvals, or request seed phrases/private keys.
- Crypto launch sniping and pre-listing DEX trading carry extreme risk of total loss from MEV frontrunning and developer liquidity dumps.
