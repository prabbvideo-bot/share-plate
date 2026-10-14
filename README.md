# SharePlate India · Neighborhood Food & Tiffin Sharing

A hyper-local web application where local restaurants, bhojanalayas, darshinis, dhabas, sweet stalls, and neighbors post surplus food for free (₹0) or at community discounts, strictly visible within a 1-km walking radius.

---

## ✨ Features

- **Hyper-Local 1-km Radius Filter**:
  - Automatically calculates distance and walking times using the Haversine formula.
  - Interactive radius selector (`500 m`, `1.0 km`, `2.0 km`, `5.0 km`) with live neighborhood spot counts.
  - Pre-configured Indian localities: *Indiranagar (Bengaluru)*, *T. Nagar (Chennai)*, *Bandra West (Mumbai)*, *Lajpat Nagar (New Delhi)*, or your real browser GPS location.
- **Interactive Community Radar Map**:
  - Live SVG neighborhood radar showing the 1-km radius perimeter ring, arterial roads, and color-coded spot pins.
- **Surplus Food & Neighbor Requests**:
  - Post surplus North/South Indian meals, tiffins, rotis, fresh mandi vegetables, milk packets, and puja prasadam.
  - Post urgent neighbor requests for baby milk, dal, or groceries.
- **The "Bring Your Own Dabba 🍱" Movement**:
  - Promotes reusable steel tiffins, dabbas, and cloth bags to eradicate single-use plastics.
  - Dietary labels: Pure Veg green dot, Jain (no onion/garlic), Halal, and Vegan.
- **User Authentication & Accounts**:
  - **Google Sign-In**: 1-click cloud authentication.
  - **Account Registration & Login**: Support for both residents and verified food establishments (*Bhojanalaya, Darshini, Restaurant, Sweet Stall, Mandi*).
  - **1-Click Indian Demo Profiles**: Instant testing for *Meenakshi (Neighbor)*, *Rajeshwar (Krishna Bhojanalaya)*, and *Ramesh (Udupi Grand Darshini)*.
- **Digital Pickup Passes & Direct Chat**:
  - Generates instant claim pass codes (`SP-XXXX`) with portion reservations and pickup windows.
  - In-app neighbor messenger for contactless porch/gate pickups.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite 6 (stable Rollup/esbuild)
- **Backend / Production Server**: Node.js, Express (serving single-page app with `/healthz` health check)
- **Database & Auth**: Firebase Firestore & Firebase Authentication (`centering-beanbag-qsjh2`)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

### Steps
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build and test production locally**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deploying to Render.com

This repository includes all required configuration files for Render, including `render.yaml`, `server.ts`, and updated `package.json` scripts.

### Method 1: Deploy with Render Blueprint (`render.yaml`) — Recommended

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to [Render.com](https://dashboard.render.com/).
3. In the dashboard, click **New +** and select **Blueprint**.
4. Connect your repository.
5. Render will detect the included `render.yaml` file automatically:
   - **Service Type**: Web Service
   - **Name**: `shareplate-india`
   - **Environment**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm run start`
   - **Health Check**: `/healthz`
6. Click **Apply**. Your app will build cleanly in ~10 seconds and go live with a free HTTPS URL!

---

### Method 2: Manual Web Service on Render

If you prefer to configure manually on Render without Blueprints:

1. Click **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure the settings:
   - **Name**: `shareplate-india`
   - **Region**: `Singapore` (recommended for India users) or closest region
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
4. Expand **Advanced**:
   - **Health Check Path**: `/healthz`
   - Add Environment Variable:
     - `NODE_VERSION` = `20.18.0`
5. Click **Create Web Service**.

---

### Method 3: Deploy as a Render Static Site (Alternative)

If you wish to host the app as a pure client-side Static Site on Render:

1. Click **New +** > **Static Site**.
2. Connect your repository.
3. Configure:
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Publish Directory**: `dist`
4. In the **Redirects / Rewrites** tab, add an SPA rewrite rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
5. Click **Create Static Site**.

---

## 📁 Repository Structure

```text
├── render.yaml                  # Render.com Blueprint configuration (IaC)
├── server.ts                    # Production Express server with /healthz & SPA routing
├── package.json                 # Scripts: dev, build, start, preview, lint
├── firebase-applet-config.json  # Firebase client credentials
├── firebase-blueprint.json      # Firestore schemas (UserProfile, FoodListing, FoodClaim)
├── firestore.rules              # Deployed Firestore security rules
├── index.html                   # HTML entry point with Indian fonts & SEO meta tags
├── metadata.json                # Applet configuration & metadata
├── src/
│   ├── main.tsx                 # React application entry
│   ├── App.tsx                  # Core app view, filters, impact metrics, modals
│   ├── firebase.ts              # Firebase client, auth provider, and error handling
│   ├── index.css                # Global styles and Tailwind CSS v4
│   ├── context/
│   │   └── AuthContext.tsx      # Authentication state (Google, email, demo profiles)
│   ├── components/
│   │   ├── Header.tsx           # 3-Zone navigation bar & user account dropdown
│   │   ├── NeighborhoodControl.tsx # Radius filter (500m - 5km) & impact counter
│   │   ├── FilterBar.tsx        # Search, price filter (₹), categories, dietary tags
│   │   ├── FoodCard.tsx         # Item card with veg indicator, dabba badge, claim actions
│   │   ├── NeighborhoodMap.tsx  # Interactive SVG 1-km radar & local street grid
│   │   ├── AuthModal.tsx        # Sign In & Account Creation modal with demo profiles
│   │   ├── NewListingModal.tsx  # Post surplus food / request items form
│   │   ├── ClaimModal.tsx       # Instant reservation with Digital Pickup Pass
│   │   ├── ChatModal.tsx        # Real-time neighbor messaging drawer
│   │   ├── MyClaimsModal.tsx    # Active & collected claim pass management
│   │   └── SafetyGuidelinesModal.tsx # FSSAI & hygiene standards for food sharing
│   ├── data/
│   │   └── mockData.ts          # Authentic Indian localities and seed listings
│   ├── utils/
│   │   └── geo.ts               # Haversine distance & walking time utilities
│   └── types/
│       └── index.ts             # TypeScript definitions
```

---

## 📜 Available NPM Scripts

- `npm run dev`: Starts the local Vite development server on port 3000.
- `npm run build`: Compiles TypeScript and creates optimized production assets in `dist/`.
- `npm run start`: Runs the Node/Express production server (`server.ts`) on the configured `PORT`.
- `npm run lint`: Runs TypeScript validation without emitting output.
- `npm run preview`: Previews the compiled `dist/` bundle locally with Vite.

---

## 🔒 Security & Food Hygiene

- **Firestore Rules**: Strict Attribute-Based Access Control (ABAC) and default-deny security model.
- **Safety Guidelines**: Follows community food safety principles: 2-hour pickup rule for hot foods, proper allergen disclosure, and clean container hygiene.

---

## 📄 License

Apache-2.0 License. Built for neighborhood communities.
