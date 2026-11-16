"""
FastAPI Server & Analytics REST API for ROYAL SCOUT
Rajasthan Royals | SupeRR Selector Season 2 | IPL 2027 Auction Intelligence
"""

import os
import shutil
import pickle
import pandas as pd
import numpy as np
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from starlette.staticfiles import StaticFiles
from pydantic import BaseModel

from pressure_engine import compute_match_pressure
from analytics import (
    compute_batting_rankings, compute_bowling_rankings,
    get_player_profile, get_rr_recommendations, get_player_team_context
)
from data_validator import extract_zip_archive, run_data_validation, EXPECTED_FILES
from pdf_generator import build_pdf_report
from exports import export_all_deliverables

app = FastAPI(
    title="ROYAL SCOUT API",
    description="Cricket Analytics Platform for Rajasthan Royals SupeRR Selector Season 2",
    version="2.0.0"
)

# Enable CORS for local Vite dev server and production frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
EXPORTS_DIR = os.path.join(BASE_DIR, "exports")
CACHE_FILE = os.path.join(DATA_DIR, "royal_scout_cache.pkl")

# In-memory storage for instant responses
STATE: Dict[str, Any] = {
    'is_analyzed': False,
    'raw_bbb': None,
    'processed_bbb': None,
    'matches': None,
    'competitions': None,
    'teams': None,
    'playing_eleven': None,
    'mapping': None,
    'batters_df': None,
    'bowlers_df': None,
    'recommendations': None,
    'summary': None,
    'data_report': None,
    'exports': None
}

def load_and_run_pipeline(force: bool = False) -> bool:
    """Loads raw CSVs, runs pressure engine, computes rankings, generates PDF & exports with caching."""
    try:
        report = run_data_validation(DATA_DIR)
        STATE['data_report'] = report
        
        if not report['is_ready_for_analysis']:
            return False

        # Check for cached results if not forcing recompute
        if not force and os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, 'rb') as f:
                    cached = pickle.load(f)
                STATE.update(cached)
                STATE['is_analyzed'] = True
                print("Analytical results loaded instantly from verified cache.")
                return True
            except Exception as ce:
                print(f"Cache load error ({ce}), recomputing pipeline...")

        # Load raw files
        bbb = pd.read_csv(os.path.join(DATA_DIR, 'ball_by_ball.csv'))
        matches = pd.read_csv(os.path.join(DATA_DIR, 'matches.csv'))
        comp = pd.read_csv(os.path.join(DATA_DIR, 'competitions.csv'))
        teams = pd.read_csv(os.path.join(DATA_DIR, 'teams.csv'))
        mapping = pd.read_csv(os.path.join(DATA_DIR, 'competition_team_player_mapping.csv'))
        pe = pd.read_csv(os.path.join(DATA_DIR, 'playing_eleven.csv'))

        STATE['raw_bbb'] = bbb
        STATE['matches'] = matches
        STATE['competitions'] = comp
        STATE['teams'] = teams
        STATE['mapping'] = mapping
        STATE['playing_eleven'] = pe

        # Run vectorized pressure engine
        processed_bbb = compute_match_pressure(bbb, matches)
        STATE['processed_bbb'] = processed_bbb

        # Compute Batting & Bowling rankings with Bayesian shrinkage
        batters_df = compute_batting_rankings(processed_bbb, mapping, comp_df=comp, min_balls=45, min_matches=5)
        bowlers_df = compute_bowling_rankings(processed_bbb, mapping, comp_df=comp, min_balls=60, min_matches=5)

        STATE['batters_df'] = batters_df
        STATE['bowlers_df'] = bowlers_df

        # Generate Rajasthan Royals IPL 2027 recommendations
        recs = get_rr_recommendations(batters_df, bowlers_df)
        STATE['recommendations'] = recs

        # Generate summary
        p_balls_count = int(processed_bbb['is_pressure'].sum())
        total_balls = int(len(processed_bbb))
        summary = {
            'total_matches': int(len(matches)),
            'total_balls': total_balls,
            'total_competitions': int(len(comp)),
            'total_teams': int(len(teams)),
            'total_players': int(mapping['player_id'].nunique()) if not mapping.empty else 0,
            'pressure_balls': p_balls_count,
            'pressure_pct': round((p_balls_count / max(1, total_balls)) * 100.0, 2),
            'eligible_batters': int(len(batters_df)),
            'eligible_bowlers': int(len(bowlers_df)),
            'low_pressure_pct': round((processed_bbb['pressure_score'] < 40).mean() * 100.0, 1),
            'moderate_pressure_pct': round(((processed_bbb['pressure_score'] >= 40) & (processed_bbb['pressure_score'] < 70)).mean() * 100.0, 1),
            'high_pressure_pct': round((processed_bbb['pressure_score'] >= 70).mean() * 100.0, 1)
        }
        STATE['summary'] = summary

        # Build official PDF report
        pdf_path = os.path.join(EXPORTS_DIR, 'ROYAL_SCOUT_Methodology_Report.pdf')
        if force or not os.path.exists(pdf_path):
            build_pdf_report(pdf_path, batters_df, bowlers_df, recs, summary)

        # Export CSVs & Master ZIP deliverable
        exports = export_all_deliverables(EXPORTS_DIR, batters_df, bowlers_df, pdf_path, DATA_DIR)
        STATE['exports'] = exports

        # Save to cache for sub-second startup
        try:
            with open(CACHE_FILE, 'wb') as f:
                pickle.dump({
                    'raw_bbb': bbb,
                    'matches': matches,
                    'competitions': comp,
                    'teams': teams,
                    'mapping': mapping,
                    'playing_eleven': pe,
                    'processed_bbb': processed_bbb,
                    'batters_df': batters_df,
                    'bowlers_df': bowlers_df,
                    'recommendations': recs,
                    'summary': summary,
                    'data_report': report,
                    'exports': exports
                }, f)
            print("Analytical cache updated successfully.")
        except Exception as se:
            print(f"Could not write cache file: {se}")

        STATE['is_analyzed'] = True
        return True

    except Exception as e:
        print(f"Error running pipeline: {e}")
        import traceback
        traceback.print_exc()
        return False

