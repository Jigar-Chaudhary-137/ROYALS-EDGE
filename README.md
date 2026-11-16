# ROYAL SCOUT
## Rajasthan Royals | SupeRR Selector Season 2 | IPL 2027 Auction Intelligence

**ROYAL SCOUT** is an interactive, professional cricket analytics platform and machine learning decision engine engineered for Rajasthan Royals' SupeRR Selector Season 2 competition.

The platform analyzes **200,999 deliveries across 883 matches** (IPL seasons 2022–2026 and ICC T20 Internationals) to identify, quantify, and rank the **Top 10 most reliable batters and bowlers under high match pressure**.

---

## 🏆 Final Competition Rankings

### Official Top 10 Batters Under Pressure (Rank 1 to 10)
| Rank | Player Name | Team / Affiliation | Pressure Balls | Pressure Runs | Pressure Avg | Pressure SR | Career Norm SR | SR Delta | Boundary % | Final Pressure Rating |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Rinku Singh** | Kolkata Knight Riders / India | 167 | 377 | **125.67** | **225.75** | 152.68 | **+73.07** | 37.13% | **97.01 / 100** |
| **2** | **Tim David** | Royal Challengers / Australia | 248 | 525 | **40.38** | **211.69** | 177.65 | **+34.04** | 30.65% | **69.16 / 100** |
| **3** | **David Miller** | Delhi Capitals / South Africa | 109 | 246 | **41.00** | **225.69** | 149.30 | **+76.39** | 33.03% | **62.27 / 100** |
| **4** | **MS Dhoni** | Chennai Super Kings / India | 182 | 335 | **30.45** | **184.07** | 149.68 | **+34.39** | 28.02% | **60.78 / 100** |
| **5** | **Ravindra Jadeja** | Rajasthan Royals / India | 168 | 285 | **40.71** | **169.64** | 135.07 | **+34.57** | 21.43% | **59.56 / 100** |
| **6** | **Rashid Khan** | Gujarat Titans / Afghanistan | 236 | 445 | **21.19** | **188.56** | 156.02 | **+32.54** | 28.39% | **58.11 / 100** |
| **7** | **Tilak Varma** | Mumbai Indians / India | 159 | 285 | **28.50** | **179.25** | 142.98 | **+36.27** | 24.53% | **57.45 / 100** |
| **8** | **Rovman Powell** | Kolkata Knight Riders / West Indies | 211 | 381 | **21.17** | **180.57** | 146.76 | **+33.81** | 25.59% | **57.13 / 100** |
| **9** | **Shubham Dubey** | Rajasthan Royals / India | 47 | 105 | **52.50** | **223.40** | 153.85 | **+69.55** | 31.91% | **56.10 / 100** |
| **10** | **Rahul Tewatia** | Gujarat Titans / India | 158 | 280 | **21.54** | **177.22** | 149.05 | **+28.17** | 27.22% | **55.67 / 100** |

---

### Official Top 10 Bowlers Under Pressure (Rank 1 to 10)
| Rank | Bowler Name | Team / Affiliation | Pressure Overs (Legal Balls) | Wickets | Pressure Econ | Career Norm Econ | Econ Delta (RPO) | Balls / Wicket | Dot Ball % | Final Pressure Rating |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Rashid Khan** | Gujarat Titans / Afghanistan | 41.3 (249) | **29** | **6.87** | 7.43 | **+0.56** | 8.59 | 41.37% | **72.13 / 100** |
| **2** | **Jasprit Bumrah** | Mumbai Indians / India | 35.0 (210) | **19** | **6.51** | 7.27 | **+0.76** | 11.05 | 42.38% | **70.32 / 100** |
| **3** | **Mustafizur Rahman** | Kolkata Knight Riders / Bangladesh | 38.3 (231) | **22** | **6.91** | 7.79 | **+0.88** | 10.50 | 45.45% | **69.91 / 100** |
| **4** | **Abrar Ahmed** | Pakistan (International) | 13.5 (83) | **7** | **3.69** | 6.68 | **+2.99** | 11.86 | 57.83% | **69.01 / 100** |
| **5** | **Varun Chakravarthy** | Kolkata Knight Riders / India | 30.4 (184) | **19** | **7.27** | 7.99 | **+0.72** | 9.68 | 45.65% | **68.81 / 100** |
| **6** | **Yuzvendra Chahal** | Punjab Kings / India | 24.0 (144) | **22** | **7.46** | 8.62 | **+1.16** | 6.55 | 40.97% | **66.11 / 100** |
| **7** | **Shaheen Afridi** | Pakistan (International) | 27.5 (167) | **15** | **7.44** | 8.01 | **+0.57** | 11.13 | 35.93% | **62.54 / 100** |
| **8** | **Kuldeep Yadav** | Delhi Capitals / India | 16.4 (100) | **18** | **6.54** | 8.02 | **+1.48** | 5.56 | 52.00% | **60.72 / 100** |
| **9** | **Maheesh Theekshana** | Rajasthan Royals / Sri Lanka | 25.2 (152) | **13** | **7.54** | 7.77 | **+0.23** | 11.69 | 40.79% | **59.73 / 100** |
| **10** | **Sufiyan Muqeem** | Pakistan (International) | 13.3 (81) | **10** | **5.93** | 6.00 | **+0.07** | 8.10 | 56.79% | **58.11 / 100** |

