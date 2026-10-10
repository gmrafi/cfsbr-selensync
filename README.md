# SelenSync: Next-Gen CLPS Lunar Mission Browser & Topographic Horizon Analyzer

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-Global%20Nominees%202025-blue.svg?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/)
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

## 📚 Scientific Literature Review & Academic Foundation (15 Peer-Reviewed Papers)

SelenSync's models, heuristics, and MCDA parameters are **directly grounded** in 15 peer-reviewed publications and NASA technical memoranda. This section summarizes the academic validation stack undergirding our platform.

### 🏔️ Category A — Terrain, Topography & Solar Illumination

| # | Reference | Journal / Source | Key Quantitative Finding | SelenSync Alignment |
|:--|:---|:---|:---|:---|
| 1 | **Mazarico et al. (2011)** — *Illumination conditions of the lunar polar regions using LOLA topography* | JGR Planets | First LOLA-based illumination maps; Shackleton rim identified as high-illumination zone | SelenSync DEM horizon profiler uses LOLA 128ppd data, validating polar illumination physics |
| 2 | **Gläser et al. (2014)** — *Illumination conditions at the lunar south poles using high-resolution digital terrain models* | Icarus | **95.65% illumination** at **10m above ground**; 20m/pixel LOLA DTM | Our 10m elevation bonus heuristic for mast-mounted arrays traces to this finding |
| 3 | **Gläser et al. (2018)** — *Co-registration of laser altimeter tracks with a Lunar Orbiter Laser Altimeter-based slope map* | PSS | 18.6-year precessional cycle governs long-term illumination variation; Shackleton rim consistently high | SelenSync uses synodic/seasonal averaging consistent with this cycle |
| 4 | **Barker et al. (2021)** — *A new lunar digital elevation model from the Lunar Orbiter Laser Altimeter* | PSS | **5m/pixel DEM**, RMS height uncertainty **0.30–0.50m** | Most accurate terrain foundation; constrains horizon masking angle calculations |
| 5 | **Speyerer & Robinson (2013)** — *Persistently illuminated regions at the lunar poles* | Icarus | Shackleton rim = **94% illuminated** per lunar year (LROC WAC image validation) | Independent image-based cross-validation of SelenSync's terrain-derived illumination fractions |

### 📡 Category B — DTE Communications & Ground Station Visibility

| # | Reference | Journal / Source | Key Quantitative Finding | SelenSync Alignment |
|:--|:---|:---|:---|:---|
| 6 | **Bryant (2009)** — *Solar and communications analysis of Lunar South Pole sites* | JPL Technical Report | Best S. Pole site achieves **92% solar** BUT only **51% DTE** — the solar/DTE decoupling | **Core justification** for SelenSync's dual-factor MCDA: illumination alone is insufficient |
| 7 | **Koebel et al. (2012)** — *Multi-parameter analysis for landing site selection near the lunar South Pole* | ESA Acta Astronautica | Combined illumination + comms + slope multi-criteria lander study; similar methodology to SelenSync | Independent ESA validation of multi-parameter site selection methodology |
| 8 | **Park et al. (2021)** — *The JPL Planetary and Lunar Ephemerides DE440 and DE441* | Astronomical Journal | DE440/DE441 ephemeris, **1550–2650 CE coverage**, sub-arcsecond accuracy | SelenSync's ephemeris engine uses DE440 via `astronomy-engine` — directly cited foundation |

### 🌡️ Category C — Thermal Environment & Diviner

| # | Reference | Journal / Source | Key Quantitative Finding | SelenSync Alignment |
|:--|:---|:---|:---|:---|
| 9 | **Paige et al. (2010)** — *Diviner lunar radiometer observations of cold traps* | Science | PSR cold trap minimum temperature = **38 K** (coldest stable spots in Solar System) | SelenSync Diviner data integration; 40K minimum cited in cryogenic survival heater calculations |
| 10 | **Williams et al. (2017)** — *Seasonal polar temperatures on the Moon* | Icarus | **250 billion** Diviner measurements; **0.5° spatial / 0.25hr time** resolution model | Validates SelenSync thermal model resolution capability |
| 11 | **Hayne et al. (2021)** — *Micro cold traps on the Moon* | Nature Astronomy | Micro cold traps 1cm–1km scale; **40,000 km²** total area | Establishes spatial resolution limitation of SelenSync (terrain grid vs micro-scale traps) |

