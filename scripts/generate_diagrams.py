"""
Generates publication-grade architectural and workflow diagrams for ROYAL SCOUT.
Styled with Rajasthan Royals Pink (#E83E8C), Deep Navy (#14213D), Royal Blue (#174EA6).
"""

import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

OUT_DIR = os.path.join("exports", "diagrams")
ASSETS_DIR = os.path.join("assets", "diagrams")
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

# Corporate colors
NAVY = '#14213D'
PINK = '#E83E8C'
ROYAL_BLUE = '#174EA6'
LIGHT_BG = '#F6F7F9'
BORDER = '#CBD5E1'
DARK_TEXT = '#0F172A'
WHITE = '#FFFFFF'
GREEN = '#159B72'
AMBER = '#D97706'

def save_fig(fig, filename):
    p1 = os.path.join(OUT_DIR, filename)
    p2 = os.path.join(ASSETS_DIR, filename)
    fig.savefig(p1, dpi=300, bbox_inches='tight', facecolor=WHITE)
    fig.savefig(p2, dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print(f"Saved diagram: {filename}")

# Diagram 1: Overall System Architecture
def create_diag01():
    fig, ax = plt.subplots(figsize=(10, 5.5))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5.5)

    # Title
    ax.text(5, 5.1, "ROYAL SCOUT: End-to-End System Architecture", ha='center', va='center',
            fontsize=14, fontweight='bold', fontfamily='serif', color=NAVY)

    # 4 Main Columns / Layers
    layers = [
        ("Layer 1: Raw Datasets\n& Storage", 0.6, 2.2, 1.8, 4.0, '#EEF2F6', NAVY),
        ("Layer 2: Analytics &\nPressure Engine", 2.9, 2.2, 2.0, 4.0, '#FDF2F8', PINK),
        ("Layer 3: FastAPI\nBackend API", 5.4, 2.2, 1.8, 4.0, '#EFF6FF', ROYAL_BLUE),
        ("Layer 4: React SPA\n& Presentation", 7.7, 2.2, 1.8, 4.0, '#F0FDF4', GREEN)
    ]

    for title, cx, cy, w, h, bg, border_col in layers:
        rect = patches.FancyBboxPatch((cx - w/2, cy - h/2), w, h,
                                      boxstyle="round,pad=0.1,rounding_size=0.15",
                                      facecolor=bg, edgecolor=border_col, linewidth=1.5)
        ax.add_patch(rect)
        ax.text(cx, cy + h/2 - 0.35, title, ha='center', va='center',
                fontsize=9.5, fontweight='bold', fontfamily='serif', color=border_col)

    # Content boxes inside Layer 1
    items_l1 = ["ball_by_ball.csv\n(200,999 records)", "matches.csv\n(883 matches)", "competitions.csv\n(141 comps)", "mapping.csv\n(1,217 players)"]
    for i, itm in enumerate(items_l1):
        y = 3.3 - i * 0.8
        r = patches.FancyBboxPatch((0.6 - 0.75, y - 0.3), 1.5, 0.6, boxstyle="round,pad=0.05", facecolor=WHITE, edgecolor=BORDER, linewidth=1)
        ax.add_patch(r)
        ax.text(0.6, y, itm, ha='center', va='center', fontsize=7.5, fontfamily='serif', color=DARK_TEXT)

    # Content boxes inside Layer 2
    items_l2 = ["Vectorized Match\nPressure Index (MPI)", "Bayesian Shrinkage\nPerformance Model", "Contextual Player\nEntity Resolver", "High-Performance\nPickle Caching"]
    for i, itm in enumerate(items_l2):
        y = 3.3 - i * 0.8
        r = patches.FancyBboxPatch((2.9 - 0.85, y - 0.3), 1.7, 0.6, boxstyle="round,pad=0.05", facecolor=WHITE, edgecolor=PINK, linewidth=1)
        ax.add_patch(r)
        ax.text(2.9, y, itm, ha='center', va='center', fontsize=7.5, fontfamily='serif', color=DARK_TEXT, fontweight='medium')

    # Content boxes inside Layer 3
    items_l3 = ["REST Endpoints\n(/api/batters, /bowlers)", "Health & Status Probes\n(/api/health)", "360° Profile Engine\n(/api/player/{id})", "Static SPA & Image\nAsset Server"]
    for i, itm in enumerate(items_l3):
        y = 3.3 - i * 0.8
        r = patches.FancyBboxPatch((5.4 - 0.75, y - 0.3), 1.5, 0.6, boxstyle="round,pad=0.05", facecolor=WHITE, edgecolor=ROYAL_BLUE, linewidth=1)
        ax.add_patch(r)
        ax.text(5.4, y, itm, ha='center', va='center', fontsize=7.5, fontfamily='serif', color=DARK_TEXT)

    # Content boxes inside Layer 4
    items_l4 = ["Interactive Dashboards\n(Top 10 Batters/Bowlers)", "360° Player Dossiers\n(Portraits & Splits)", "Head-to-Head Player\nComparison Engine", "Export Centre\n(PDF, CSV & Pack ZIP)"]
    for i, itm in enumerate(items_l4):
        y = 3.3 - i * 0.8
        r = patches.FancyBboxPatch((7.7 - 0.75, y - 0.3), 1.5, 0.6, boxstyle="round,pad=0.05", facecolor=WHITE, edgecolor=GREEN, linewidth=1)
        ax.add_patch(r)
        ax.text(7.7, y, itm, ha='center', va='center', fontsize=7.5, fontfamily='serif', color=DARK_TEXT)

    # Arrows between layers
    for x in [1.6, 4.0, 6.4]:
        ax.annotate('', xy=(x + 0.35, 2.2), xytext=(x - 0.1, 2.2),
                    arrowprops=dict(arrowstyle="->", color=NAVY, lw=2, mutation_scale=15))

    save_fig(fig, "diag01_system_architecture.png")

