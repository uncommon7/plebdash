import { BitcoinPrice, Block, MempoolInfo, FeeEstimates, HashrateDifficulty, MiningPool } from './types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BLOCKSTREAM_API = 'https://blockstream.info/api';
const MEMPOOL_API = 'https://mempool.space/api/v1';

export async function fetchBitcoinPrice(): Promise<BitcoinPrice> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      usd: data.bitcoin.usd,
      usd_24h_change: data.bitcoin.usd_24h_change || 0,
      usd_24h_vol: data.bitcoin.usd_24h_vol || 0,
      last_updated_at: data.bitcoin.last_updated_at || Date.now() / 1000,
    };
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw error;
  }
}

export async function fetchLatestBlock(): Promise<Block> {
  try {
    // Try mempool.space first as it's more reliable
    const mempoolResponse = await fetch('https://mempool.space/api/blocks/tip/height');
    if (mempoolResponse.ok) {
      const height = await mempoolResponse.json();
      const blockResponse = await fetch(`https://mempool.space/api/block-height/${height}`);
      if (blockResponse.ok) {
        const blockHash = await blockResponse.text();
        const blockDetailResponse = await fetch(`https://mempool.space/api/block/${blockHash}`);
        if (blockDetailResponse.ok) {
          return await blockDetailResponse.json();
        }
      }
    }
    
    // Fallback to blockstream
    const response = await fetch(`${BLOCKSTREAM_API}/blocks/tip/height`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const height = await response.json();
    
    const blockResponse = await fetch(`${BLOCKSTREAM_API}/block-height/${height}`);
    if (!blockResponse.ok) {
      throw new Error(`HTTP error! status: ${blockResponse.status}`);
    }
    const blockHash = await blockResponse.text();
    
    const blockDetailResponse = await fetch(`${BLOCKSTREAM_API}/block/${blockHash}`);
    if (!blockDetailResponse.ok) {
      throw new Error(`HTTP error! status: ${blockDetailResponse.status}`);
    }
    const blockData = await blockDetailResponse.json();
    
    return blockData;
  } catch (error) {
    console.error('Error fetching latest block:', error);
    throw error;
  }
}

export async function fetchRecentBlocks(count: number = 6): Promise<Block[]> {
  try {
    // Try mempool.space first
    const mempoolResponse = await fetch('https://mempool.space/api/v1/blocks');
    if (mempoolResponse.ok) {
      const blocks = await mempoolResponse.json();
      return blocks.slice(0, count);
    }
    
    // Fallback to blockstream
    const response = await fetch(`${BLOCKSTREAM_API}/blocks`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blocks = await response.json();
    return blocks.slice(0, count);
  } catch (error) {
    console.error('Error fetching recent blocks:', error);
    throw error;
  }
}

export async function fetchMempoolInfo(): Promise<MempoolInfo> {
  try {
    const response = await fetch(`https://mempool.space/api/mempool`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mempool info:', error);
    throw error;
  }
}

export async function fetchFeeEstimates(): Promise<FeeEstimates> {
  try {
    const response = await fetch(`https://mempool.space/api/v1/fees/recommended`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching fee estimates:', error);
    throw error;
  }
}

export async function fetchHashrateAndDifficulty(): Promise<HashrateDifficulty> {
  try {
    const latestBlock = await fetchLatestBlock();
    const difficulty = latestBlock.difficulty;
    
    // Calculate hashrate (approximate)
    const hashrate = difficulty * Math.pow(2, 32) / 600; // 600 seconds average block time
    
    // Calculate difficulty adjustment progress
    const blocksInPeriod = 2016;
    const currentPeriodBlock = latestBlock.height % blocksInPeriod;
    const adjustmentProgress = (currentPeriodBlock / blocksInPeriod) * 100;
    
    // Estimate time to next adjustment (rough calculation)
    const blocksRemaining = blocksInPeriod - currentPeriodBlock;
    const timeToAdjustment = blocksRemaining * 10 * 60 * 1000; // 10 minutes per block in milliseconds
    
    return {
      hashrate,
      difficulty,
      adjustmentProgress,
      timeToAdjustment,
    };
  } catch (error) {
    console.error('Error fetching hashrate and difficulty:', error);
    throw error;
  }
}

export async function fetchMiningPoolDistribution(): Promise<MiningPool[]> {
  try {
    // Try to get mining pool stats directly from mempool.space
    try {
      const poolResponse = await fetch('https://mempool.space/api/v1/mining/pools/1w');
      if (poolResponse.ok) {
        const poolData = await poolResponse.json();
        const colors = ['#F7931A', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#6B7280', '#F59E0B', '#8B7355'];
        
        const pools = poolData.pools.map((pool: any, index: number) => ({
          name: pool.name || 'Unknown Pool',
          blocks: pool.blockCount,
          percentage: ((pool.blockCount / poolData.blockCount) * 100),
          color: colors[index % colors.length],
        })).sort((a: any, b: any) => b.percentage - a.percentage);
        
        return pools;
      }
    } catch (poolError) {
      console.log('Mining pool API not available, falling back to block analysis');
    }

    // Fallback: Fetch recent blocks and analyze coinbase data
    const response = await fetch('https://mempool.space/api/v1/blocks');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blocks = await response.json();
    
    const poolCounts: { [key: string]: number } = {};
    const recentBlocks = blocks.slice(0, 100); // Use fewer blocks to avoid rate limiting
    
    for (const block of recentBlocks) {
      let poolName = 'Unknown Pool';
      
      // Check if pool is already identified in block extras
      if (block.extras && block.extras.pool && block.extras.pool.name) {
        poolName = block.extras.pool.name;
      } else if (block.extras && block.extras.coinbaseRaw) {
        // Use the coinbase hex to identify the pool
        poolName = getPoolName(block.extras.coinbaseRaw);
      }
      
      poolCounts[poolName] = (poolCounts[poolName] || 0) + 1;
    }
    
    const totalBlocks = recentBlocks.length;
    const colors = ['#F7931A', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#6B7280', '#F59E0B', '#8B7355'];
    
    const pools = Object.entries(poolCounts)
      .map(([name, count], index) => ({
        name,
        blocks: count,
        percentage: (count / totalBlocks) * 100,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.percentage - a.percentage);
    
    return pools;
  } catch (error) {
    console.error('Error fetching mining pool distribution:', error);
    throw error;
  }
}

export function formatHashrate(hashrate: number): string {
  if (hashrate >= 1e18) {
    return `${(hashrate / 1e18).toFixed(0)} EH/s`;
  } else if (hashrate >= 1e15) {
    return `${(hashrate / 1e15).toFixed(0)} PH/s`;
  } else if (hashrate >= 1e12) {
    return `${(hashrate / 1e12).toFixed(0)} TH/s`;
  }
  return `${hashrate.toFixed(0)} H/s`;
}

export function formatDifficulty(difficulty: number): string {
  if (difficulty >= 1e12) {
    return `${(difficulty / 1e12).toFixed(2)}T`;
  } else if (difficulty >= 1e9) {
    return `${(difficulty / 1e9).toFixed(2)}B`;
  } else if (difficulty >= 1e6) {
    return `${(difficulty / 1e6).toFixed(2)}M`;
  }
  return difficulty.toString();
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) {
    return `${Math.floor(diff)}s ago`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m ago`;
  } else {
    const days = Math.floor(diff / 86400);
    return `${days}d ago`;
  }
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    return `${days}d ${remainingHours}h ${remainingMinutes}m`;
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1e6) {
    return `${(bytes / 1e6).toFixed(1)} MB`;
  } else if (bytes >= 1e3) {
    return `${(bytes / 1e3).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

export function formatSatsNumber(sats: number): string {
  if (sats >= 1e12) {
    return `${(sats / 1e12).toFixed(1)}T`;
  } else if (sats >= 1e9) {
    return `${(sats / 1e9).toFixed(1)}B`;
  } else if (sats >= 1e6) {
    return `${(sats / 1e6).toFixed(1)}M`;
  } else if (sats >= 1e3) {
    return `${(sats / 1e3).toFixed(1)}K`;
  }
  return sats.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function hexToAscii(hex: string): string {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    if (code >= 32 && code <= 126) {
      str += String.fromCharCode(code);
    }
  }
  return str;
}

const POOL_TAGS = {
  'Foundry USA': ['foundry usa', 'foundry', 'foundryusa'],
  'AntPool': ['antpool', 'ant pool', 'bitmain'],
  'F2Pool': ['f2pool', 'f2pool.com', 'discus fish'],
  'ViaBTC': ['viabtc', 'via btc'],
  'Binance Pool': ['binance', 'bnb pool'],
  'Braiins Pool': ['braiins', 'slush', 'slushpool'],
  'Luxor': ['luxor', 'luxor mining'],
  'Poolin': ['poolin', 'poolin.com'],
  'MARA Pool': ['mara', 'marathon'],
  'Ocean': ['ocean', 'ocean mining'],
  'Accelerate Mining': ['accelerate'],
  'SBI Crypto': ['sbi crypto'],
  'Riot': ['riot blockchain'],
};

function getPoolName(coinbaseHex: string): string {
  if (!coinbaseHex) return 'Unknown Pool';
  
  try {
    const ascii = hexToAscii(coinbaseHex).toLowerCase();
    
    for (const [poolName, tags] of Object.entries(POOL_TAGS)) {
      if (tags.some(tag => ascii.includes(tag.toLowerCase()))) {
        return poolName;
      }
    }
    
    return 'Unknown Pool';
  } catch (error) {
    return 'Unknown Pool';
  }
}