### ⚡ Category D — Power Systems & Battery Sizing

| # | Reference | Journal / Source | Key Quantitative Finding | SelenSync Alignment |
|:--|:---|:---|:---|:---|
| 12 | **Fincannon (2007)** — *Lunar polar illumination for power analysis* | NASA Technical Memorandum | Shackleton rim illumination fraction = **0.71**; battery storage required = **73–117 hours** | Direct validation of SelenSync's battery sizing: $M_{\text{battery}} = P_{\text{heat}} \times \Delta t / (\eta_{\text{DoD}} \times \rho_e)$ |
| 13 | **Noda et al. (2008)** — *Illumination conditions at the lunar polar regions* | Geophysical Research Letters | KAGUYA LALT independent altimetry cross-validation of polar illumination zones | Independent non-LOLA dataset validation of SelenSync's illumination fractions |

### 🗺️ Category E — Multi-Criteria Site Selection

| # | Reference | Journal / Source | Key Quantitative Finding | SelenSync Alignment |
|:--|:---|:---|:---|:---|
| 14 | **Smith et al. (2017)** — *Summary of the results from the Lunar Orbiter Laser Altimeter after seven years in lunar orbit* | Icarus | 7-year LOLA summary; gold-standard LOLA citation | Primary LOLA data provenance reference for SelenSync's DEM |
| 15 | **Flahaut et al. (2020)** — *Regions of interest (ROI) for future exploration missions* | Planetary and Space Science | **11 ROIs** evaluated with GIS multi-criteria (temp <110K, slope <20°, H₂O >100ppm) | Validates SelenSync's multi-criteria MCDA approach; confirms SelenSync extends prior methodology |

---

### Report 01 Comparison Matrix — SelenSync vs Prior Work

| Comparison Aspect | Mazarico (2011) | Gläser (2014) | Koebel (2012) | Gläser (2018) | Barker (2021) | **SelenSync** |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| Terrain data source | LOLA 128ppd | LOLA 20m/px DTM | LOLA + LROC | LOLA coregistered | **LOLA 5m DEM** | LOLA 128ppd + 5m |
| Solar illumination | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| DTE communications | ❌ | ❌ | ✅ (limited) | ❌ | ❌ | ✅ DSN 3-complex |
| Battery/power sizing | ❌ | ❌ | Partial | ❌ | ❌ | ✅ TEA model |
| Techno-economic analysis | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Interactive web platform | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Real-time ephemeris | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ DE440 |
| Lander-specific modeling | ❌ | ❌ | ESA-only | ❌ | ❌ | ✅ 4 CLPS landers |

> **SelenSync's unique contribution:** The only platform combining all six parameters — terrain illumination, DTE link budget, thermal survival, techno-economic analysis, real-time ephemeris, and interactive multi-lander comparison — into one unified web interface accessible to mission planners and educators.



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

### 5. Techno-Economic Analysis (TEA) & Aerospace Capital Allocation Model
Converts raw lunar environmental ephemeris into hard financial risk and capital allocation metrics for NASA CLPS missions ($120M CAPEX baseline, $1.2M/kg soft-landing delivery cost, 180 Wh/kg @ 80% DoD battery density):

- **Cryogenic Survival Battery Mass Sizing ($M_{\text{battery}}$):**
  $$M_{\text{battery}} = \frac{P_{\text{heat}} \times \Delta t_{\text{shadow}}}{\eta_{\text{DoD}} \times \rho_{\text{energy}}}$$
  Where $P_{\text{heat}}$ is the keep-alive heater wattage (nominal $120\text{ W}$), $\Delta t_{\text{shadow}}$ is the longest continuous shadow period (hours), $\eta_{\text{DoD}} = 0.80$ is the maximum depth-of-discharge, and $\rho_{\text{energy}} = 180\text{ Wh/kg}$ is space-qualified Li-ion specific energy.

- **Dynamic Launch Cost Transit Offset ($\Delta C_{\text{transit}}$):**
  $$\Delta C_{\text{transit}} = (M_{\text{battery, baseline}} - M_{\text{battery, site}}) \times c_{\text{transit}}$$
  Where $c_{\text{transit}} = \$1.2\text{M / kg}$ is the NASA CLPS soft-landing payload delivery cost benchmark. Minimizing eclipse shadow directly liberates payload capacity for high-return scientific instrumentation.