# Diagram 2: Dataset Preprocessing Workflow
def create_diag02():
    fig, ax = plt.subplots(figsize=(10, 4.8))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.8)

    ax.text(5, 4.4, "Dataset Ingestion, Validation & Preprocessing Pipeline", ha='center', va='center',
            fontsize=13, fontweight='bold', fontfamily='serif', color=NAVY)

    steps = [
        ("Raw CSV Ingestion", "6 Datasets validated\nColumns & Types checked", 1.2),
        ("Entity Resolution", "Player IDs mapped\nIPL & National Affiliations", 3.7),
        ("Cricket Classification", "Wides vs No-Balls\nBatter Balls vs Bowler Legal", 6.2),
        ("Pressure Assignment", "MPI Score evaluated\nis_pressure >= 70 flagged", 8.7)
    ]

    for title, desc, cx in steps:
        r = patches.FancyBboxPatch((cx - 1.1, 1.8), 2.2, 1.8, boxstyle="round,pad=0.1",
                                  facecolor=WHITE, edgecolor=NAVY, linewidth=1.5)
        ax.add_patch(r)
        # Header banner
        r_head = patches.FancyBboxPatch((cx - 1.1, 3.0), 2.2, 0.6, boxstyle="round,pad=0.05",
                                       facecolor=ROYAL_BLUE, edgecolor=ROYAL_BLUE)
        ax.add_patch(r_head)
        ax.text(cx, 3.3, title, ha='center', va='center', fontsize=9, fontweight='bold', fontfamily='serif', color=WHITE)
        ax.text(cx, 2.4, desc, ha='center', va='center', fontsize=8, fontfamily='serif', color=DARK_TEXT)

    for x in [2.4, 4.9, 7.4]:
        ax.annotate('', xy=(x + 0.15, 2.7), xytext=(x - 0.15, 2.7),
                    arrowprops=dict(arrowstyle="->", color=PINK, lw=2.5, mutation_scale=15))

    # Bottom notes
    note_rect = patches.FancyBboxPatch((1.0, 0.3), 8.0, 0.9, boxstyle="round,pad=0.1",
                                      facecolor=LIGHT_BG, edgecolor=BORDER, linewidth=1)
    ax.add_patch(note_rect)
    ax.text(5, 0.75, "Cricket Scoring Compliance: Bowler legal deliveries exclude wides & no-balls. Batter balls faced include no-balls.\nBowler-creditable wickets exclude run-outs, retired out, and obstructing the field.",
            ha='center', va='center', fontsize=8, fontfamily='serif', color=DARK_TEXT, style='italic')

    save_fig(fig, "diag02_dataset_workflow.png")

