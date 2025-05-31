import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BitcoinPrice, UnitMode } from '../../lib/types';
import { formatSatsNumber } from '../../lib/bitcoinApi';

interface PriceCardProps {
  price: BitcoinPrice | null;
  unitMode: UnitMode;
}

export function PriceCard({ price, unitMode }: PriceCardProps) {
  if (!price) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            Bitcoin Price
            <div className="text-sm text-gray-500">Loading...</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = price.usd_24h_change >= 0;
  const satPrice = price.usd / 100000000;
  const satsPerUsd = 1 / price.usd * 100000000;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Bitcoin Price
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-success' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{price.usd_24h_change.toFixed(1)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="overflow-hidden">
            {unitMode === 'btc' ? (
              <>
                <div className="text-3xl font-bold text-gray-900 break-words">
                  ${price.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-500 break-all">
                  1 sat = ${satPrice.toFixed(8)}
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900 break-words" title={`${satsPerUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} sats per USD`}>
                  {formatSatsNumber(satsPerUsd)} sats
                </div>
                <div className="text-sm text-gray-500 break-all" title={`1 USD = ${satsPerUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} satoshis`}>
                  per $1 USD
                </div>
              </>
            )}
          </div>
          
          <div className="pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-600 mb-2">24h Volume</div>
            <div className="text-lg font-semibold text-gray-900">
              ${price.usd_24h_vol.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short' })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
