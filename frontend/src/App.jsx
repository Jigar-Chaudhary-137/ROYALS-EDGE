import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UploadModal from './components/UploadModal';

import Overview from './pages/Overview';
import DataExplorer from './pages/DataExplorer';
import PressureEngine from './pages/PressureEngine';
import BatterRankings from './pages/BatterRankings';
import BowlerRankings from './pages/BowlerRankings';
import PlayerProfiles from './pages/PlayerProfiles';
import PlayerComparison from './pages/PlayerComparison';
import RRRecommendations from './pages/RRRecommendations';
import Methodology from './pages/Methodology';
import ExportCentre from './pages/ExportCentre';

import { fetchStatus, fetchOverview, runAnalysis } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [comparePlayerA, setComparePlayerA] = useState(4708);
  const [comparePlayerB, setComparePlayerB] = useState(6396);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const s = await fetchStatus();
      setStatus(s);
      if (s.is_analyzed) {
        const o = await fetchOverview();
        setOverviewData(o);
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    showToast("Launching complete data processing & analytical engine...", "info");
    try {
      const res = await runAnalysis();
      showToast("Analysis complete! Player rankings & PDF report regenerated.", "success");
      await loadInitialData();
    } catch (err) {
      showToast(err.message || "Analysis failed. Ensure datasets are valid.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayerId(playerId);
    setActiveTab('profiles');
  };

  const handleCompareWithPlayer = (playerId) => {
    setComparePlayerA(playerId);
    setActiveTab('comparison');
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex flex-col font-sans antialiased text-[#172033]">
      {/* Top Navigation Bar with Global Search */}
      <Navbar
        status={status}
        activeTab={activeTab}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onRunAnalysis={handleRunAnalysis}
        isAnalyzing={isAnalyzing}
        onNavigate={(tab) => setActiveTab(tab)}
        onSelectPlayer={handleSelectPlayer}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Responsive Layout */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full overflow-y-auto">
          {activeTab === 'overview' && (
            <Overview
              overviewData={overviewData}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectPlayer={handleSelectPlayer}
            />
          )}

          {activeTab === 'explorer' && (
            <DataExplorer dataReport={status?.data_report} />
          )}

          {activeTab === 'pressure' && (
            <PressureEngine />
          )}

          {activeTab === 'batters' && (
            <BatterRankings onSelectPlayer={handleSelectPlayer} />
          )}

          {activeTab === 'bowlers' && (
            <BowlerRankings onSelectPlayer={handleSelectPlayer} />
          )}

          {activeTab === 'profiles' && (
            <PlayerProfiles
              initialPlayerId={selectedPlayerId}
              onNavigate={(tab) => setActiveTab(tab)}
              onCompareWithPlayer={handleCompareWithPlayer}
            />
          )}

          {activeTab === 'comparison' && (
            <PlayerComparison
              initialPlayerAId={comparePlayerA}
              initialPlayerBId={comparePlayerB}
              onSelectPlayer={handleSelectPlayer}
            />
          )}

          {activeTab === 'recommendations' && (
            <RRRecommendations onSelectPlayer={handleSelectPlayer} />
          )}

          {activeTab === 'methodology' && (
            <Methodology />
          )}

          {activeTab === 'exports' && (
            <ExportCentre overviewData={overviewData} />
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onRefreshStatus={loadInitialData}
        dataReport={status?.data_report}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold bg-[#14213D] text-white border-slate-700 transition-all animate-bounce">
          <div
            className={`w-2 h-2 rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-500'
                : 'bg-pink-400'
            }`}
          />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