# Diagram 3: Match Pressure Index (MPI) Workflow
def create_diag03():
    fig, ax = plt.subplots(figsize=(10, 5.2))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5.2)

    ax.text(5, 4.8, "Match Pressure Index (MPI) Mathematical Framework", ha='center', va='center',
            fontsize=13, fontweight='bold', fontfamily='serif', color=NAVY)

    # Innings 2 Box (Left)
    r2 = patches.FancyBboxPatch((0.5, 1.8), 4.2, 2.5, boxstyle="round,pad=0.1", facecolor='#FDF2F8', edgecolor=PINK, linewidth=1.5)
    ax.add_patch(r2)
    ax.text(2.6, 4.0, "Innings 2: Dynamic Target Chase", ha='center', va='center', fontsize=10, fontweight='bold', fontfamily='serif', color=PINK)
    i2_text = "P_inn2 = 0.35·P_RRR + 0.25·P_WIH +\n          0.20·P_Stage + 0.20·P_Close + KO\n\n• Required Run Rate (RRR): RRR >= 12 -> 100\n• Wickets in Hand (WIH): <= 2 wkts -> 100\n• Match Closeness: balls <= 24, diff <= 24\n• Stage: overs 16–20 amplified"
    ax.text(0.7, 2.8, i2_text, ha='left', va='center', fontsize=8, fontfamily='serif', color=DARK_TEXT)

    # Innings 1 Box (Right)
    r1 = patches.FancyBboxPatch((5.3, 1.8), 4.2, 2.5, boxstyle="round,pad=0.1", facecolor='#EFF6FF', edgecolor=ROYAL_BLUE, linewidth=1.5)
    ax.add_patch(r1)
    ax.text(7.4, 4.0, "Innings 1: Par Setting Under Risk", ha='center', va='center', fontsize=10, fontweight='bold', fontfamily='serif', color=ROYAL_BLUE)
    i1_text = "P_inn1 = 0.40·P_Death + 0.35·P_Collapse +\n          0.15·P_CRR + 3.0 + KO\n\n• Death Overs: overs 16–20 par surge\n• Top-Order Collapse: <= 30 runs for >= 3 wkts\n• Current Run Rate: momentum pressure\n• Super Over bonus: 100.0 on all deliveries"
    ax.text(5.5, 2.8, i1_text, ha='left', va='center', fontsize=8, fontfamily='serif', color=DARK_TEXT)

    # Final Classification Tier (Bottom)
    rf = patches.FancyBboxPatch((1.5, 0.3), 7.0, 1.0, boxstyle="round,pad=0.1", facecolor=WHITE, edgecolor=NAVY, linewidth=2)
    ax.add_patch(rf)
    ax.text(5, 0.95, "Pressure Classification Thresholds", ha='center', va='center', fontsize=9.5, fontweight='bold', fontfamily='serif', color=NAVY)
    ax.text(5, 0.55, "Low Pressure: MPI < 40.0 (46.3%)  |  Moderate: 40.0 <= MPI < 70.0 (44.5%)  |  High Pressure Crucible: MPI >= 70.0 (9.2%, 18,414 balls)",
            ha='center', va='center', fontsize=8, fontfamily='serif', color=DARK_TEXT)

    # Connectors
    ax.annotate('', xy=(3.5, 1.3), xytext=(2.6, 1.8), arrowprops=dict(arrowstyle="->", color=NAVY, lw=1.5))
    ax.annotate('', xy=(6.5, 1.3), xytext=(7.4, 1.8), arrowprops=dict(arrowstyle="->", color=NAVY, lw=1.5))

    save_fig(fig, "diag03_mpi_workflow.png")

