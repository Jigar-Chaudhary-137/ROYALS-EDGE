"""
Pressure Analysis Engine for Royal Scout
Calculates delivery-by-delivery pressure scores (0-100) based on match situation,
run rate requirements, wickets in hand, innings stage, and match leverage.
"""

import numpy as np
import pandas as pd

def compute_match_pressure(bbb_df: pd.DataFrame, matches_df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes delivery-level pressure index for all deliveries in the dataset.
    Returns the enriched DataFrame with pressure scores and contextual flags.
    """
    df = bbb_df.copy()
    
    # 1. Match context mapping
    matches_dict = matches_df.set_index('match_id').to_dict('index')
    
    # 2. Total runs per delivery & legal flags
    df['delivery_runs'] = df['runs'] + df['extras1_runs'].fillna(0) + df['extras_2_runs'].fillna(0)
    df['is_legal'] = ~df['extras_type'].isin(['wide', 'Overstep', 'other']) & (df['extras_type'] != 'Penalty')
    df['is_bowler_legal'] = df['is_legal']
    df['is_batter_ball'] = ~df['extras_type'].isin(['wide', 'Penalty'])
    df['is_bowler_wicket'] = df['is_wicket'] & df['dismissal_type'].isin(['Caught', 'Bowled', 'LBW', 'Stump', 'Hit Wicket'])
    
    # Runs conceded by bowler (batter runs + wide extras + no-ball extras)
    wide_mask = df['extras_type'] == 'wide'
    nb_mask = df['extras_type'].isin(['Overstep', 'other'])
    df['bowler_runs'] = df['runs'] + np.where(wide_mask | nb_mask, df['extras1_runs'].fillna(0), 0) + np.where(wide_mask, df['extras_2_runs'].fillna(0), 0)
    
    df['is_dot'] = (df['runs'] == 0) & (df['extras1_runs'].fillna(0) == 0) & (df['extras_2_runs'].fillna(0) == 0)
    df['is_boundary'] = df['is_four'].fillna(False).astype(bool) | df['is_six'].fillna(False).astype(bool)

    # 3. Innings 1 totals per match for chase target calculation
    inn1_totals = df[df['innings'] == 1].groupby('match_id')['delivery_runs'].sum().to_dict()

    # 4. Strict sort to ensure cumulative chronological order
    df = df.sort_values(['match_id', 'innings', 'overid', 'over_ball_num']).reset_index(drop=True)

    # 5. Cumulative state prior to each delivery
    df['cum_runs'] = df.groupby(['match_id', 'innings'])['delivery_runs'].cumsum() - df['delivery_runs']
    df['cum_wickets'] = df.groupby(['match_id', 'innings'])['is_wicket'].cumsum() - df['is_wicket'].astype(int)
    df['cum_legal_balls'] = df.groupby(['match_id', 'innings'])['is_legal'].cumsum() - df['is_legal'].astype(int)

    # 6. High-performance vectorized calculation
    m_ids = df['match_id'].values
    inns = df['innings'].values
    overids = df['overid'].values
    c_runs = df['cum_runs'].values
    c_wkts = df['cum_wickets'].values
    c_balls = df['cum_legal_balls'].values
    n = len(df)

    pressure_scores = np.zeros(n, dtype=np.float32)

    for i in range(n):
        mid = m_ids[i]
        inn = inns[i]
        ov = overids[i]
        cr = c_runs[i]
        cw = c_wkts[i]
        cb = c_balls[i]
        
        minfo = matches_dict.get(mid, {})
        is_ko = 1 if minfo.get('knock_out', 0) == 1 else 0
        ko_bonus = 6.0 if is_ko else 0.0
        w_hand = max(0, 10 - cw)

        if inn >= 3:
            # Super Overs: Absolute peak leverage
            pressure_scores[i] = 100.0
        elif inn == 2:
            # 2nd Innings: Target Chase
            rev_tgt = minfo.get('revised_target')
            target = rev_tgt if (pd.notna(rev_tgt) and rev_tgt > 0) else (inn1_totals.get(mid, 160) + 1)
            rev_balls = minfo.get('second_inn_revised_overs')
            max_b = int(rev_balls) if (pd.notna(rev_balls) and rev_balls > 0) else 120
            
            b_rem = max(1, max_b - cb)
            r_req = max(0, target - cr)
            rrr = (r_req / b_rem) * 6.0

            # Sub-score 1: Required Run Rate Pressure (0-100)
            if rrr <= 6.0:
                p_rrr = max(5.0, rrr * 3.0)
            elif rrr <= 9.0:
                p_rrr = 18.0 + (rrr - 6.0) * 10.0
            elif rrr <= 12.0:
                p_rrr = 48.0 + (rrr - 9.0) * 11.0
            elif rrr <= 16.0:
                p_rrr = 81.0 + (rrr - 12.0) * 3.5
            else:
                p_rrr = 95.0 + min(5.0, (rrr - 16.0) * 0.5)

            # Dampener: If match is mathematically unachievable (e.g. 50 needed off 6 balls)
            if b_rem <= 12 and r_req > 45:
                p_rrr *= 0.70

            # Sub-score 2: Wickets in Hand Vulnerability (0-100)
            if w_hand >= 9:
                p_wih = 15.0
            elif w_hand >= 7:
                p_wih = 30.0
            elif w_hand >= 5:
                p_wih = 50.0
            elif w_hand >= 3:
                p_wih = 75.0
            elif w_hand == 2:
                p_wih = 90.0
            else:
                p_wih = 100.0

            # Sub-score 3: Innings Stage Leverage (0-100)
            if ov <= 6:
                p_stage = 25.0 + ov * 2.0
            elif ov <= 15:
                p_stage = 40.0 + (ov - 6) * 3.0
            else:
                p_stage = 70.0 + (ov - 15) * 6.0

            # Sub-score 4: Match Closeness / Knife-Edge Finish (0-100)
            if ov >= 16 and r_req <= 50 and w_hand >= 2:
                p_close = 85.0 + (ov - 16) * 3.5
            elif ov >= 11 and r_req <= 80:
                p_close = 55.0 + (ov - 11) * 3.0
            else:
                p_close = 35.0

            composite = 0.35 * p_rrr + 0.25 * p_wih + 0.20 * p_stage + 0.20 * p_close + ko_bonus
            pressure_scores[i] = min(100.0, max(0.0, composite))
        else:
            # 1st Innings: Setting Par Score Under Constraints
            # Sub-score 1: Death overs urgency
            if ov >= 16:
                p_death = 72.0 + (ov - 16) * 6.0
            elif ov >= 12:
                p_death = 45.0 + (ov - 11) * 5.0
            else:
                p_death = 25.0 + ov * 2.5

            # Sub-score 2: Top-order collapse / Crisis recovery
            if ov <= 6 and w_hand <= 7:
                p_collapse = 75.0 + (8 - w_hand) * 8.0
            elif ov <= 10 and w_hand <= 5:
                p_collapse = 70.0 + (6 - w_hand) * 8.0
            elif w_hand <= 3:
                p_collapse = 80.0 + (4 - w_hand) * 10.0
            else:
                p_collapse = 20.0 + max(0, 10 - w_hand) * 3.0

            # Sub-score 3: Current run rate deficit
            crr = (cr / max(1, cb)) * 6.0 if cb > 12 else 8.0
            if crr < 6.5 and ov >= 8:
                p_crr = 65.0 + (7.0 - crr) * 8.0
            elif crr < 7.5 and ov >= 8:
                p_crr = 50.0
            else:
                p_crr = 30.0

            composite = 0.40 * p_death + 0.35 * p_collapse + 0.15 * p_crr + 3.0 + ko_bonus
            pressure_scores[i] = min(100.0, max(0.0, composite))

    df['pressure_score'] = np.round(pressure_scores, 2)
    df['is_pressure'] = df['pressure_score'] >= 70.0
    
    # Pressure tiers
    conditions = [
        df['pressure_score'] < 40.0,
        (df['pressure_score'] >= 40.0) & (df['pressure_score'] < 70.0),
        df['pressure_score'] >= 70.0
    ]
    choices = ['Low', 'Moderate', 'High']
    df['pressure_tier'] = np.select(conditions, choices, default='Moderate')

    # Stage category
    df['stage_phase'] = np.select(
        [df['overid'] <= 6, (df['overid'] >= 7) & (df['overid'] <= 15), df['overid'] >= 16],
        ['Powerplay (1-6)', 'Middle Overs (7-15)', 'Death Overs (16-20)'],
        default='Middle Overs (7-15)'
    )

    return df