---

## ⚡ One-Command Application Launcher (Primary Experience)

ROYAL SCOUT features a unified, automated launcher that prepares all dependencies, verifies competition datasets, starts backend & frontend services, checks system health, and automatically opens your browser.

### 🚀 Production Mode (Single-Port Integrated Experience)
Open the project root folder in terminal and execute:

```bash
npm run start
```
*Or double-click `start.bat` on Windows.*

The launcher executes an 8-stage verification pipeline:
```text
==================================================
             ROYAL SCOUT
      Cricket Intelligence Platform
 Rajasthan Royals | SupeRR Selector Season 2
==================================================

[1/8] Checking system requirements...
[2/8] Checking Python environment...
[3/8] Checking Node.js dependencies...
[4/8] Loading environment configuration...
[5/8] Checking dataset availability...
[6/8] Starting FastAPI backend...
[7/8] Verifying production frontend build...
[8/8] Checking application health...

==================================================
          ROYAL SCOUT IS READY!
==================================================

  Backend API:        http://127.0.0.1:8000
  API Documentation:  http://127.0.0.1:8000/docs
  Application:        http://localhost:8000

==================================================
Opening ROYAL SCOUT in your browser...
==================================================
```

### 🛠️ Development Mode (FastAPI + Vite Hot Reloading)
For live frontend code editing with hot module replacement (HMR):

```bash
npm run dev
```
- **Backend API:** `http://127.0.0.1:8000`
- **Frontend Dev Server:** `http://localhost:5173` (with `/api` and `/players` proxy to backend)

### 🛑 Clean Shutdown
To stop the application and cleanly release ports (8000 and 5173):
- Press `Ctrl+C` in the running launcher terminal, or
- Run `npm run stop` from any terminal window.

---

## 📁 Project Architecture & Structure

