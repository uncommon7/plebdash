import { RefreshCw } from 'lucide-react';
import { UnitMode } from '../../lib/types';

interface UnitToggleProps {
  unitMode: UnitMode;
  onUnitChange: (mode: UnitMode) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (enabled: boolean) => void;
}

export function UnitToggle({
  unitMode,
  onUnitChange,
  autoRefresh,
  onAutoRefreshChange,
}: UnitToggleProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Units:</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onUnitChange('btc')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              unitMode === 'btc'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            BTC/USD
          </button>
          <button
            onClick={() => onUnitChange('sats')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              unitMode === 'sats'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sats/USD
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <RefreshCw className={`h-4 w-4 text-gray-400 ${autoRefresh ? 'animate-spin' : ''}`} />
        <span className="text-sm text-gray-600">
          Auto-refresh:{' '}
          <button
            onClick={() => onAutoRefreshChange(!autoRefresh)}
            className={`font-medium ${
              autoRefresh ? 'text-green-success' : 'text-gray-500'
            }`}
          >
            {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </span>
      </div>
    </div>
  );
}
