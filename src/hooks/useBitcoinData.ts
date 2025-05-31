import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  fetchBitcoinPrice,
  fetchLatestBlock,
  fetchRecentBlocks,
  fetchMempoolInfo,
  fetchFeeEstimates,
  fetchHashrateAndDifficulty,
  fetchMiningPoolDistribution,
} from '../lib/bitcoinApi';
import { DashboardData, UnitMode } from '../lib/types';

export function useBitcoinData() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [unitMode, setUnitMode] = useState<UnitMode>('btc');

  const {
    data: price,
    isLoading: priceLoading,
    error: priceError,
  } = useQuery({
    queryKey: ['bitcoin-price'],
    queryFn: fetchBitcoinPrice,
    refetchInterval: autoRefresh ? 30000 : false, // 30 seconds
    retry: 3,
  });

  const {
    data: latestBlock,
    isLoading: blockLoading,
    error: blockError,
  } = useQuery({
    queryKey: ['latest-block'],
    queryFn: fetchLatestBlock,
    refetchInterval: autoRefresh ? 60000 : false, // 1 minute
    retry: 3,
  });

  const {
    data: recentBlocks,
    isLoading: recentBlocksLoading,
    error: recentBlocksError,
  } = useQuery({
    queryKey: ['recent-blocks'],
    queryFn: () => fetchRecentBlocks(6),
    refetchInterval: autoRefresh ? 60000 : false, // 1 minute
    retry: 3,
  });

  const {
    data: mempool,
    isLoading: mempoolLoading,
    error: mempoolError,
  } = useQuery({
    queryKey: ['mempool'],
    queryFn: fetchMempoolInfo,
    refetchInterval: autoRefresh ? 30000 : false, // 30 seconds
    retry: 3,
  });

  const {
    data: fees,
    isLoading: feesLoading,
    error: feesError,
  } = useQuery({
    queryKey: ['fees'],
    queryFn: fetchFeeEstimates,
    refetchInterval: autoRefresh ? 30000 : false, // 30 seconds
    retry: 3,
  });

  const {
    data: hashrateDifficulty,
    isLoading: hashrateLoading,
    error: hashrateError,
  } = useQuery({
    queryKey: ['hashrate-difficulty'],
    queryFn: fetchHashrateAndDifficulty,
    refetchInterval: autoRefresh ? 300000 : false, // 5 minutes
    retry: 3,
  });

  const {
    data: miningPools,
    isLoading: miningPoolsLoading,
    error: miningPoolsError,
  } = useQuery({
    queryKey: ['mining-pools'],
    queryFn: fetchMiningPoolDistribution,
    refetchInterval: autoRefresh ? 600000 : false, // 10 minutes
    retry: 3,
  });

  const isLoading = 
    priceLoading || 
    blockLoading || 
    recentBlocksLoading || 
    mempoolLoading || 
    feesLoading || 
    hashrateLoading || 
    miningPoolsLoading;

  const hasError = 
    priceError || 
    blockError || 
    recentBlocksError || 
    mempoolError || 
    feesError || 
    hashrateError || 
    miningPoolsError;

  const errorCount = [priceError, blockError, recentBlocksError, mempoolError, feesError, hashrateError, miningPoolsError].filter(Boolean).length;

  const dashboardData: DashboardData = {
    price: price || null,
    latestBlock: latestBlock || null,
    recentBlocks: recentBlocks || [],
    mempool: mempool || null,
    fees: fees || null,
    hashrateDifficulty: hashrateDifficulty || null,
    miningPools: miningPools || [],
  };

  // Save unit preference to localStorage
  useEffect(() => {
    const savedUnit = localStorage.getItem('bitcoin-dashboard-unit');
    if (savedUnit === 'btc' || savedUnit === 'sats') {
      setUnitMode(savedUnit);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bitcoin-dashboard-unit', unitMode);
  }, [unitMode]);

  return {
    data: dashboardData,
    isLoading,
    hasError,
    errorCount,
    autoRefresh,
    setAutoRefresh,
    unitMode,
    setUnitMode,
  };
}
