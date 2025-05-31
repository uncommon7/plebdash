import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MiningPool } from '../../lib/types';

interface MiningPoolsCardProps {
  miningPools: MiningPool[];
}

export function MiningPoolsCard({ miningPools }: MiningPoolsCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [showAll, setShowAll] = useState(false);
  
  const displayedPools = showAll ? miningPools : miningPools.slice(0, 10);
  const hasMorePools = miningPools.length > 10;

  useEffect(() => {
    if (!canvasRef.current || miningPools.length === 0) return;

    // Dynamically import Chart.js to avoid SSR issues
    import('chart.js/auto').then((Chart) => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;

      chartRef.current = new Chart.default(ctx, {
        type: 'doughnut',
        data: {
          labels: miningPools.map(pool => pool.name),
          datasets: [{
            data: miningPools.map(pool => pool.percentage),
            backgroundColor: miningPools.map(pool => pool.color),
            borderWidth: 2,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            }
          },
          cutout: '60%'
        }
      });
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [miningPools]);

  if (miningPools.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            Mining Pool Distribution
            <div className="text-sm text-gray-600">Loading...</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Mining Pool Distribution
          <div className="text-sm text-gray-600">Last 144 blocks</div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Mining Pool Chart */}
          <div className="flex justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
              <canvas ref={canvasRef} />
            </div>
          </div>
          
          {/* Mining Pool List */}
          <div className="space-y-3">
            {displayedPools.map((pool, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: pool.color }}
                  />
                  <span className="font-medium text-gray-900 truncate" title={pool.name}>
                    {pool.name === 'Unknown Pool' ? 'Unknown (Unidentified Pool)' : pool.name}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-gray-900">
                    {pool.percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {pool.blocks} blocks
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show More/Less Button */}
            {hasMorePools && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 mr-2">
                  {showAll ? 'Show Less' : `Show ${miningPools.length - 10} More`}
                </span>
                {showAll ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
