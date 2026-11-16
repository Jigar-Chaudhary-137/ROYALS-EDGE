import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Layers,
  Code2,
  Scale,
  AlertTriangle,
  Flame,
  Award,
  Shield
} from 'lucide-react';

export default function Methodology() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-extrabold text-[#14213D] flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-[#E83E8C]" />
          <span>Methodology, Mathematical Formulations & Transparency</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Complete, reproducible technical documentation defining pressure scoring, player baselines, Bayesian shrinkage, and fair comparison rules.
        </p>
      </div>

      {/* Section 1: Objective & ICC Rules Compliance */}
      <div className="rr-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-[#14213D] uppercase tracking-wider text-[#E83E8C]">
          1. Objective & Cricket Rule Integrity
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          The challenge asks us to build an objective system measuring how batters and bowlers perform in high-pressure match situations compared with normal performance levels, and to rank the most reliable players from 2022 onwards across 883 matches.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-[#14213D] block mb-1">Batting Ball Counting & Runs:</strong>
            <p className="text-slate-600 leading-relaxed">
              In strict adherence to ICC rules, wides and penalty deliveries are excluded from balls faced. When a bowler bowls a no-ball (Overstep or fielding violation), the batter faces that delivery. Batter dismissals credit all dismissals where the player lost their wicket, regardless of striker or non-striker position on run-outs.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-[#14213D] block mb-1">Bowler Legal Deliveries & Wickets:</strong>
            <p className="text-slate-600 leading-relaxed">
              Wides and no-balls are illegal deliveries and excluded from bowler legal overs and economy denominator. Bowler runs conceded charge batter runs off the bat + wide extras + no-ball extras. Leg-byes, byes, and penalty runs are strictly excluded. Run-outs and retire-outs are excluded from bowler wickets.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Match Pressure Index (MPI) Formula */}
      <div className="rr-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-[#14213D] uppercase tracking-wider text-[#174EA6]">
          2. Match Pressure Index (MPI) Formulation
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          Pressure is defined as a continuous delivery-by-delivery state function $P \in [0, 100]$. The formula differs based on innings context:
        </p>

        {/* Innings 2 Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2">
          <span className="text-pink-400 font-bold block">// Innings 2: Run Chase Vector</span>
          <p className="text-emerald-400">
            P_inn2 = 0.35 * P_RRR + 0.25 * P_WIH + 0.20 * P_Stage + 0.20 * P_Close + KO_Bonus
          </p>
          <div className="text-[11px] text-slate-300 font-sans space-y-1 pt-1">
            <p>• <strong>P_RRR (35%):</strong> Scales from 15 (RRR &le; 6.0) to 48 (RRR = 9.0) to 81 (RRR = 12.0) up to 95+ (RRR &ge; 16.0). Incorporates closeness dampener for mathematically decided chases.</p>
            <p>• <strong>P_WIH (25%):</strong> Wickets in hand vulnerability. 9-10 wickets = 15 points; &le;3 wickets = 75–100 points.</p>
            <p>• <strong>P_Stage (20%):</strong> Over 1-6 = 25-37; Over 7-15 = 40-67; Over 16-20 (Death) = 70-100.</p>
            <p>• <strong>P_Close (20%):</strong> Match outcome knife-edge leverage during final 4 overs with achievable target (&le;50 runs).</p>
            <p>• <strong>KO_Bonus:</strong> +6.0 points for IPL Playoff / Tournament Knockout fixtures.</p>
          </div>
        </div>

        {/* Innings 1 Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2">
          <span className="text-blue-400 font-bold block">// Innings 1: Target Setting Par Vector</span>
          <p className="text-emerald-400">
            P_inn1 = 0.40 * P_Death + 0.35 * P_Collapse + 0.15 * P_CRR + 3.0 + KO_Bonus
          </p>
          <div className="text-[11px] text-slate-300 font-sans space-y-1 pt-1">
            <p>• <strong>P_Death (40%):</strong> Critical death overs acceleration (overs 16–20 = 72 to 96 points).</p>
            <p>• <strong>P_Collapse (35%):</strong> Early top-order collapse (e.g. losing 3+ wickets inside Powerplay = 75 to 99 points).</p>
            <p>• <strong>P_CRR (15%):</strong> Run rate deficit below par (CRR &lt; 6.5 after Over 8).</p>
          </div>
        </div>

        <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-slate-700">
          <strong>Pressure Threshold Validation:</strong> Deliveries with $P \ge 70.0$ are classified as <strong>High Pressure</strong> (representing 9.2% of all deliveries in the competition dataset). All player pressure ratings are evaluated on this specific crucible.
        </div>
      </div>

      {/* Section 3: Empirical Bayes Shrinkage */}
      <div className="rr-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-[#14213D] uppercase tracking-wider text-[#E83E8C]">
          3. Empirical Bayes Shrinkage & Sample Size Reliability
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          In cricket analytics, players with tiny samples (e.g. 15 balls) can exhibit distorted strike rates or averages. To avoid rewarding fluke single-match performances, we apply <strong>Empirical Bayes Shrinkage</strong> with a prior parameter $K = 40$ deliveries:
        </p>

        <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-1">
          <p className="text-pink-400">Weight_sample = N_balls / (N_balls + 40.0)</p>
          <p className="text-emerald-400">Adjusted_Metric = Weight_sample * Player_Raw + (1 - Weight_sample) * Population_Mean</p>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          As a player's pressure sample size grows beyond 140 balls, their weight approaches 1.0 (raw performance preserved). For players near the minimum threshold (45 balls), their statistics are regressed toward the cohort average, guaranteeing defensible rankings.
        </p>
      </div>

      {/* Section 4: Rating Weights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batting Formula */}
        <div className="rr-card p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E83E8C] mb-2 flex items-center space-x-1.5">
            <Award className="w-4 h-4" />
            <span>Batting Pressure Rating Formula</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Adjusted Pressure Strike Rate</span>
              <strong className="text-[#14213D]">28% Weight</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Adjusted Batting Average (Not-out preserved)</span>
              <strong className="text-[#14213D]">22% Weight</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Strike Rate Improvement (vs Normal)</span>
              <strong className="text-[#14213D]">20% Weight</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Boundary Percentage under Pressure</span>
              <strong className="text-[#14213D]">15% Weight</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Dot Ball Suppression under Pressure</span>
              <strong className="text-[#14213D]">15% Weight</strong>
            </div>
          </div>
        </div>

        {/* Bowling Formula */}
        <div className="rr-card p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#174EA6] mb-2 flex items-center space-x-1.5">
            <Shield className="w-4 h-4" />
            <span>Bowling Pressure Rating Formula</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Adjusted Pressure Economy Rate (Inverted)</span>
              <strong className="text-[#14213D]">28% Weight</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Adjusted Wicket Strike Rate (Balls / Wkt)</span>
              <strong className="text-[#14213D]">28% Weight</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Economy Improvement (vs Normal)</span>
              <strong className="text-[#14213D]">16% Weight</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Dot Ball Generation Percentage</span>
              <strong className="text-[#14213D]">14% Weight</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Boundary Conceded Suppression</span>
              <strong className="text-[#14213D]">14% Weight</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Limitations */}
      <div className="rr-card p-6 bg-slate-50 border border-slate-200">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Analytical Limitations & Nuances</span>
        </h3>
        <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 leading-relaxed">
          <li><strong>Impact Player Dynamics:</strong> Introduced in IPL 2023, the Impact Player deepened batting depth, altering conservative risk profiles for finishers.</li>
          <li><strong>Venue Dimension Variance:</strong> Grounds such as Wankhede and Chinnaswamy feature shorter boundary dimensions than Sawai Mansingh Stadium or Chepauk. The model balances this via relative improvement deltas.</li>
          <li><strong>Entry Point Variance:</strong> Specialist finishers facing 10 balls at death experience different boundary probabilities than top-order anchors batting through 18 overs.</li>
        </ul>
      </div>
    </div>
  );
}

