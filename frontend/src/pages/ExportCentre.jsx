import React, { useState } from 'react';
import {
  DownloadCloud,
  FileText,
  FileSpreadsheet,
  FileArchive,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function ExportCentre({ overviewData }) {
  const [copied, setCopied] = useState(false);

  const topBatters = overviewData?.top_batters_podium || [];
  const topBowlers = overviewData?.top_bowlers_podium || [];

  const unstopSummaryText = `RAJASTHAN ROYALS | SupeRR Selector Season 2 - Round 1 Submission
Platform: ROYAL SCOUT
Evaluation Code: SUPER-RR-S2-R1

TOP 10 BATTERS UNDER PRESSURE (MPI >= 70.0):
Rank 1: Rinku Singh (Kolkata Knight Riders / India) - Rating: 97.01/100 (Pressure SR: 225.75, SR Diff: +73.07, Avg: 125.67, Balls: 167)
Rank 2: Tim David (Royal Challengers Bengaluru / Australia) - Rating: 69.16/100 (Pressure SR: 211.69, SR Diff: +34.04, Avg: 40.38, Balls: 248)
Rank 3: David Miller (Delhi Capitals / South Africa) - Rating: 62.27/100 (Pressure SR: 225.69, SR Diff: +76.39, Avg: 41.00, Balls: 109)
Rank 4: Mahendra Singh Dhoni (Chennai Super Kings / India) - Rating: 60.78/100 (Pressure SR: 184.07, SR Diff: +34.39, Avg: 30.45, Balls: 182)
Rank 5: Ravindra Jadeja (Rajasthan Royals / India) - Rating: 59.56/100 (Pressure SR: 169.64, SR Diff: +34.57, Avg: 40.71, Balls: 168)
Rank 6: Rashid Khan (Gujarat Titans / Afghanistan) - Rating: 58.11/100 (Pressure SR: 188.56, SR Diff: +32.54, Avg: 21.19, Balls: 236)
Rank 7: Namboori Tilak Varma (Mumbai Indians / India) - Rating: 57.45/100 (Pressure SR: 179.25, SR Diff: +36.27, Avg: 28.50, Balls: 159)
Rank 8: Rovman Powell (Kolkata Knight Riders / West Indies) - Rating: 57.13/100 (Pressure SR: 180.57, SR Diff: +33.81, Avg: 21.17, Balls: 211)
Rank 9: Shubham Dubey (Rajasthan Royals / India) - Rating: 56.10/100 (Pressure SR: 223.40, SR Diff: +69.55, Avg: 52.50, Balls: 47)
Rank 10: Rahul Tewatia (Gujarat Titans / India) - Rating: 55.67/100 (Pressure SR: 177.22, SR Diff: +28.17, Avg: 21.54, Balls: 158)

TOP 10 BOWLERS UNDER PRESSURE (MPI >= 70.0):
Rank 1: Rashid Khan (Gujarat Titans / Afghanistan) - Rating: 72.13/100 (Pressure Econ: 6.87, Econ Diff: +0.56 RPO, Wkts: 29, Overs: 41.3)
Rank 2: Jasprit Bumrah (Mumbai Indians / India) - Rating: 70.32/100 (Pressure Econ: 6.51, Econ Diff: +0.76 RPO, Wkts: 19, Overs: 35.0)
Rank 3: Mustafizur Rahman (Kolkata Knight Riders / Bangladesh) - Rating: 69.91/100 (Pressure Econ: 6.91, Econ Diff: +0.88 RPO, Wkts: 22, Overs: 38.3)
Rank 4: Abrar Ahmed (Pakistan (International)) - Rating: 69.01/100 (Pressure Econ: 3.69, Econ Diff: +2.99 RPO, Dot%: 57.8%, Wkts: 7)
Rank 5: Varun Chakravarthy (Kolkata Knight Riders / India) - Rating: 68.81/100 (Pressure Econ: 7.27, Econ Diff: +0.72 RPO, Wkts: 19, Overs: 30.4)
Rank 6: Yuzvendra Chahal (Punjab Kings / India) - Rating: 66.11/100 (Pressure Econ: 7.46, Econ Diff: +1.16 RPO, Wkts: 22, Overs: 24.0)
Rank 7: Shaheen Afridi (Pakistan (International)) - Rating: 62.54/100 (Pressure Econ: 7.44, Econ Diff: +0.57 RPO, Wkts: 15, Overs: 27.5)
Rank 8: Kuldeep Yadav (Delhi Capitals / India) - Rating: 60.72/100 (Pressure Econ: 6.54, Econ Diff: +1.48 RPO, Wkts: 18, Overs: 16.4)
Rank 9: Maheesh Theekshana (Rajasthan Royals / Sri Lanka) - Rating: 59.73/100 (Pressure Econ: 7.54, Econ Diff: +0.23 RPO, Wkts: 13, Overs: 25.2)
Rank 10: Sufiyan Muqeem (Pakistan (International)) - Rating: 58.11/100 (Pressure Econ: 5.93, Dot%: 56.8%, Wkts: 10, Overs: 13.3)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(unstopSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-extrabold text-[#14213D] flex items-center space-x-2">
          <DownloadCloud className="w-5 h-5 text-[#E83E8C]" />
          <span>Competition Deliverables & Export Centre</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Download publication-grade methodology PDF report, Top 10 rankings CSVs, and the complete submission deliverable package for Rajasthan Royals evaluation.
        </p>
      </div>

      {/* Master Package Banner */}
      <div className="rr-card p-6 bg-gradient-to-r from-[#14213D] via-[#1E293B] to-[#174EA6] text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL COMPETITION BUNDLE</span>
            </div>
            <h3 className="text-xl font-extrabold">Complete Submission Deliverables ZIP Pack</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Bundles the 9-page Methodology PDF, Top 10 Batters CSV, Top 10 Bowlers CSV, Full Cohort Datasets, Problem Statement copy, and official Submission Readme.
            </p>
          </div>

          <a
            href="/api/download/submission-zip"
            download="ROYAL_SCOUT_SUBMISSION_PACK.zip"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#E83E8C] hover:bg-[#d4327a] text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Download Master ZIP Pack</span>
          </a>
        </div>
      </div>

      {/* Individual Deliverables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* PDF Methodology Report */}
        <div className="rr-card p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E83E8C] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-[#14213D] mb-1">
              Methodology Report (PDF)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              9-page publication-quality document containing executive summary, mathematical formulas, embedded visual charts, and Top 3 breakdowns.
            </p>
          </div>

          <a
            href="/api/download/pdf"
            download="ROYAL_SCOUT_Methodology_Report.pdf"
            className="w-full py-2.5 rounded-lg bg-[#14213D] text-white text-xs font-bold hover:bg-[#1a2d52] transition-colors flex items-center justify-center space-x-2"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-pink-400" />
            <span>Download Report PDF</span>
          </a>
        </div>

        {/* Top 10 Batters CSV */}
        <div className="rr-card p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E83E8C] flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-[#14213D] mb-1">
              Top 10 Batters CSV
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Clean tabular CSV containing official Rank 1 through 10 batters with strike rates, averages, sample sizes, and ratings.
            </p>
          </div>

          <a
            href="/api/download/csv/batters"
            download="top_10_batters.csv"
            className="w-full py-2.5 rounded-lg border border-slate-300 text-[#14213D] bg-white text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Batters CSV</span>
          </a>
        </div>

        {/* Top 10 Bowlers CSV */}
        <div className="rr-card p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#174EA6] flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-[#14213D] mb-1">
              Top 10 Bowlers CSV
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Clean tabular CSV containing official Rank 1 through 10 bowlers with overs, wickets, pressure economies, and ratings.
            </p>
          </div>

          <a
            href="/api/download/csv/bowlers"
            download="top_10_bowlers.csv"
            className="w-full py-2.5 rounded-lg border border-slate-300 text-[#14213D] bg-white text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Bowlers CSV</span>
          </a>
        </div>

        {/* Full Batters Rankings CSV */}
        <div className="rr-card p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-[#14213D] mb-1">
              Full Batters Cohort (118 Players)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Comprehensive analytics dataset for all 118 eligible batters evaluated across 2022–2026.
            </p>
          </div>

          <a
            href="/api/download/csv/all_batters"
            download="all_batters_rankings.csv"
            className="w-full py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors text-center"
          >
            Download Full Batting CSV
          </a>
        </div>

        {/* Full Bowlers Rankings CSV */}
        <div className="rr-card p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-[#14213D] mb-1">
              Full Bowlers Cohort (92 Players)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Comprehensive analytics dataset for all 92 eligible bowlers evaluated across 2022–2026.
            </p>
          </div>

          <a
            href="/api/download/csv/all_bowlers"
            download="all_bowlers_rankings.csv"
            className="w-full py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors text-center"
          >
            Download Full Bowling CSV
          </a>
        </div>
      </div>

      {/* Copyable Unstop Submission Helper */}
      <div className="rr-card p-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#14213D]">
              Unstop Submission Dropdown Reference Card
            </h3>
            <p className="text-xs text-slate-500">
              Exact rank-ordered list to select in the Unstop Rank 1 to Rank 10 dropdown menus
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary Text</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-700">
          {unstopSummaryText}
        </pre>
      </div>
    </div>
  );
}

