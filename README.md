# SelenSync: Next-Gen CLPS Lunar Mission Browser & Topographic Horizon Analyzer

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-Global%20Nominees%202026-blue.svg?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/)
[![Platform](https://img.shields.io/badge/Platform-SelenSync%202.0-indigo.svg?style=for-the-badge)](https://github.com/gmrafi/cfsbr-selensync)
[![Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Organization](https://img.shields.io/badge/Organization-CFSBR%20SpaceWeb-emerald.svg?style=for-the-badge)](https://github.com/gmrafi)

---

## Executive Overview

**SelenSync** is an advanced lunar surface exploration, trajectory simulation, and landing site feasibility modeling platform engineered for the **NASA Space Apps Challenge 2026**, addressing the **"CLPS Lunar Mission Browser"** challenge.

Operating near the **Lunar South Pole ($\text{Lat: } -80^\circ \text{ to } -90^\circ\text{S}$)** presents severe environmental challenges for NASA's Commercial Lunar Payload Services (CLPS) landers and the Artemis campaign. Due to the Moon's minimal axial tilt of only **1.54°**, the Sun skims extremely low across the horizon ($\theta_{\text{elev}} \approx 1.5^\circ \text{ to } 3.5^\circ$). High massifs, crater rims, and connecting ridges cast expansive, dynamic shadows that threaten continuous photovoltaic power generation and Direct-to-Earth (DTE) RF communication line-of-sight.

**SelenSync** integrates high-precision topocentric ephemeris calculations, 360° NASA Lunar Reconnaissance Orbiter (LRO) LOLA digital elevation models (DEM), dynamic photovoltaic power curves, and Deep Space Network (DSN) link budget analytics into a unified, interactive mission control workspace.

---

## Multidisciplinary Team Roster

**Organization:** **CFSBR SpaceWeb**  
*(Under the Centre for Fintech & Strategic Business Research — CFSBR)*

| # | Name | Academic Background | Project Role & Focus Area |
|:---|:---|:---|:---|
| **1** | **Md Golam Mubasshir Rafi** | `Finance` | **Team Lead**<br>• Product Architecture & Mission Strategy<br>• MCDA Techno-Economic Feasibility Modeling |
| **2** | **Afshara Tasneem Zoa** | `Computer Science & Engineering` | **Co-Lead**<br>• Scientific Research & Systems Strategy<br>• Artemis Mission Case Architecture |
| **3** | **Kaiba Hasnat** | `Electrical & Electronic Engineering` | **Core Contributor**<br>• Avionics Interface & Telemetry UI<br>• Aerospace Cockpit Experience |
| **4** | **Labiba Mahzabin** | `Computer Science & Engineering` | **Core Contributor**<br>• Planetary GIS & Data Engineering<br>• LOLA DEM Data Ingestion & Spatial Indexing |
| **5** | **Nafiz Akib Khan** | `Electrical & Electronic Engineering` | **Core Contributor**<br>• Power Budgeting & Feasibility Modeling<br>• Solar Grazing & Battery Sizing Simulations |
| **6** | **Nishat Jahan Nowshin** | `Computer Science & Engineering` | **Core Contributor**<br>• Mission Communications & Public Outreach<br>• Documentation & Science Engagement |

---

## NASA Challenge Focus: CLPS Lunar Mission Browser

| Dimension | Specification |
| :--- | :--- |
| **Challenge Track** | NASA Space Apps Challenge 2026 — CLPS Lunar Mission Browser |
| **Target Geography** | Lunar South Pole Region ($\text{Lat: } -80^\circ \text{ to } -90^\circ\text{S}$) |
| **Primary Artemis Sites** | Malapert Mountain Massif, Shackleton Crater Rim, Connecting Ridge, Peak of Eternal Light (de Gerlache Rim), Haworth Crater Rim, Faustini Rim A |
| **Telemetry Resolution** | Continuous 1-hour time-steps across 24h, 7-day, and 14-day (1 full Lunar Day) mission horizons |
| **Physical Models** | Solar insolation with dust attenuation, 360° topographic skyline masking, DSN 34m 8.4 GHz X-Band RF link budgets |

---

## Scientific Architecture & Mathematical Models

### 1. Topocentric Celestial Coordinate Transformation
Selenographic sub-solar $(\phi_\odot, \lambda_\odot)$ and sub-Earth $(\phi_\oplus, \lambda_\oplus)$ coordinates are derived directly from the high-precision DE440/DE441-compatible ephemeris engine (`astronomy-engine`). Topocentric elevation angle ($\theta_{\text{elev}}$) and azimuth ($\alpha$) relative to an observer at lunar latitude $\phi_1$ and longitude $\lambda_1$ are computed via the spherical law of cosines:

$$\sin(\theta_{\text{elev}}) = \sin(\phi_1)\sin(\phi_2) + \cos(\phi_1)\cos(\phi_2)\cos(\lambda_2 - \lambda_1)$$

$$\alpha = \operatorname{atan2}\Big(\sin(\Delta\lambda)\cos(\phi_2),\; \cos(\phi_1)\sin(\phi_2) - \sin(\phi_1)\cos(\phi_2)\cos(\Delta\lambda)\Big)$$

### 2. 360° LOLA Digital Elevation Model (DEM) Horizon Profiler
Synthetic and rasterized DEM profiles extract the maximum elevation angle of surrounding crater rims across all $360^\circ$ azimuths ($\mathcal{H}_{\text{topo}}(\alpha)$). A celestial target is unobstructed if and only if:

$$\theta_{\text{elev, target}} > \mathcal{H}_{\text{topo}}(\alpha_{\text{target}})$$

### 3. Solar Photovoltaic Generation Model
Models multi-junction GaAs solar arrays (nominal 30% efficiency) accounting for low-elevation grazing angles, cosine projection factors, and lunar regolith dust deposition factors ($\delta_{\text{dust}} = 0.92$):

$$P_{\text{net}} = S_0 \cdot A_{\text{array}} \cdot \eta_{\text{cell}} \cdot \delta_{\text{dust}} \cdot \cos(\theta_{\text{inc}}) \cdot \mathbb{I}_{\text{cleared}}$$

Where $S_0 = 1361 \text{ W/m}^2$ (AM0 solar constant) and $\mathbb{I}_{\text{cleared}} \in \{0, 1\}$ is the binary topographic clearance flag.

### 4. Direct-to-Earth (DTE) DSN RF Link Budget
Evaluates 8.45 GHz X-Band transmissions from CLPS landers (15W HPA, 0.5m parabolic high-gain antenna) to NASA Deep Space Network (DSN) 34m aperture ground stations (Goldstone, Madrid, Canberra):

$$\text{FSPL} = 20\log_{10}(d_{\text{km}}) + 20\log_{10}(f_{\text{MHz}}) + 32.44 \approx 216.5 \text{ dB}$$

$$\text{Margin}_{\text{dB}} = \text{EIRP} - \text{FSPL} + (G/T)_{\text{ground}} - k_{\text{Boltz}} - R_{\text{data}} - (E_b/N_0)_{\text{req}}$$

---

## Alignment with UN Sustainable Development Goals (SDGs)

SelenSync bridges space exploration technology with global sustainability challenges:

| SDG Indicator | Focus & Project Alignment |
|:---|:---|
| **SDG 7: Affordable & Clean Energy** | Advanced solar irradiance and storage optimization models designed for extreme lunar environments provide dual-use insights for microgrid resilience and off-grid solar forecasting on Earth. |
| **SDG 9: Industry, Innovation & Infrastructure** | Open-access planetary data infrastructure and high-precision telemetry engines lowering the barrier of entry for emerging space nations and academic institutions. |
| **SDG 17: Partnerships for the Goals** | Fosters multidisciplinary collaboration between business, engineering, and data science, utilizing open NASA/LRO datasets to advance international lunar scientific cooperation. |

---

## Key Platform Features

### 1. Slide Presenter & Interactive Showcase Mode
- Single-viewport slide navigation with integrated keyboard shortcuts (`ArrowDown` / `ArrowUp` / `PageDown` / `PageUp`) and minimal floating control pill for judging presentations.

### 2. 360° Fish-Eye Topographic Horizon Polar Plot
- Circular polar radar visualization displaying cardinal headings (N, E, S, W), elevation concentric rings ($10^\circ, 30^\circ, 60^\circ$), crater obstacle skyline mask, and live Sun/Earth positions with color-coded line-of-sight status indicators.

### 3. Dynamic Multi-Day Timeline Scrubber
- Interactive slider supporting 24-hour, 7-day, and 14-day simulation windows. Includes real-time auto-play capabilities to animate solar traverses and Earth libration cycles.

### 4. Dual-Pane Mission Control Workspace
- Side-by-side comparative analysis of candidate landing sites with interactive MCDA scoring, slope hazards, and communications windows.

### 5. Afshara — AI Lunar Mission Strategist
- AI reasoning assistant specialized in NASA Artemis, CLPS architectures, cryogenic survival strategies, power storage sizing, and South Pole terrain hazards.

---

## Technology Stack

- **Frontend & App Architecture**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI Components**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Ephemeris Engine**: `astronomy-engine` (High-precision DE440/DE441 planetary coordinates)
- **Data Visualization**: [Recharts](https://recharts.org/) & Custom SVG Polar Projection Canvas
- **Geospatial Mapping**: [Mapbox GL JS](https://www.mapbox.com/) 3D Globe Projection
- **Deployment**: [Vercel](https://vercel.com/)

---

## Getting Started Locally

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

## NASA Space Apps Challenge 2026

*Developed by **CFSBR SpaceWeb** • Centre for Fintech & Strategic Business Research (CFSBR)*  
*Team Lead: **Md Golam Mubasshir Rafi***  
*Co-Lead: **Afshara Tasneem Zoa***

