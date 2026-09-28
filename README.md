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

## Official NASA & JPL Data Sources (Data Provenance)

SelenSync exclusively integrates official NASA, JPL, and USGS planetary scientific datasets to ensure mission-critical telemetry accuracy:

| Dataset / Mission Source | Scientific Purpose & Provenance | Technical Details |
| :--- | :--- | :--- |
| **JPL Horizons Ephemeris DE440/DE441, NASA SPICE & IAU WGCCRE** | High-precision astrodynamics ephemeris engine | Sub-solar $(\phi_\odot, \lambda_\odot)$ bounded by Moon's $1.543^\circ$ obliquity, sub-Earth $(\phi_\oplus, \lambda_\oplus)$, topocentric parallax, and optical/physical libration $(\Delta\lambda, \Delta\beta)$ computed via Astronomy Engine. |
| **NASA LRO LOLA (Lunar Orbiter Laser Altimeter)** | 128 ppd Polar DEM (~237m/px) | Horizon obstacle angle extraction ($\mathcal{H}_{\text{topo}}(\alpha)$), slope hazard assessment, and 360° terrain mask occlusion. |
| **NASA LRO Diviner (DLRE)** | Lunar Radiometer Experiment thermal data | Regolith cryogenic thermal equilibrium ($40\text{ K}$ in PSR cold-traps to $235\text{ K}$ during grazing illumination), avionics bay cooling, and survival heater drawdowns. |
| **NASA Deep Space Network (DSN) 810-007** | Deep-space telecommunications standards | Antenna gains ($+68\text{ dBi}$ for 34m Beam Waveguide, $+74.2\text{ dBi}$ for 70m), free-space path loss (FSPL), system noise temperatures ($120\text{ K}$), and station handover cycles across Goldstone (DSS-24/14), Madrid (DSS-65/63), and Canberra (DSS-34/43). |
| **NASA CLPS Commercial Lander Specifications** | Flight vehicle physical configurations | Exact dry mass, payload capacity, GaAs 30% solar array area, battery capacity (Wh), and RF transceiver wattage for Nova-C, Griffin, Blue Ghost, and APEX 1.0. |

---

## Scientific Architecture & Mathematical Models

### 1. Topocentric Celestial Coordinate Transformation (IAU / DE440 Model)
Selenographic sub-solar $(\phi_\odot, \lambda_\odot)$ coordinates are derived directly from the vector projection of the Sun's position vector onto the Moon's principal axes of inertia defined by the IAU/IAG Working Group on Cartographic Coordinates and Rotational Elements (WGCCRE). Because the Moon's obliquity to the ecliptic is strictly $1.543^\circ$, subsolar latitude is strictly bounded within $[-1.543^\circ, +1.543^\circ]$. Topocentric elevation angle ($\theta_{\text{elev}}$) and azimuth ($\alpha$) relative to an observer at lunar latitude $\phi_{\text{site}}$ and longitude $\lambda_{\text{site}}$ are computed via:

$$\sin(\theta_{\text{elev}}) = \sin(\phi_{\text{site}})\sin(\phi_\odot) + \cos(\phi_{\text{site}})\cos(\phi_\odot)\cos(\lambda_\odot - \lambda_{\text{site}})$$

$$\alpha = \operatorname{atan2}\Big(\sin(\Delta\lambda)\cos(\phi_\odot),\; \cos(\phi_{\text{site}})\sin(\phi_\odot) - \sin(\phi_{\text{site}})\cos(\phi_\odot)\cos(\Delta\lambda)\Big)$$

### 2. 360° LOLA Digital Elevation Model (DEM) Horizon Profiler
Synthetic and rasterized DEM profiles extract the maximum elevation angle of surrounding crater rims across all $360^\circ$ azimuths ($\mathcal{H}_{\text{topo}}(\alpha)$). A celestial target is unobstructed if and only if:

$$\theta_{\text{elev, target}} > \mathcal{H}_{\text{topo}}(\alpha_{\text{target}})$$

Distinct occlusion states are strictly differentiated:
- **`SUN_BELOW_HORIZON`**: Geometric night ($\theta_{\text{elev}} \le 0^\circ$).
- **`TERRAIN_MASKED`**: Geometric day, but occluded by local crater rims / massifs ($\theta_{\text{elev}} \le \mathcal{H}_{\text{topo}}(\alpha)$).
- **`UNOBSTRUCTED`**: Clear line-of-sight ($\theta_{\text{elev}} > \mathcal{H}_{\text{topo}}(\alpha)$).