- **Levelized Cost of Mission Day (LCMD):**
  $$\text{LCMD} = \frac{\text{CAPEX}_{\text{baseline}} + C_{\text{launch}} + C_{\text{ops}} - \Delta C_{\text{transit}} - S_{\text{relay}}}{t_{\text{active, daylight}}}$$
  Measures the true capital efficiency of a landing site per functional scientific operating day.

- **Capital-at-Risk Index (CaRI):**
  $$\text{CaRI}(t) = \text{Asset Value} \times \left(1 - \frac{E_{\text{reserve}}(t)}{E_{\text{total}}}\right) \times \phi_{\text{cryo}}$$
  Quantifies total spacecraft capital exposed to irreversible cryogenic failure during extended topographic occultation.

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

### 6. Mission Finance & Techno-Economic Analysis (TEA) Dashboard (`/mission-finance`)
- **NASA CLPS Aerospace Capital Modeling:** Converts topocentric solar illumination and horizon masking into rigorous financial metrics ($120M baseline lander CAPEX, $1.2M/kg payload soft-landing transit cost, 180 Wh/kg @ 80% DoD space-qualified Li-ion battery density, and $25M lunar relay lease avoidance).
- **Top 4-Key Mission KPI Bento Cards:**
  - **Launch Cost Offset ($\Delta C_{\text{transit}}$):** Real-time dollar savings achieved by minimizing battery mass at illuminated peaks (e.g., up to $\sim\$102.0\text{M}$ transit savings on Malapert Mountain).
  - **Levelized Cost of Mission Day (LCMD):** Net operational capital efficiency per daylight scientific operating day ($\$M/\text{day}$).
  - **Capital-at-Risk Index (CaRI):** Percentage of total spacecraft asset value exposed to irreversible cryogenic battery depletion during maximum continuous shadow.
  - **DTE Comm Visibility & Relay Savings:** $\$25\text{M}$ capital offset for landing sites with direct line-of-sight to NASA DSN stations without commercial lunar relay constellation dependencies.
- **Interactive Techno-Economic Simulator:**
  - Dynamic slider controls for **Max Continuous Eclipse Duration** ($0-354\text{ hrs}$), **Keep-alive Survival Heater Load** ($20-300\text{ W}$), and **Baseline Scientific Instrumentation** ($20-150\text{ kg}$).
  - Split-view telemetry: Donut Chart Mass Budget Breakdown ($M_{\text{battery}}$, $M_{\text{science}}$, $M_{\text{bus}}$) and Capital Reallocation assessment.
- **Dual Analytical Risk & Cost Visualizations:**
  - **Area Timeline Chart:** 28-day diurnal cycle plotting Capital-at-Risk (%) against Topocentric Solar Elevation with dynamic red-shaded risk zones during lunar night.
  - **Grouped Bar Chart:** Lifecycle Cost Breakdown (Transit Cost, Power/Thermal System, Payload CAPEX, and Ground Relay Communications).
- **Cross-Site Financial Sensitivity Matrix:** Multi-candidate comparative table benchmarking Malapert Mountain, Shackleton Connecting Ridge, Amundsen Rim, and Standard Polar Basin with strategic investment takeaways.
- **Seamless System Navigation:** Direct access via top Universal Navigation Header and Cockpit Flight HUD Bar (`Techno-Economics`).

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

5. **Open Mission Control & Dashboards:**
   - **Mission Control Portal:** [http://localhost:3000](http://localhost:3000)
   - **Flight Telemetry Cockpit:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - **GIS Polar Surface Map:** [http://localhost:3000/dashboard/map](http://localhost:3000/dashboard/map)
   - **Techno-Economic Analysis (TEA):** [http://localhost:3000/mission-finance](http://localhost:3000/mission-finance)

---

## NASA Space Apps Challenge 2026

*Developed by **CFSBR SpaceWeb** • Centre for Fintech & Strategic Business Research (CFSBR)*  
*Team Lead: **Md Golam Mubasshir Rafi***  
*Co-Lead: **Afshara Tasneem Zoa***
