import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface CryptoData {
  symbol: string;
  name: string;
  logo: string;
  price: string;
  change: number;
  volume: string;
  marketCap: string;
}

interface Alert {
  id: number;
  type: string;
  message: string;
}

interface Prediction {
  symbol: string;
  trend: 'up' | 'down';
  percentage: number;
}

interface TradeSuggestion {
  symbol: string;
  action: 'buy' | 'sell';
}

@Component({
  selector: 'app-trading-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './trading-dashboard.component.html',
  styleUrl: './trading-dashboard.component.css'
})
export class TradingDashboardComponent implements OnInit{
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  cryptos: CryptoData[] = [
    { symbol: 'BTC', name: 'Bitcoin', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', price: '51,234.78', change: 2.5, volume: '32.5B', marketCap: '978.2B' },
    { symbol: 'ETH', name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', price: '3,456.12', change: -0.8, volume: '18.7B', marketCap: '412.3B' },
    { symbol: 'BNB', name: 'Binance Coin', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', price: '412.56', change: 1.2, volume: '2.1B', marketCap: '68.5B' },
    { symbol: 'ADA', name: 'Cardano', logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png', price: '1.23', change: 3.7, volume: '1.8B', marketCap: '39.2B' },
    { symbol: 'SOL', name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png', price: '98.76', change: -2.1, volume: '1.5B', marketCap: '32.7B' },
  ];

  alerts: Alert[] = [
    { id: 1, type: 'warning', message: 'BTC a dépassé le seuil de 50,000$' },
    { id: 2, type: 'info', message: 'Nouveau protocole DeFi lancé sur Ethereum' },
  ];

  predictions: Prediction[] = [
    { symbol: 'BTC', trend: 'up', percentage: 3.7 },
    { symbol: 'ETH', trend: 'down', percentage: 1.5 },
    { symbol: 'ADA', trend: 'up', percentage: 4.2 },
  ];

  tradeSuggestions: TradeSuggestion[] = [
    { symbol: 'DOT', action: 'buy' },
    { symbol: 'XRP', action: 'sell' },
    { symbol: 'SOL', action: 'buy' },
  ];

  selectedCryptos: string[] = ['BTC', 'ETH'];
  chart: Chart | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h'],
        datasets: this.selectedCryptos.map(symbol => ({
          label: symbol,
          data: Array.from({length: 8}, () => Math.random() * 100),
          borderColor: this.getRandomColor(),
          fill: false
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Comparaison des prix des crypto-monnaies'
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets = this.selectedCryptos.map(symbol => ({
        label: symbol,
        data: Array.from({length: 8}, () => Math.random() * 100),
        borderColor: this.getRandomColor(),
        fill: false
      }));
      this.chart.update();
    }
  }

  toggleCrypto(symbol: string) {
    const index = this.selectedCryptos.indexOf(symbol);
    if (index > -1) {
      this.selectedCryptos.splice(index, 1);
    } else {
      this.selectedCryptos.push(symbol);
    }
    this.updateChart();
  }

  getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  }
}
