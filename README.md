# SelenSync: Next-Gen CLPS Lunar Mission Browser & Topographic Horizon Analyzer

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-Challenge%202026-blue.svg?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/)
[![Project](https://img.shields.io/badge/Platform-SelenSync-indigo.svg?style=for-the-badge)](https://github.com/gmrafi/cfsbr-selensync)
[![Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Organization](https://img.shields.io/badge/Organization-CFSBR%20SpaceWeb-emerald.svg?style=for-the-badge)](https://github.com/gmrafi)

---

## 🌕 Executive Overview

**SelenSync** is an advanced lunar surface exploration and landing site feasibility platform built for the **NASA Space Apps Challenge 2026**, addressing the **"CLPS Lunar Mission Browser"** challenge.

Operating near the lunar South Pole presents extraordinary environmental challenges for NASA's Commercial Lunar Payload Services (CLPS) landers and the Artemis campaign. Because the Moon has an axial tilt of only 1.54°, the Sun skims extremely low across the horizon ($\theta_{elev} \approx 1.5^\circ \text{ to } 3.5^\circ$). Deep craters, massifs, and ridges cast long, moving shadows across potential landing ellipses, creating severe risk of solar power blackouts and Direct-to-Earth (DTE) communication occlusion.

**SelenSync** bridges high-precision topocentric ephemeris calculations, 360° NASA Lunar Reconnaissance Orbiter (LRO) LOLA digital elevation model (DEM) horizon masks, real-time photovoltaic power curves, and Deep Space Network (DSN) RF link budgets into a unified, interactive mission planning workspace.

---

## 👥 Organization & Team Roster

**Organization:** **CFSBR SpaceWeb**  
*(Under the Centre for Fintech & Strategic Business Research — CFSBR)*

### Project Leadership
- **Md Golam Mubasshir Rafi**  
  *Lead: Product Architecture & Spatial Analytics*
- **Afshara Tasneem Zoa**  
  *Co-Lead: Strategy & Research*

---

## 🎯 NASA Challenge Focus: CLPS Lunar Mission Browser

| Metric | Specification |
| :--- | :--- |
| **Challenge Track** | NASA Space Apps Challenge 2026 — CLPS Lunar Mission Browser |
| **Target Geography** | Lunar South Pole ($\text{Lat: } -80^\circ \text{ to } -90^\circ\text{S}$) |
| **Primary Candidates** | Malapert Mountain Massif, Shackleton Crater Rim, Connecting Ridge, Peak of Eternal Light (de Gerlache Rim) |
| **Telemetry Resolution** | High-precision continuous 1-hour time-steps across 24h, 7-day, and 14-day (1 full Lunar Day) mission horizons |
| **Core Physics** | Solar insolation with dust attenuation, crater rim shadow masking, DSN 34m 8.4 GHz RF link budget |

---

## 🔬 Scientific Architecture & Mathematical Models

### 1. Topocentric Celestial Coordinate Transformation
Selenographic sub-solar $(\phi_\odot, \lambda_\odot)$ and sub-Earth $(\phi_\oplus, \lambda_\oplus)$ coordinates are derived directly from the high-precision DE440/DE441-compatible ephemeris engine (`astronomy-engine`). Topocentric elevation angle ($\theta_{elev}$) and azimuth ($\alpha$) relative to an observer at lunar latitude $\phi_1$ and longitude $\lambda_1$ are computed via the spherical law of cosines:

$$\sin(\theta_{elev}) = \sin(\phi_1)\sin(\phi_2) + \cos(\phi_1)\cos(\phi_2)\cos(\lambda_2 - \lambda_1)$$

$$\alpha = \operatorname{atan2}\Big(\sin(\Delta\lambda)\cos(\phi_2),\; \cos(\phi_1)\sin(\phi_2) - \sin(\phi_1)\cos(\phi_2)\cos(\Delta\lambda)\Big)$$

### 2. 360° LOLA Digital Elevation Model (DEM) Horizon Profiler
Synthetic and rasterized DEM profiles extract the maximum elevation angle of surrounding crater rims across all $360^\circ$ azimuths ($\mathcal{H}_{topo}(\alpha)$). A celestial target is unobstructed if and only if:

$$\theta_{elev, target} > \mathcal{H}_{topo}(\alpha_{target})$$

### 3. Solar Photovoltaic Generation Model
Models multi-junction GaAs solar arrays (nominal 30% efficiency) accounting for low-elevation grazing angles, cosine projection factors, and lunar regolith dust deposition factors ($\delta_{dust} = 0.92$):

$$P_{net} = S_0 \cdot A_{array} \cdot \eta_{cell} \cdot \delta_{dust} \cdot \cos(\theta_{inc}) \cdot \mathbb{I}_{\text{cleared}}$$

Where $S_0 = 1361 \text{ W/m}^2$ (AM0 solar constant) and $\mathbb{I}_{\text{cleared}} \in \{0, 1\}$ is the binary topographic clearance flag.

### 4. Direct-to-Earth (DTE) DSN RF Link Budget
Evaluates 8.45 GHz X-Band transmissions from CLPS landers (15W HPA, 0.5m parabolic high-gain antenna) to NASA Deep Space Network (DSN) 34m aperture ground stations (Goldstone, Madrid, Canberra):

$$\text{FSPL} = 20\log_{10}(d_{\text{km}}) + 20\log_{10}(f_{\text{MHz}}) + 32.44 \approx 216.5 \text{ dB}$$

$$\text{Margin}_{\text{dB}} = \text{EIRP} - \text{FSPL} + (G/T)_{\text{ground}} - k_{\text{Boltz}} - R_{\text{data}} - (E_b/N_0)_{\text{req}}$$

---

## 🚀 Key Feature Modules

### 1. Dual-Pane Mission Control Workspace
- **Left Pane**: Dynamic candidate landing site cards, scientific rationale, target mission badges, and interactive Site A vs Site B side-by-side feasibility matrix.
- **Right Pane**: Interactive 360° polar horizon skyline, continuous time scrubber, and synchronized telemetry graphs.

### 2. 360° Fish-Eye Topographic Horizon Polar Plot
- Circular polar radar visualization displaying cardinal headings (N, E, S, W), elevation concentric rings ($10^\circ, 30^\circ, 60^\circ$), crater obstacle skyline mask, and live Sun/Earth positions with color-coded line-of-sight status indicators.

### 3. Dynamic Multi-Day Timeline Scrubber
- Interactive slider supporting 24-hour, 7-day, and 14-day simulation windows. Includes real-time auto-play capabilities to animate solar traverses and Earth libration cycles.

### 4. Telemetry Analytics Engine
- Recharts-powered interactive charts displaying instantaneous solar array wattage ($\text{Watts}$) and Direct-to-Earth link margin ($\text{dB}$) alongside elevation thresholds.

### 5. Afshara — AI Lunar Mission Strategist
- AI reasoning assistant specialized in NASA Artemis, CLPS architectures, cryogenic survival strategies, power storage sizing, and South Pole terrain hazards.

---

## 🛠️ Technology Stack

- **Frontend & App Architecture**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI Components**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Ephemeris Engine**: `astronomy-engine` (High-precision planetary and lunar positions)
- **Data Visualization**: [Recharts](https://recharts.org/) & Custom SVG Polar Projection Canvas
- **Geospatial Mapping**: [Mapbox GL JS](https://www.mapbox.com/) 3D Globe Projection
- **Deployment**: [Vercel](https://vercel.com/)

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gmrafi/cfsbr-selensync.git
   cd cfsbr-selensync
   ```

2. **Install project dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key
   ```

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open Mission Control:**
   Navigate to [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

---

## 🏆 NASA Space Apps Challenge 2026

*Developed by **CFSBR SpaceWeb** • Centre for Fintech & Strategic Business Research (CFSBR)*  
*Project Leads: **Md Golam Mubasshir Rafi** & **Afshara Tasneem Zoa***