# Diagram 4: Batter Evaluation Pipeline
def create_diag04():
    fig, ax = plt.subplots(figsize=(10, 4.8))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.8)

    ax.text(5, 4.4, "Batter Pressure-Performance Evaluation Architecture", ha='center', va='center',
            fontsize=13, fontweight='bold', fontfamily='serif', color=NAVY)

    steps = [
        ("1. Metric Extraction", "Pressure Runs & Balls\nPressure Strike Rate\nPressure Batting Avg\nBoundary & Dot %", 1.2),
        ("2. Baseline Delta", "SR Delta: (p_sr - norm_sr)\nAvg Delta: (p_avg - norm_avg)\nBoundary Acceleration", 3.7),
        ("3. Weighted Rating", "SR Score (40%)\nAvg Score (25%)\nBoundary % (20%)\nDot Suppression (15%)", 6.2),
        ("4. Bayesian Shrinkage", "Shrinkage factor: N/(N+25)\nPrior Mean: 50.0\nEligibility: >= 45 balls", 8.7)
    ]

    for title, desc, cx in steps:
        r = patches.FancyBboxPatch((cx - 1.1, 1.8), 2.2, 1.8, boxstyle="round,pad=0.1",
                                  facecolor=WHITE, edgecolor=PINK, linewidth=1.5)
        ax.add_patch(r)
        r_head = patches.FancyBboxPatch((cx - 1.1, 3.0), 2.2, 0.6, boxstyle="round,pad=0.05",
                                       facecolor=PINK, edgecolor=PINK)
        ax.add_patch(r_head)
        ax.text(cx, 3.3, title, ha='center', va='center', fontsize=8.5, fontweight='bold', fontfamily='serif', color=WHITE)
        ax.text(cx, 2.4, desc, ha='center', va='center', fontsize=7.8, fontfamily='serif', color=DARK_TEXT)

    for x in [2.4, 4.9, 7.4]:
        ax.annotate('', xy=(x + 0.15, 2.7), xytext=(x - 0.15, 2.7),
                    arrowprops=dict(arrowstyle="->", color=NAVY, lw=2.5, mutation_scale=15))

    note_rect = patches.FancyBboxPatch((1.0, 0.3), 8.0, 0.9, boxstyle="round,pad=0.1", facecolor=LIGHT_BG, edgecolor=BORDER, linewidth=1)
    ax.add_patch(note_rect)
    ax.text(5, 0.75, "Formula: Final Batter Rating = λ · Raw_Score + (1 - λ) · 50.0,  where λ = N / (N + 25).\nProtects against small-sample distortions while rewarding verified clutch finishers.",
            ha='center', va='center', fontsize=8, fontfamily='serif', color=DARK_TEXT, style='italic')

    save_fig(fig, "diag04_batting_pipeline.png")

# Diagram 5: Bowler Evaluation Pipeline
def create_diag05():
    fig, ax = plt.subplots(figsize=(10, 4.8))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.8)

    ax.text(5, 4.4, "Bowler Pressure-Performance Evaluation Architecture", ha='center', va='center',
            fontsize=13, fontweight='bold', fontfamily='serif', color=NAVY)

    steps = [
        ("1. Metric Extraction", "Legal Balls (excl. W/NB)\nRuns Conceded\nBowler Wickets\nPressure Economy Rate", 1.2),
        ("2. Baseline Delta", "Econ Delta: (norm - p_econ)\nWicket SR: balls/wkt\nBoundary Prevention %", 3.7),
        ("3. Weighted Rating", "Econ Score (35%)\nWicket Strike Rate (30%)\nDot-Ball % (20%)\nBoundary Control (15%)", 6.2),
        ("4. Bayesian Shrinkage", "Shrinkage factor: N/(N+35)\nPrior Mean: 50.0\nEligibility: >= 60 legal balls", 8.7)
    ]

    for title, desc, cx in steps:
        r = patches.FancyBboxPatch((cx - 1.1, 1.8), 2.2, 1.8, boxstyle="round,pad=0.1",
                                  facecolor=WHITE, edgecolor=ROYAL_BLUE, linewidth=1.5)
        ax.add_patch(r)
        r_head = patches.FancyBboxPatch((cx - 1.1, 3.0), 2.2, 0.6, boxstyle="round,pad=0.05",
                                       facecolor=ROYAL_BLUE, edgecolor=ROYAL_BLUE)
        ax.add_patch(r_head)
        ax.text(cx, 3.3, title, ha='center', va='center', fontsize=8.5, fontweight='bold', fontfamily='serif', color=WHITE)
        ax.text(cx, 2.4, desc, ha='center', va='center', fontsize=7.8, fontfamily='serif', color=DARK_TEXT)

    for x in [2.4, 4.9, 7.4]:
        ax.annotate('', xy=(x + 0.15, 2.7), xytext=(x - 0.15, 2.7),
                    arrowprops=dict(arrowstyle="->", color=NAVY, lw=2.5, mutation_scale=15))

    note_rect = patches.FancyBboxPatch((1.0, 0.3), 8.0, 0.9, boxstyle="round,pad=0.1", facecolor=LIGHT_BG, edgecolor=BORDER, linewidth=1)
    ax.add_patch(note_rect)
    ax.text(5, 0.75, "Formula: Final Bowler Rating = λ · Raw_Score + (1 - λ) · 50.0,  where λ = N / (N + 35).\nRewards death-over execution, breakthrough frequency, and stingy run containment.",
            ha='center', va='center', fontsize=8, fontfamily='serif', color=DARK_TEXT, style='italic')

    save_fig(fig, "diag05_bowling_pipeline.png")

