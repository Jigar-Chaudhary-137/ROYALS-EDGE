"""
Exports and Submission Packaging Engine for Royal Scout
Generates official submission deliverables:
- Top 10 Batters CSV
- Top 10 Bowlers CSV
- Comprehensive Player Analytics CSV
- Methodology Report PDF
- Master Submission Deliverables ZIP archive
"""

import os
import zipfile
import shutil
import pandas as pd
from typing import Dict, Any, List

def export_all_deliverables(
    exports_dir: str,
    batters_df: pd.DataFrame,
    bowlers_df: pd.DataFrame,
    pdf_path: str,
    data_dir: str
) -> Dict[str, str]:
    """
    Exports all competition submission deliverables and compiles the final ZIP pack.
    """
    os.makedirs(exports_dir, exist_ok=True)
    generated_files = {}

    # 1. Top 10 Batters CSV
    top_batters_10 = batters_df.head(10)[[
        'rank', 'striker_id', 'striker_name', 'team', 'intl_team', 'p_matches',
        'p_balls', 'p_runs', 'p_sr', 'all_sr', 'sr_improvement', 'p_avg',
        'p_boundary_pct', 'p_dot_pct', 'adj_p_sr', 'final_rating', 'reliability_tier', 'rationale'
    ]].copy()
    top_b_path = os.path.join(exports_dir, 'top_10_batters.csv')
    top_batters_10.to_csv(top_b_path, index=False)
    generated_files['top_10_batters_csv'] = top_b_path

    # 2. Top 10 Bowlers CSV
    top_bowlers_10 = bowlers_df.head(10)[[
        'rank', 'bowler_id', 'bowler_name', 'team', 'intl_team', 'p_matches',
        'p_overs', 'p_legal_balls', 'p_wickets', 'p_runs', 'p_econ', 'all_econ',
        'econ_improvement', 'p_wkt_sr', 'p_dot_pct', 'p_bound_pct', 'adj_p_econ',
        'final_rating', 'reliability_tier', 'rationale'
    ]].copy()
    top_bw_path = os.path.join(exports_dir, 'top_10_bowlers.csv')
    top_bowlers_10.to_csv(top_bw_path, index=False)
    generated_files['top_10_bowlers_csv'] = top_bw_path

    # 3. Full cohort CSVs
    all_b_path = os.path.join(exports_dir, 'all_batters_rankings.csv')
    batters_df.to_csv(all_b_path, index=False)
    generated_files['all_batters_csv'] = all_b_path

    all_bw_path = os.path.join(exports_dir, 'all_bowlers_rankings.csv')
    bowlers_df.to_csv(all_bw_path, index=False)
    generated_files['all_bowlers_csv'] = all_bw_path

    # 4. Submission Readme Markdown
    readme_path = os.path.join(exports_dir, 'SUBMISSION_README.md')
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write("# RAJASTHAN ROYALS | SupeRR Selector Season 2\n")
        f.write("## Round 1 Submission Pack: ROYAL SCOUT\n\n")
        f.write("### Deliverable Overview:\n")
        f.write("1. **Methodology Report:** `ROYAL_SCOUT_Methodology_Report.pdf` (Comprehensive 20-section publication document)\n")
        f.write("2. **Top 10 Batters:** `top_10_batters.csv`\n")
        f.write("3. **Top 10 Bowlers:** `top_10_bowlers.csv`\n")
        f.write("4. **Full Analytical Data:** `all_batters_rankings.csv` & `all_bowlers_rankings.csv`\n\n")
        f.write("### Official Top 10 Batters:\n")
        for _, r in top_batters_10.iterrows():
            f.write(f"- Rank {int(r['rank'])}: **{r['striker_name']}** ({r['team']}) — Rating: {r['final_rating']}/100 | Press SR: {r['p_sr']} | SR Diff: {r['sr_improvement']:+.1f}\n")
        f.write("\n### Official Top 10 Bowlers:\n")
        for _, r in top_bowlers_10.iterrows():
            f.write(f"- Rank {int(r['rank'])}: **{r['bowler_name']}** ({r['team']}) — Rating: {r['final_rating']}/100 | Press Econ: {r['p_econ']} | Wkts: {int(r['p_wickets'])}\n")
    generated_files['readme'] = readme_path

    # 5. Master ZIP archive
    zip_path = os.path.join(exports_dir, 'ROYAL_SCOUT_SUBMISSION_PACK.zip')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        if os.path.exists(pdf_path):
            z.write(pdf_path, 'ROYAL_SCOUT_Methodology_Report.pdf')
        z.write(top_b_path, 'top_10_batters.csv')
        z.write(top_bw_path, 'top_10_bowlers.csv')
        z.write(all_b_path, 'all_batters_rankings.csv')
        z.write(all_bw_path, 'all_bowlers_rankings.csv')
        z.write(readme_path, 'SUBMISSION_README.md')
        
        # Include audit report if present
        audit_path = os.path.join(exports_dir, 'STATISTICAL_AUDIT_REPORT.txt')
        if os.path.exists(audit_path):
            z.write(audit_path, 'STATISTICAL_AUDIT_REPORT.txt')
        
        # Include problem statement copy if available
        prob_pdf = os.path.join(data_dir, 'Round 1 Problem Statement _ SupeRR Selector Season 2.docx.pdf')
        if os.path.exists(prob_pdf):
            z.write(prob_pdf, 'Round_1_Problem_Statement.pdf')

    generated_files['submission_zip'] = zip_path
    return generated_files

