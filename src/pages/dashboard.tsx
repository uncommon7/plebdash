import { Bitcoin } from 'lucide-react';
import { useBitcoinData } from '../hooks/useBitcoinData';
import { PriceCard } from '../components/dashboard/PriceCard';
import { NetworkStatsCard } from '../components/dashboard/NetworkStatsCard';
import { MempoolCard } from '../components/dashboard/MempoolCard';
import { MiningPoolsCard } from '../components/dashboard/MiningPoolsCard';
import { RecentBlocksCard } from '../components/dashboard/RecentBlocksCard';
import { UnitToggle } from '../components/dashboard/UnitToggle';
import { LoadingOverlay } from '../components/dashboard/LoadingOverlay';

export default function Dashboard() {
  const {
    data,
    isLoading,
    hasError,
    errorCount,
    autoRefresh,
    setAutoRefresh,
    unitMode,
    setUnitMode,
  } = useBitcoinData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Bitcoin className="h-8 w-8 text-bitcoin" />
              <h1 className="text-2xl font-bold text-gray-900">Bitcoin Network Dashboard</h1>
            </div>
            
            <UnitToggle
              unitMode={unitMode}
              onUnitChange={setUnitMode}
              autoRefresh={autoRefresh}
              onAutoRefreshChange={setAutoRefresh}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {hasError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium">Unable to fetch some data</div>
            <div className="text-red-600 text-sm mt-1">
              Some Bitcoin network data may be unavailable. Please check your connection and try again.
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Price Card */}
          <div className="lg:col-span-1 xl:col-span-1">
            <PriceCard price={data.price} unitMode={unitMode} />
          </div>

          {/* Network Stats Card */}
          <div className="lg:col-span-2 xl:col-span-2">
            <NetworkStatsCard 
              latestBlock={data.latestBlock}
              hashrateDifficulty={data.hashrateDifficulty}
            />
          </div>

          {/* Mempool Card */}
          <div className="lg:col-span-1 xl:col-span-1">
            <MempoolCard mempool={data.mempool} fees={data.fees} />
          </div>

          {/* Mining Pools Card */}
          <div className="lg:col-span-3 xl:col-span-4">
            <MiningPoolsCard miningPools={data.miningPools} />
          </div>

          {/* Recent Blocks Card */}
          <div className="lg:col-span-3 xl:col-span-4">
            <RecentBlocksCard recentBlocks={data.recentBlocks} />
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}
