import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Block, HashrateDifficulty } from '../../lib/types';
import { formatHashrate, formatDifficulty, formatTimeAgo, formatDuration } from '../../lib/bitcoinApi';

interface NetworkStatsCardProps {
  latestBlock: Block | null;
  hashrateDifficulty: HashrateDifficulty | null;
}

export function NetworkStatsCard({ latestBlock, hashrateDifficulty }: NetworkStatsCardProps) {
  if (!latestBlock || !hashrateDifficulty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Network Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Network Statistics</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-deep">
              {latestBlock.height.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Block Height</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatDifficulty(hashrateDifficulty.difficulty)}
            </div>
            <div className="text-sm text-gray-600">Difficulty</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-bitcoin">
              {formatHashrate(hashrateDifficulty.hashrate)}
            </div>
            <div className="text-sm text-gray-600">Hashrate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-success">
              {hashrateDifficulty.adjustmentProgress.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Adjustment</div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Latest Block:</span>
            <span className="font-medium font-mono text-xs">
              {latestBlock.id.substring(0, 20)}...
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Block Time:</span>
            <span className="font-medium">
              {formatTimeAgo(latestBlock.timestamp)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Time to next adjustment:</span>
            <span className="font-medium">
              {formatDuration(hashrateDifficulty.timeToAdjustment)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