### 3. Solar Photovoltaic Generation Model & Strict Shadow Boundary
Models multi-junction GaAs solar arrays (nominal 30% efficiency) accounting for low-elevation grazing angles, cosine projection factors, lunar regolith dust deposition factors ($\delta_{\text{dust}} = 0.95$), and a cubic smoothstep solar limb emergence fraction ($f_{\text{disk}} \in [0, 1]$ over the Sun's $0.53^\circ$ finite angular diameter):

$$P_{\text{net}} = \begin{cases} 0 \text{ W}, & \text{if } \theta_{\text{elev}} \le 0^\circ \text{ or } \delta_{\text{elev}} \le -0.265^\circ \\ S_0 \cdot A_{\text{array}} \cdot \eta_{\text{cell}} \cdot \delta_{\text{dust}} \cdot \cos(\theta_{\text{inc}}) \cdot f_{\text{disk}}, & \text{otherwise} \end{cases}$$

Where $S_0 = 1361 \text{ W/m}^2$ (AM0 solar constant) and effective solar flux strictly equals $0 \text{ W/m}^2$ when in shadow, eliminating unphysical ghost power or phantom flux. The cubic smoothstep factor $f_{\text{disk}}$ models realistic penumbral limb emergence over the $0.53^\circ$ solar disk during sunrise/sunset over crater rims.

### 4. Direct-to-Earth (DTE) DSN RF Link Budget
Evaluates 8.45 GHz X-Band transmissions from CLPS landers (20W HPA, 0.6m parabolic high-gain antenna) to NASA Deep Space Network (DSN) 34m aperture ground stations (Goldstone, Madrid, Canberra):

$$\text{FSPL} = 20\log_{10}(d_{\text{km}}) + 20\log_{10}(f_{\text{GHz}}) + 92.45 \approx 222.7 \text{ dB}$$

$$\text{Margin}_{\text{dB}} = \text{EIRP} - \text{FSPL} + (G/T)_{\text{ground}} - k_{\text{Boltz}} - R_{\text{data}} - (E_b/N_0)_{\text{req}}$$

---

## Newly Implemented Advanced Features

### 1. Multi-Site & Multi-Date Feasibility Matrix (Core Requirement)
- **Dual Independent Epoch Pickers:** Compare Site A vs Site B at two completely independent mission dates, or compare 1 single site across two contrasting seasons (e.g., Southern Summer Solstice vs Southern Winter Solstice).
- **One-Click Astronomical Presets:** Instant selection of Solstice 2026 and Equinox 2026 epochs to evaluate extreme lighting and communications conditions.
- **Comparative Delta ($\Delta$) Metrics:** Real-time computation of sun elevation difference ($\Delta^\circ$), electrical power output delta ($\Delta\text{W}$), and DTE link margin variation ($\Delta\text{dB}$).
- **Interactive Raw JSON Inspector:** Collapsible JSON viewer allowing NASA judges to inspect live computed payloads against official JPL DE440 and LOLA datasets.

### 2. Information Density Layering & Progressive Disclosure
- **Aerospace Visual Hierarchy:** Telemetry cards spotlight the primary 2-3 mission numbers in high-contrast bold typography for rapid situational awareness.
- **Collapsible Deep Engineering Drawers:** Deeper secondary parameters (solar flux, solar azimuth, GaAs cell parameters, FSPL attenuation, libration angles, ground station handover countdowns, slope tip-over risk, time-to-freeze) are organized in collapsible `<details>` panels.

### 3. CLPS Aerospace Glossary & Public/Educator Accessibility Layer
- **Interactive Field Guide Modal:** Accessible via the top HUD bar (`Guide` button) and interactive info triggers across all telemetry cards.
- **Bilingual Plain-English Summaries:** Educational breakdowns for students and non-technical judges explaining:
  - *PSR (Permanently Shadowed Regions)* and ancient water ice reserves.
  - *DTE (Direct-to-Earth)* microwave line-of-sight physics.
  - *Lunar Libration* wobble mechanics and communication blackout triggers.
  - *GaAs Multi-Junction* solar cell efficiency under grazing angles.
  - *Diviner Cold Traps* and cryogenic survival heater drawdowns.
  - *LOLA Laser Altimetry* for terrain obstacle and slope hazard analysis.
  - *RF Link Margin* safety thresholds ($> +3.0\text{ dB}$).

### 4. 1-Click Mission Plan & Telemetry Export
- **Structured JSON Manifest Download:** Generates and downloads a complete, verified mission telemetry manifest conforming to NASA Space Apps standards (`SelenSync-MissionPlan-[site]-[date].json`).
- **Executive Flight Briefing Print:** Native browser print engine formatting for flight director mission briefing reports.

### 5. Responsive Aerospace Console (Mobile, Tablet & Desktop)
- **Zero-Scroll Presentation Console:** Preserved on desktop screens ($\ge 1024\text{px}$) for professional aerospace flight room displays.
- **Mobile & Tablet Portrait Optimization:** Smooth vertical natural scrolling (`overflow-y-auto`) prevents container clipping on mobile screens (360px-768px) and portrait tablets (640px-1024px), paired with a responsive sticky timeline scrubber drawer.

---

## Alignment with UN Sustainable Development Goals (SDGs)

SelenSync bridges space exploration technology with global sustainability challenges:

| SDG Indicator | Focus & Project Alignment |
|:---|:---|
| **SDG 7: Affordable & Clean Energy** | Advanced solar irradiance and storage optimization models designed for extreme lunar environments provide dual-use insights for microgrid resilience and off-grid solar forecasting on Earth. |
| **SDG 9: Industry, Innovation & Infrastructure** | Open-access planetary data infrastructure and high-precision telemetry engines lowering the barrier of entry for emerging space nations and academic institutions. |
| **SDG 17: Partnerships for the Goals** | Fosters multidisciplinary collaboration between business, engineering, and data science, utilizing open NASA/LRO datasets to advance international lunar scientific cooperation. |

---

## Technology Stack

- **Frontend & App Architecture**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI Components**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Astrodynamics & Ephemeris Engine**: `astronomy-engine` (High-precision DE440/DE441 planetary kinematics & NASA SPICE / IAU rotational frame models)
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