# Diagram 6: Player Ranking Methodology
def create_diag06():
    fig, ax = plt.subplots(figsize=(10, 4.8))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.8)

    ax.text(5, 4.4, "Player Eligibility, Normalization & Ranking Hierarchy", ha='center', va='center',
            fontsize=13, fontweight='bold', fontfamily='serif', color=NAVY)

    # 3-tier pyramid/flow
    boxes = [
        ("Step 1: Eligibility Filtering", "Batters: Minimum 45 high-pressure deliveries faced across >= 5 matches.\nBowlers: Minimum 60 legal deliveries bowled across >= 5 matches.", 3.5),
        ("Step 2: Dual-Baseline Normalization", "Compares performance in MPI >= 70 against normal (MPI < 70) career baseline.\nMeasures actual clutch lift over standard expectation.", 2.3),
        ("Step 3: Bayesian Shrinkage & Tiering", "Pulls small samples toward cohort prior (50.0). High sample sizes retain observed peak.\nTiers assigned: Elite Sample (>= 120b), Robust Sample (>= 75b), Qualified.", 1.1)
    ]

    for title, desc, cy in boxes:
        r = patches.FancyBboxPatch((1.5, cy - 0.45), 7.0, 0.9, boxstyle="round,pad=0.1",
                                  facecolor=WHITE, edgecolor=NAVY, linewidth=1.5)
        ax.add_patch(r)
        ax.text(1.8, cy + 0.15, title, ha='left', va='center', fontsize=9.5, fontweight='bold', fontfamily='serif', color=PINK)
        ax.text(1.8, cy - 0.18, desc, ha='left', va='center', fontsize=7.8, fontfamily='serif', color=DARK_TEXT)

    for y in [2.95, 1.75]:
        ax.annotate('', xy=(5.0, y - 0.1), xytext=(5.0, y + 0.1),
                    arrowprops=dict(arrowstyle="->", color=ROYAL_BLUE, lw=2.5, mutation_scale=15))

    save_fig(fig, "diag06_ranking_methodology.png")

# Diagram 7: Final Application Workflow
def create_diag07():
    fig, ax = plt.subplots(figsize=(10, 4.8))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.8)

    ax.text(5, 4.4, "ROYAL SCOUT Application User & Evaluation Workflow", ha='center', va='center',
            fontsize=13, fontweight='bold', fontfamily='serif', color=NAVY)

    steps = [
        ("1. Launch & Sync", "One-command start\nnpm run start\nCache auto-loaded", 1.2),
        ("2. Explore Data", "Inspect 200k balls\nMPI distribution\nPhase breakdowns", 3.7),
        ("3. Scouting Radar", "Rankings: Top 10\n360° Player Dossier\nHead-to-Head Compare", 6.2),
        ("4. Decision Deliverables", "Methodology PDF\nTabular CSV rankings\nSubmission ZIP Pack", 8.7)
    ]

    for title, desc, cx in steps:
        r = patches.FancyBboxPatch((cx - 1.1, 1.8), 2.2, 1.8, boxstyle="round,pad=0.1",
                                  facecolor=WHITE, edgecolor=NAVY, linewidth=1.5)
        ax.add_patch(r)
        r_head = patches.FancyBboxPatch((cx - 1.1, 3.0), 2.2, 0.6, boxstyle="round,pad=0.05",
                                       facecolor=NAVY, edgecolor=NAVY)
        ax.add_patch(r_head)
        ax.text(cx, 3.3, title, ha='center', va='center', fontsize=8.5, fontweight='bold', fontfamily='serif', color=WHITE)
        ax.text(cx, 2.4, desc, ha='center', va='center', fontsize=7.8, fontfamily='serif', color=DARK_TEXT)

    for x in [2.4, 4.9, 7.4]:
        ax.annotate('', xy=(x + 0.15, 2.7), xytext=(x - 0.15, 2.7),
                    arrowprops=dict(arrowstyle="->", color=PINK, lw=2.5, mutation_scale=15))

    note_rect = patches.FancyBboxPatch((1.0, 0.3), 8.0, 0.9, boxstyle="round,pad=0.1", facecolor=LIGHT_BG, edgecolor=BORDER, linewidth=1)
    ax.add_patch(note_rect)
    ax.text(5, 0.75, "Architected for Rajasthan Royals: Provides real-time interactive intelligence, auditability, and immediate auction decision support.",
            ha='center', va='center', fontsize=8, fontfamily='serif', color=DARK_TEXT, style='italic')

    save_fig(fig, "diag07_application_workflow.png")

if __name__ == '__main__':
    create_diag01()
    create_diag02()
    create_diag03()
    create_diag04()
    create_diag05()
    create_diag06()
    create_diag07()
    print("All 7 architectural diagrams generated successfully!")

