import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UploadModal from './components/UploadModal';
import ErrorBoundary from './components/ErrorBoundary';

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

// Route Parser helper from window.location.pathname
function parseRouteFromUrl() {
  if (typeof window === 'undefined') return { tab: 'overview', playerId: null };
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  if (!path) return { tab: 'overview', playerId: null };

  const segments = path.split('/');
  if (segments[0] === 'players' || segments[0] === 'player') {
    const id = parseInt(segments[1], 10);
    return { tab: 'profiles', playerId: !isNaN(id) ? id : 4708 };
  }

  const validTabs = [
    'overview', 'explorer', 'pressure', 'batters', 'bowlers',
    'profiles', 'comparison', 'recommendations', 'methodology', 'exports'
  ];
  if (validTabs.includes(segments[0])) {
    return { tab: segments[0], playerId: null };
  }

  return { tab: 'overview', playerId: null };
}

export default function App() {
  const initialRoute = parseRouteFromUrl();
  const [activeTab, setActiveTab] = useState(initialRoute.tab);
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialRoute.playerId || 4708);
  const [status, setStatus] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparePlayerA, setComparePlayerA] = useState(4708);
  const [comparePlayerB, setComparePlayerB] = useState(6396);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadInitialData();

    // Listen to browser Back / Forward events
    const onPopState = () => {
      const route = parseRouteFromUrl();
      setActiveTab(route.tab);
      if (route.playerId) {
        setSelectedPlayerId(route.playerId);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
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

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    if (window.history && window.history.pushState) {
      const url = tab === 'overview' ? '/' : `/${tab}`;
      if (window.location.pathname !== url) {
        window.history.pushState(null, '', url);
      }
    }
  };

  const handleSelectPlayer = (playerId) => {
    const numId = parseInt(playerId, 10);
    if (!numId) return;
    setSelectedPlayerId(numId);
    setActiveTab('profiles');
    if (window.history && window.history.pushState) {
      const url = `/players/${numId}`;
      if (window.location.pathname !== url) {
        window.history.pushState(null, '', url);
      }
    }
  };

  const handleCompareWithPlayer = (playerId) => {
    const numId = parseInt(playerId, 10);
    setComparePlayerA(numId);
    setActiveTab('comparison');
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '/comparison');
    }
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
        onNavigate={handleNavigate}
        onSelectPlayer={handleSelectPlayer}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Responsive Layout */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Main Content Area protected by ErrorBoundary */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full overflow-y-auto">
          <ErrorBoundary onReset={() => handleNavigate('overview')}>
            {activeTab === 'overview' && (
              <Overview
                overviewData={overviewData}
                onNavigate={handleNavigate}
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
                onNavigate={handleNavigate}
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
          </ErrorBoundary>
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