```text
ROYALS-EDGE/
│
├── backend/                                # FastAPI Analytical Backend
│   ├── app.py                              # REST API Server, Health Probe & Static SPA Server
│   ├── analytics.py                        # Cricket Analytics & Bayesian Shrinkage Engine
│   ├── pressure_engine.py                  # Vectorized Match Pressure Index (MPI)
│   ├── pdf_generator.py                    # 9-Page Publication-Grade PDF Generator
│   ├── data_validator.py                   # Competition Dataset Validation & ZIP Extraction
│   ├── exports.py                          # CSV Exports & Submission Pack ZIP Generator
│   └── requirements.txt                    # Pinned Python Dependencies
│
├── frontend/                               # React + Vite Premium Frontend
│   ├── src/
│   │   ├── components/                     # Sidebar, Navbar, GlobalSearch, Podium, PlayerImage
│   │   ├── pages/                          # Overview, Batters, Bowlers, Profiles, Comparison, etc.
│   │   ├── utils/                          # playerImages.js (Image Registry & Color System)
│   │   ├── api.js                          # Unified Backend API Client
│   │   └── App.jsx                         # Main 10-Route Application Frame
│   ├── public/players/                     # Verified High-Resolution Player Portraits
│   ├── package.json                        # Frontend Dependencies (Tailwind, Lucide, Recharts)
│   └── vite.config.js                      # Vite Configuration with API Proxy
│
├── data/                                   # Official Competition Datasets
│   ├── ball_by_ball.csv                    # 200,999 Deliveries (2022–2026)
│   ├── matches.csv                         # 883 Matches
│   ├── competitions.csv                    # 141 Competitions
│   ├── teams.csv                           # 353 Teams
│   ├── playing_eleven.csv                  # Playing Elevens & Lineups
│   ├── competition_team_player_mapping.csv # 1,217 Player Affiliations
│   └── royal_scout_cache.pkl               # High-Performance Analytical Cache
│
├── exports/                                # Official Competition Deliverables
│   ├── ROYAL_SCOUT_Methodology_Report.pdf  # Verified 9-Page PDF Report
│   ├── ROYAL_SCOUT_SUBMISSION_PACK.zip     # Master Submission Pack
│   ├── top_10_batters.csv                  # Official Top 10 Batters Tabular Data
│   ├── top_10_bowlers.csv                  # Official Top 10 Bowlers Tabular Data
│   ├── all_batters_rankings.csv            # Full Cohort (118 Batters)
│   ├── all_bowlers_rankings.csv            # Full Cohort (92 Bowlers)
│   └── STATISTICAL_AUDIT_REPORT.txt        # Automated Mathematical Audit Log
│
├── scripts/                                # Automation & Verification Scripts
│   ├── launcher.js                         # Production Node.js Launcher (npm run start/dev/stop)
│   ├── launcher.py                         # Cross-Platform Python Launcher
│   ├── run_pipeline.py                     # Standalone Analytical Pipeline Execution
│   ├── validate_results.py                 # Mathematical Single-Source-of-Truth Auditor
│   └── test_integration.py                 # Full 12-Endpoint Integration Test Suite
│
├── package.json                            # Root Orchestrator Scripts
├── requirements.txt                        # Root Python Requirements
├── start.bat                               # Windows 1-Click Startup Script
├── .env.example                            # Environment Template
├── .gitignore                              # Production Git Ignore Configuration
└── README.md                               # Project Documentation
```

---

## 📊 Analytical Methodology Highlights

### 1. Match Pressure Index (MPI)
Every delivery is assigned a dynamic pressure score $P \in [0, 100]$:
- **Innings 2 (Chase):**
  $$P_{\text{inn2}} = 0.35 \times P_{\text{RRR}} + 0.25 \times P_{\text{WIH}} + 0.20 \times P_{\text{Stage}} + 0.20 \times P_{\text{Close}} + \text{KO Bonus}$$
- **Innings 1 (Setting Par):**
  $$P_{\text{inn1}} = 0.40 \times P_{\text{Death}} + 0.35 \times P_{\text{Collapse}} + 0.15 \times P_{\text{CRR}} + 3.0 + \text{KO Bonus}$$
- **Super Overs:** 100.0 on every delivery.
- **High-Pressure Crucible ($\ge 70.0$ MPI):** 18,414 deliveries (9.2% of the dataset) represent high-leverage situations.

### 2. Empirical Bayes Shrinkage
To ensure that small sample sizes (e.g. 45 balls) do not artificially outrank consistent long-term performers, strike rates and economies are adjusted via empirical Bayes shrinkage ($K = 40$ prior deliveries):
$$\text{Weight}_{\text{sample}} = \frac{N_{\text{balls}}}{N_{\text{balls}} + 40.0}$$
$$\text{Adjusted Metric} = \text{Weight}_{\text{sample}} \times \text{Raw Metric} + (1 - \text{Weight}_{\text{sample}}) \times \mu_{\text{cohort}}$$

---

## 📦 Submission Deliverables Pack

All competition deliverables are pre-generated and accessible in the `exports/` folder:
- **Publication PDF Report:** `exports/ROYAL_SCOUT_Methodology_Report.pdf` (9-page comprehensive document with embedded charts and formulas)
- **Top 10 Batters CSV:** `exports/top_10_batters.csv`
- **Top 10 Bowlers CSV:** `exports/top_10_bowlers.csv`
- **Complete Batting Cohort CSV:** `exports/all_batters_rankings.csv` (118 eligible batters)
- **Complete Bowling Cohort CSV:** `exports/all_bowlers_rankings.csv` (92 eligible bowlers)
- **Master Submission ZIP:** `exports/ROYAL_SCOUT_SUBMISSION_PACK.zip` (contains all reports, CSVs, problem statement, and evaluator guide)

