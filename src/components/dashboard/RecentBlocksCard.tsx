import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Block } from '../../lib/types';
import { formatTimeAgo, formatBytes } from '../../lib/bitcoinApi';

interface RecentBlocksCardProps {
  recentBlocks: Block[];
}

export function RecentBlocksCard({ recentBlocks }: RecentBlocksCardProps) {
  if (recentBlocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            Recent Blocks
            <div className="text-sm text-gray-600">Loading...</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Recent Blocks
          <div className="text-sm text-gray-600">Last {recentBlocks.length} blocks</div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-600">Height</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-600 hidden sm:table-cell">Hash</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-600">Time</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-600">Txs</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-600 hidden md:table-cell">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBlocks.map((block) => (
                <tr key={block.id} className="hover:bg-gray-50">
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-medium text-blue-deep">
                    {block.height.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                    {block.id.substring(0, 20)}...
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm text-gray-600">
                    {formatTimeAgo(block.timestamp)}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm text-gray-900">
                    {block.tx_count.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                    {formatBytes(block.size)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
