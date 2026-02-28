"use client";

import { Component, type ReactNode } from "react";
import { Shield, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
    // In production, send to Sentry / PostHog
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] flex items-center justify-center px-6">
          <div className="glass rounded-2xl p-10 max-w-md text-center">
            <div className="w-14 h-14 rounded-full bg-uc-red/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-uc-red" size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Something went wrong</h3>
            <p className="text-sm text-uc-gray-400 mb-6 leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 text-sm font-semibold hover:bg-uc-cyan/20 transition-colors"
            >
              <RefreshCw size={14} />
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
