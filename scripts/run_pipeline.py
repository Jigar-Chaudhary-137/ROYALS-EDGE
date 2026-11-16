import os
import sys

# Ensure backend can be imported
sys.path.insert(0, os.path.abspath("backend"))

from app import load_and_run_pipeline, STATE

print("Starting end-to-end analytical pipeline...")
success = load_and_run_pipeline()
print(f"Pipeline execution status: {success}")

if success:
    b_df = STATE['batters_df']
    bw_df = STATE['bowlers_df']
    summary = STATE['summary']
    
    print("\n" + "="*70)
    print("DATASET & PRESSURE AUDIT SUMMARY:")
    print("="*70)
    for k, v in summary.items():
        print(f"  {k}: {v}")
        
    print("\n" + "="*70)
    print("TOP 10 BATTERS (SINGLE SOURCE OF TRUTH):")
    print("="*70)
    for _, r in b_df.head(10).iterrows():
        print(f"Rank {int(r['rank'])}: {r['striker_name']} ({r['team']})")
        print(f"   Rating: {r['final_rating']:.2f} | Balls: {int(r['p_balls'])} | Runs: {int(r['p_runs'])} | Dism: {int(r['p_dismissals'])} | Avg: {r['p_avg']:.2f} | SR: {r['p_sr']:.2f} (Career: {r['all_sr']:.2f}, Diff: {r['sr_improvement']:+.2f}) | Bound: {r['p_boundary_pct']:.2f}% | Dot: {r['p_dot_pct']:.2f}%")
        
    print("\n" + "="*70)
    print("TOP 10 BOWLERS (SINGLE SOURCE OF TRUTH):")
    print("="*70)
    for _, r in bw_df.head(10).iterrows():
        print(f"Rank {int(r['rank'])}: {r['bowler_name']} ({r['team']})")
        print(f"   Rating: {r['final_rating']:.2f} | Overs: {r['p_overs']} ({int(r['p_legal_balls'])} legal balls) | Runs: {int(r['p_runs'])} | Wkts: {int(r['p_wickets'])} | Econ: {r['p_econ']:.2f} (Career: {r['all_econ']:.2f}, Diff: {r['econ_improvement']:+.2f} RPO) | SR: {r['p_wkt_sr']:.2f} balls/wkt | Dot: {r['p_dot_pct']:.2f}%")
    print("="*70)

