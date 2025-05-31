import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MempoolInfo, FeeEstimates } from '../../lib/types';
import { formatBytes } from '../../lib/bitcoinApi';

interface MempoolCardProps {
  mempool: MempoolInfo | null;
  fees: FeeEstimates | null;
}

export function MempoolCard({ mempool, fees }: MempoolCardProps) {
  if (!mempool || !fees) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Mempool Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
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
        <CardTitle className="text-lg font-semibold">Mempool Status</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-bitcoin">
              {formatBytes(mempool.vsize)}
            </div>
            <div className="text-sm text-gray-600">Mempool Size</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900">
              {mempool.count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Unconfirmed Txs</div>
          </div>
          
          <div className="pt-3 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-700 mb-2">Fee Estimates (sat/vB)</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Economy:</span>
                <span className="text-sm font-medium">{fees.economyFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Standard:</span>
                <span className="text-sm font-medium">{fees.hourFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Priority:</span>
                <span className="text-sm font-medium text-bitcoin">{fees.fastestFee}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
