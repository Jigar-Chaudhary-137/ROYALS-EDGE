import React, { useState } from 'react';
import { X, UploadCloud, FileArchive, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { uploadZip, uploadIndividualFile } from '../api';

export default function UploadModal({ isOpen, onClose, onRefreshStatus, dataReport }) {
  const [activeMode, setActiveMode] = useState('zip'); // 'zip' or 'individual'
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleZipUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await uploadZip(file);
      setMessage(`ZIP archive processed successfully! Extracted ${res.extracted?.imported_files?.length || 0} files.`);
      onRefreshStatus();
    } catch (err) {
      setError(err.message || 'ZIP upload failed. Ensure the file is a valid zip archive.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSingleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await uploadIndividualFile(file);
      setMessage(`Uploaded ${res.filename} (${(res.size_bytes / 1024).toFixed(1)} KB) successfully.`);
      onRefreshStatus();
    } catch (err) {
      setError(err.message || 'File upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const filesStatus = dataReport?.files_status || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14213D] text-white flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <UploadCloud className="w-5 h-5 text-pink-400" />
              <span>Dataset Upload & Ingestion Centre</span>
            </h3>
            <p className="text-xs text-slate-300">Upload official competition datasets for Rajasthan Royals analytics</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50">
          <button
            onClick={() => setActiveMode('zip')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeMode === 'zip'
                ? 'border-[#E83E8C] text-[#E83E8C]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileArchive className="w-4 h-4" />
            <span>Method A: Complete ZIP Archive</span>
          </button>
          <button
            onClick={() => setActiveMode('individual')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeMode === 'individual'
                ? 'border-[#174EA6] text-[#174EA6]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Method B: Individual CSV & PDF Upload</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeMode === 'zip' ? (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
              <FileArchive className="w-12 h-12 text-[#E83E8C] mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Upload Competition Data Pack (ZIP)
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Extracts automatically, cleans macOS metadata, recursively verifies CSV tables, and loads matches, ball-by-ball, and player mappings.
              </p>
              <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#E83E8C] text-white text-xs font-bold shadow-sm hover:bg-[#d4327a] cursor-pointer">
                <UploadCloud className="w-4 h-4" />
                <span>{isUploading ? 'Extracting & Processing...' : 'Select ZIP File'}</span>
                <input type="file" accept=".zip" onChange={handleZipUpload} disabled={isUploading} className="hidden" />
              </label>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
              <FileSpreadsheet className="w-12 h-12 text-[#174EA6] mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Upload Individual CSV or PDF File
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Supported: ball_by_ball.csv, matches.csv, competitions.csv, teams.csv, playing_eleven.csv, mapping.csv, or Problem Statement PDF.
              </p>
              <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#174EA6] text-white text-xs font-bold shadow-sm hover:bg-[#123e85] cursor-pointer">
                <UploadCloud className="w-4 h-4" />
                <span>{isUploading ? 'Uploading...' : 'Choose File to Upload'}</span>
                <input type="file" accept=".csv,.pdf" onChange={handleSingleFileUpload} disabled={isUploading} className="hidden" />
              </label>
            </div>
          )}

          {/* Current Files Checklist */}
          <div>
            <h4 className="text-xs font-bold text-[#14213D] uppercase tracking-wider mb-2">
              Dataset Verification Checklist
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['ball_by_ball.csv', 'matches.csv', 'competitions.csv', 'teams.csv', 'playing_eleven.csv', 'competition_team_player_mapping.csv'].map((fname) => {
                const info = filesStatus[fname];
                const isLoaded = info && info.status === 'Loaded';
                return (
                  <div key={fname} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[170px]">{fname}</span>
                    {isLoaded ? (
                      <span className="inline-flex items-center text-emerald-600 font-semibold text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        {info.rows.toLocaleString()} rows
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium text-[10px]">Not loaded</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