# Initialize on startup if data files are present
@app.on_event("startup")
def startup_event():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(EXPORTS_DIR, exist_ok=True)
    if os.path.exists(os.path.join(DATA_DIR, 'ball_by_ball.csv')):
        print("Initial data files detected. Launching analytical engine...")
        load_and_run_pipeline()
        print("Analytics engine initialization complete.")

@app.get("/api/health")
def get_health():
    """Health check endpoint for launcher, monitoring, and readiness probes."""
    datasets_ok = (
        os.path.exists(os.path.join(DATA_DIR, 'ball_by_ball.csv')) and
        os.path.exists(os.path.join(DATA_DIR, 'matches.csv')) and
        os.path.exists(os.path.join(DATA_DIR, 'competitions.csv')) and
        os.path.exists(os.path.join(DATA_DIR, 'teams.csv'))
    )
    analytics_ready = STATE.get('is_analyzed', False)
    
    img_dir_frontend = os.path.join(BASE_DIR, "frontend", "public", "players")
    images_available = os.path.exists(img_dir_frontend) and len(os.listdir(img_dir_frontend)) > 0
    img_count = len(os.listdir(img_dir_frontend)) if os.path.exists(img_dir_frontend) else 0

    pdf_path = os.path.join(EXPORTS_DIR, "ROYAL_SCOUT_Methodology_Report.pdf")
    zip_path = os.path.join(EXPORTS_DIR, "ROYAL_SCOUT_SUBMISSION_PACK.zip")
    exports_ready = os.path.exists(pdf_path) and os.path.exists(zip_path)

    dist_index = os.path.join(BASE_DIR, "frontend", "dist", "index.html")
    dist_ready = os.path.exists(dist_index)

    return {
        "status": "healthy" if (datasets_ok and analytics_ready) else "ready" if datasets_ok else "initializing",
        "backend": "online",
        "database": "connected" if datasets_ok else "no_data",
        "dataset_status": {
            "available": datasets_ok,
            "data_dir": DATA_DIR,
            "files_present": [
                f for f in ["ball_by_ball.csv", "matches.csv", "competitions.csv", "teams.csv", "playing_eleven.csv", "competition_team_player_mapping.csv"]
                if os.path.exists(os.path.join(DATA_DIR, f))
            ]
        },
        "analytics_engine": {
            "status": "computed" if analytics_ready else "pending",
            "eligible_batters": len(STATE.get('batters_df', [])) if STATE.get('batters_df') is not None else 0,
            "eligible_bowlers": len(STATE.get('bowlers_df', [])) if STATE.get('bowlers_df') is not None else 0,
            "total_matches": STATE.get('summary', {}).get('total_matches', 0) if STATE.get('summary') else 0
        },
        "image_service": {
            "status": "ready" if images_available else "fallback_only",
            "player_images_count": img_count
        },
        "export_service": {
            "status": "ready" if exports_ready else "pending",
            "pdf_exists": os.path.exists(pdf_path),
            "zip_exists": os.path.exists(zip_path)
        },
        "frontend": {
            "built": dist_ready,
            "mode": "production_served" if dist_ready else "dev_server_required"
        }
    }

