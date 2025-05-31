# Bitcoin Dashboard - Frontend

A comprehensive Bitcoin dashboard that provides real-time network insights, mining pool analytics, and market data through a modern, responsive React interface.

## Features

- **Real-time Bitcoin Price** - Current USD price with 24h change
- **Network Statistics** - Latest block height, difficulty, hashrate
- **Mempool Analytics** - Transaction count, fees, and size
- **Mining Pool Distribution** - Visual representation of pool dominance
- **Recent Blocks** - Latest 6 blocks with details
- **Unit Toggle** - Switch between BTC/USD and sats pricing
- **Auto-refresh** - Real-time data updates
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful UI components
- **TanStack Query** - Data fetching and caching
- **Recharts** - Data visualization
- **Wouter** - Lightweight routing

## Data Sources

- **CoinGecko API** - Bitcoin price data
- **Blockstream API** - Block and transaction data
- **Mempool.space API** - Mempool and fee estimates
- **Mining pool detection** - From coinbase transaction data

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Deployment

This is a static frontend application that can be deployed to:
- **Vercel** - Recommended for React apps
- **Netlify** - Great for static sites
- **GitHub Pages** - Free hosting option
- Any static hosting provider

## API Rate Limits

The dashboard uses public APIs with rate limits:
- CoinGecko: 50 calls/minute (demo tier)
- Blockstream: No official limit
- Mempool.space: 10 requests/second

## License

MIT License - see LICENSE file for details