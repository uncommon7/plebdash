export interface BitcoinPrice {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  last_updated_at: number;
}

export interface Block {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash: string;
  mediantime: number;
  nonce: number;
  bits: number;
  difficulty: number;
}

export interface MempoolInfo {
  count: number;
  vsize: number;
  total_fee: number;
  fee_histogram: number[][];
}

export interface FeeEstimates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

export interface HashrateDifficulty {
  hashrate: number;
  difficulty: number;
  adjustmentProgress: number;
  timeToAdjustment: number;
}

export interface MiningPool {
  name: string;
  percentage: number;
  blocks: number;
  color: string;
}

export interface DashboardData {
  price: BitcoinPrice | null;
  latestBlock: Block | null;
  recentBlocks: Block[];
  mempool: MempoolInfo | null;
  fees: FeeEstimates | null;
  hashrateDifficulty: HashrateDifficulty | null;
  miningPools: MiningPool[];
}

export type UnitMode = 'btc' | 'sats';
