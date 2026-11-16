import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ROYAL SCOUT Component Render Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-black text-[#14213D]">
            Display Exception Encountered
          </h2>

          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            {this.state.error?.message || "An unexpected error occurred while rendering this view. Our data-pipeline remains completely intact."}
          </p>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#E83E8C] text-white text-xs font-bold hover:bg-[#d4327a] transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Component</span>
            </button>

            <a
              href="/"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 text-[#14213D] bg-slate-50 text-xs font-bold hover:bg-slate-100 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