@app.get("/api/status")
def get_status():
    """Returns system status, active datasets, and analytical progress."""
    if not STATE['is_analyzed'] and os.path.exists(os.path.join(DATA_DIR, 'ball_by_ball.csv')):
        load_and_run_pipeline()
    report = STATE.get('data_report') or run_data_validation(DATA_DIR)
    return {
        'is_analyzed': STATE['is_analyzed'],
        'summary': STATE.get('summary'),
        'data_report': report
    }

@app.post("/api/run-analysis")
def run_analysis():
    """Triggers end-to-end analytical pipeline, recalculating all metrics and reports."""
    success = load_and_run_pipeline()
    if not success:
        raise HTTPException(status_code=400, detail="Data validation failed or missing required competition files.")
    return {
        'success': True,
        'message': "Full analytical engine executed successfully.",
        'summary': STATE['summary']
    }

@app.post("/api/upload-zip")
async def upload_zip(file: UploadFile = File(...)):
    """Uploads and extracts competition ZIP archive automatically."""
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="File must be a .zip archive")
    
    zip_dest = os.path.join(DATA_DIR, "uploaded_pack.zip")
    with open(zip_dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extract_result = extract_zip_archive(zip_dest, DATA_DIR)
    # Re-run validation
    report = run_data_validation(DATA_DIR)
    STATE['data_report'] = report

    return {
        'success': True,
        'extracted': extract_result,
        'data_report': report
    }

@app.post("/api/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """Uploads an individual dataset CSV or problem statement PDF."""
    target_path = os.path.join(DATA_DIR, file.filename)
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    report = run_data_validation(DATA_DIR)
    STATE['data_report'] = report
    return {
        'success': True,
        'filename': file.filename,
        'size_bytes': os.path.getsize(target_path),
        'data_report': report
    }

@app.get("/api/overview")
def get_overview():
    """High-level KPIs, distributions, and top podium performers."""
    if not STATE['is_analyzed']:
        load_and_run_pipeline()
    
    if not STATE['is_analyzed']:
        raise HTTPException(status_code=503, detail="Dataset not ready for analysis.")

    b_df = STATE['batters_df']
    bw_df = STATE['bowlers_df']
    p_bbb = STATE['processed_bbb']

    # Innings Stage breakdown
    stage_breakdown = p_bbb.groupby('stage_phase').agg(
        total_balls=('runs', 'count'),
        pressure_balls=('is_pressure', 'sum'),
        avg_pressure_score=('pressure_score', 'mean')
    ).reset_index()
    stage_breakdown['pressure_pct'] = np.round((stage_breakdown['pressure_balls'] / stage_breakdown['total_balls']) * 100.0, 1)
    stage_breakdown['avg_pressure_score'] = np.round(stage_breakdown['avg_pressure_score'], 1)

    return {
        'summary': STATE['summary'],
        'top_batters_podium': b_df.head(3).to_dict(orient='records'),
        'top_bowlers_podium': bw_df.head(3).to_dict(orient='records'),
        'stage_breakdown': stage_breakdown.to_dict(orient='records'),
        'recent_recommendations': STATE['recommendations'][:2]
    }

@app.get("/api/data-explorer")
def data_explorer(
    dataset: str = Query('ball_by_ball'),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=5, le=100),
    search: Optional[str] = Query(None)
):
    """Filterable, paginated data explorer for inspected raw and processed datasets."""
    file_map = {
        'ball_by_ball': 'ball_by_ball.csv',
        'matches': 'matches.csv',
        'competitions': 'competitions.csv',
        'teams': 'teams.csv',
        'playing_eleven': 'playing_eleven.csv',
        'mapping': 'competition_team_player_mapping.csv'
    }

    if dataset not in file_map:
        raise HTTPException(status_code=400, detail="Invalid dataset identifier.")

    fpath = os.path.join(DATA_DIR, file_map[dataset])
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail="Requested dataset file is not uploaded.")

    # Read dataset
    df = pd.read_csv(fpath)
    total_records = len(df)
    schema_info = {col: str(dtype) for col, dtype in df.dtypes.items()}
    null_counts = {k: int(v) for k, v in df.isna().sum().items() if v > 0}

    # Search filter
    if search:
        search_lower = search.lower()
        mask = np.zeros(len(df), dtype=bool)
        for col in df.select_dtypes(include=['object', 'string']).columns:
            mask |= df[col].astype(str).str.lower().str.contains(search_lower, na=False)
        df = df[mask]

    filtered_count = len(df)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_records = df.iloc[start_idx:end_idx].fillna("").to_dict(orient='records')

    return {
        'dataset': dataset,
        'filename': file_map[dataset],
        'total_records': total_records,
        'filtered_count': filtered_count,
        'page': page,
        'page_size': page_size,
        'total_pages': int(np.ceil(filtered_count / page_size)),
        'schema': schema_info,
        'null_columns': null_counts,
        'records': paginated_records
    }

@app.get("/api/pressure-analysis")
def pressure_analysis():
    """Deep-dive metrics and distributions for the Pressure Analysis Engine."""
    if not STATE['is_analyzed']:
        load_and_run_pipeline()

    p_bbb = STATE['processed_bbb']
    
    # Pressure histogram distribution (bins 0-10, 10-20, ... 90-100)
    bins = list(range(0, 110, 10))
    labels = [f"{b}-{b+10}" for b in range(0, 100, 10)]
    p_binned = pd.cut(p_bbb['pressure_score'], bins=bins, labels=labels, right=True)
    hist_counts = p_binned.value_counts().sort_index().to_dict()

    # Pressure by overs (1 to 20)
    over_pressure = p_bbb.groupby('overid').agg(
        avg_pressure=('pressure_score', 'mean'),
        pressure_balls=('is_pressure', 'sum'),
        total_balls=('runs', 'count'),
        avg_runs_per_ball=('delivery_runs', 'mean')
    ).reset_index()
    over_pressure['avg_pressure'] = np.round(over_pressure['avg_pressure'], 1)
    over_pressure['pressure_pct'] = np.round((over_pressure['pressure_balls'] / over_pressure['total_balls']) * 100.0, 1)

    # Innings 1 vs Innings 2 comparison
    inn_comp = p_bbb.groupby('innings').agg(
        balls=('runs', 'count'),
        avg_score=('pressure_score', 'mean'),
        high_pressure_balls=('is_pressure', 'sum')
    ).head(2).reset_index()
    inn_comp['high_pressure_pct'] = np.round((inn_comp['high_pressure_balls'] / inn_comp['balls']) * 100.0, 1)
    inn_comp['avg_score'] = np.round(inn_comp['avg_score'], 1)

    return {
        'histogram': [{'range': k, 'count': v} for k, v in hist_counts.items()],
        'over_progression': over_pressure.to_dict(orient='records'),
        'innings_comparison': inn_comp.to_dict(orient='records')
    }

@app.get("/api/batters")
def get_batters(
    search: Optional[str] = Query(None),
    sort_by: str = Query('final_rating'),
    ascending: bool = Query(False),
    min_balls: int = Query(45)
):
    """Returns ranked batters with filters, sorting, and rationales."""
    if not STATE['is_analyzed']:
        load_and_run_pipeline()

    df = STATE['batters_df'].copy()
    if min_balls > 45:
        df = df[df['p_balls'] >= min_balls]

    if search:
        s = search.lower()
        df = df[df['striker_name'].str.lower().str.contains(s) | df['team'].str.lower().str.contains(s)]

    if sort_by in df.columns:
        df = df.sort_values(sort_by, ascending=ascending)

    top_10 = df.head(10).to_dict(orient='records')
    full_cohort = df.to_dict(orient='records')

    return {
        'top_10': top_10,
        'total_eligible': len(df),
        'rankings': full_cohort
    }

@app.get("/api/bowlers")
def get_bowlers(
    search: Optional[str] = Query(None),
    sort_by: str = Query('final_rating'),
    ascending: bool = Query(False),
    min_balls: int = Query(60)
):
    """Returns ranked bowlers with filters, sorting, and rationales."""
    if not STATE['is_analyzed']:
        load_and_run_pipeline()

    df = STATE['bowlers_df'].copy()
    if min_balls > 60:
        df = df[df['p_legal_balls'] >= min_balls]

    if search:
        s = search.lower()
        df = df[df['bowler_name'].str.lower().str.contains(s) | df['team'].str.lower().str.contains(s)]

    if sort_by in df.columns:
        df = df.sort_values(sort_by, ascending=ascending)

    top_10 = df.head(10).to_dict(orient='records')
    full_cohort = df.to_dict(orient='records')

    return {
        'top_10': top_10,
        'total_eligible': len(df),
        'rankings': full_cohort
    }

@app.get("/api/search-players")
def search_players(q: str = Query('', min_length=1)):
    """Search for players across batters and bowlers rankings."""
    if not STATE['is_analyzed']:
        load_and_run_pipeline()

    query = q.lower().strip()
    if not query:
        return {'results': []}

    results = []
    seen = set()

    # Search batters
    if STATE['batters_df'] is not None:
        b_df = STATE['batters_df']
        matches = b_df[b_df['striker_name'].str.lower().str.contains(query, na=False) | b_df['team'].str.lower().str.contains(query, na=False)]
        for _, r in matches.head(8).iterrows():
            pid = int(r['striker_id'])
            seen.add(pid)
            results.append({
                'player_id': pid,
                'player_name': r['striker_name'],
                'team': r['team'],
                'primary_role': 'Batter',
                'rank': int(r['rank']),
                'final_rating': float(r['final_rating']),
                'pressure_stat': f"{r['p_sr']:.1f} SR ({int(r['p_runs'])} runs)",
                'reliability_tier': r['reliability_tier']
            })

    # Search bowlers
    if STATE['bowlers_df'] is not None:
        bw_df = STATE['bowlers_df']
        matches = bw_df[bw_df['bowler_name'].str.lower().str.contains(query, na=False) | bw_df['team'].str.lower().str.contains(query, na=False)]
        for _, r in matches.head(8).iterrows():
            pid = int(r['bowler_id'])
            if pid not in seen:
                results.append({
                    'player_id': pid,
                    'player_name': r['bowler_name'],
                    'team': r['team'],
                    'primary_role': 'Bowler',
                    'rank': int(r['rank']),
                    'final_rating': float(r['final_rating']),
                    'pressure_stat': f"{r['p_econ']:.2f} Econ ({int(r['p_wickets'])} wkts)",
                    'reliability_tier': r['reliability_tier']
                })

    return {'results': results[:12]}

@app.get("/api/player/{player_id}")
def get_player(player_id: int):
    """Returns complete 360-degree player performance breakdown."""
    if not STATE['is_analyzed']:
        load_and_run_pipeline()

    profile = get_player_profile(
        player_id=player_id,
        bbb=STATE['processed_bbb'],
        mapping_df=STATE['mapping'],
        comp_df=STATE['competitions'],
        batters_df=STATE['batters_df'],
        bowlers_df=STATE['bowlers_df']
    )
    return profile

class CompareRequest(BaseModel):
    player_ids: List[int]
    role: str = 'batter'

@app.post("/api/compare")
def compare_players(req: CompareRequest):
    """Generates multi-player side-by-side comparison vectors."""
    if not STATE['is_analyzed']:
        load_and_run_pipeline()

    profiles = []
    for pid in req.player_ids:
        prof = get_player_profile(
            player_id=pid,
            bbb=STATE['processed_bbb'],
            mapping_df=STATE['mapping'],
            comp_df=STATE['competitions'],
            batters_df=STATE['batters_df'],
            bowlers_df=STATE['bowlers_df']
        )
        profiles.append(prof)
    return {'profiles': profiles, 'role': req.role}

@app.get("/api/rr-recommendations")
def get_recommendations():
    """Returns strategic Rajasthan Royals IPL 2027 Auction Recommendations."""
    if not STATE['is_analyzed']:
        load_and_run_pipeline()
    return {'recommendations': STATE['recommendations']}

@app.get("/api/download/pdf")
def download_pdf():
    """Downloads official publication-grade methodology PDF report."""
    pdf_path = os.path.join(EXPORTS_DIR, 'ROYAL_SCOUT_Methodology_Report.pdf')
    if not os.path.exists(pdf_path):
        if not STATE['is_analyzed']:
            load_and_run_pipeline()
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF report not found.")
    return FileResponse(
        pdf_path,
        media_type='application/pdf',
        filename='ROYAL_SCOUT_Methodology_Report.pdf'
    )

@app.get("/api/download/csv/{csv_type}")
def download_csv(csv_type: str):
    """Downloads exported CSV datasets."""
    file_map = {
        'batters': 'top_10_batters.csv',
        'bowlers': 'top_10_bowlers.csv',
        'all_batters': 'all_batters_rankings.csv',
        'all_bowlers': 'all_bowlers_rankings.csv'
    }
    if csv_type not in file_map:
        raise HTTPException(status_code=400, detail="Invalid CSV type.")
    
    csv_path = os.path.join(EXPORTS_DIR, file_map[csv_type])
    if not os.path.exists(csv_path):
        if not STATE['is_analyzed']:
            load_and_run_pipeline()
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="CSV file not generated.")
    return FileResponse(
        csv_path,
        media_type='text/csv',
        filename=file_map[csv_type]
    )

@app.get("/api/download/submission-zip")
def download_submission_zip():
    """Downloads master submission pack ZIP with all competition deliverables."""
    zip_path = os.path.join(EXPORTS_DIR, 'ROYAL_SCOUT_SUBMISSION_PACK.zip')
    if not os.path.exists(zip_path):
        if not STATE['is_analyzed']:
            load_and_run_pipeline()
    if not os.path.exists(zip_path):
        raise HTTPException(status_code=404, detail="Submission ZIP not generated.")
    return FileResponse(
        zip_path,
        media_type='application/zip',
        filename='ROYAL_SCOUT_SUBMISSION_PACK.zip'
    )

# Static file serving for single-port unified deployment
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")
PLAYERS_DIR = os.path.join(BASE_DIR, "frontend", "public", "players")

if os.path.exists(PLAYERS_DIR):
    app.mount("/players", StaticFiles(directory=PLAYERS_DIR), name="players")

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_path = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return JSONResponse({"status": "Backend running. Build frontend with 'npm run build' to view UI."})
else:
    @app.get("/")
    def index_fallback():
        return JSONResponse({
            "status": "online",
            "message": "ROYAL SCOUT API is running. Build frontend via 'npm run build' for production UI."
        })

