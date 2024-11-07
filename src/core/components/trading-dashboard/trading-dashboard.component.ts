import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartDataset } from 'chart.js/auto';
import { CryptoService, CryptoData, Prediction, TradeSuggestion, CryptoAlert } from '../../services/crypto.service';
import { Subscription } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AlertFormComponent } from '../alert-form/alert-form.component';

@Component({
  selector: 'app-trading-dashboard',
  standalone: true,
  imports: [CommonModule, AlertFormComponent],
  providers: [CryptoService],
  templateUrl: './trading-dashboard.component.html',
  styleUrl: './trading-dashboard.component.css'
})
export class TradingDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  cryptos: CryptoData[] = [];
  selectedCryptos: string[] = ['BTC', 'ETH'];
  chart: Chart | null = null;
  private cryptoSubscription?: Subscription;
  predictions: Prediction[] = [];
  tradeSuggestions: TradeSuggestion[] = [];
  private priceHistory: Map<string, { price: number; timestamp: Date }[]> = new Map();
  private readonly MAX_DATA_POINTS = 20; // Nombre maximum de points sur le graphique
  activeAlerts: CryptoAlert[] = [];

  constructor(private cryptoService: CryptoService) {}

  ngOnInit() {
    this.cryptoSubscription = this.cryptoService.cryptos$.subscribe(
      cryptos => {
        this.cryptos = cryptos;
        this.updatePredictions(cryptos);
        this.updatePriceHistory(cryptos);
        if (this.chart) {
          this.updateChart();
        }
      }
    );
  }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.cryptoSubscription) {
      this.cryptoSubscription.unsubscribe();
    }
  }

  createChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => `$${value}`
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        animation: {
          duration: 0 // Désactiver les animations pour une meilleure performance
        }
      }
    };

    this.chart = new Chart(ctx, config);
    this.updateChart();
  }

  async updateChart() {
    if (!this.chart) return;

    // Obtenir les labels (timestamps) du premier crypto sélectionné
    const firstHistory = this.priceHistory.get(this.selectedCryptos[0]) || [];
    this.chart.data.labels = firstHistory.map(h => 
      h.timestamp.toLocaleTimeString()
    );

    // Mettre à jour les datasets
    this.chart.data.datasets = this.selectedCryptos.map(symbol => {
      const history = this.priceHistory.get(symbol) || [];
      const existingDataset = this.chart?.data.datasets?.find(ds => ds.label === symbol);
      
      return {
        type: 'line' as const,
        label: symbol,
        data: history.map(h => h.price),
        borderColor: existingDataset?.borderColor || this.getRandomColor(),
        fill: false,
        tension: 0.4
      } as ChartDataset<'line', number[]>;
    });

    this.chart.update('none');
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

  private updatePredictions(cryptos: CryptoData[]) {
    // Prédictions inchangées
    this.predictions = cryptos.map(crypto => ({
      symbol: crypto.symbol,
      trend: crypto.change > 0 ? 'up' : 'down',
      percentage: Math.abs(crypto.change)
    }));

    // Suggestions de trade avec le bon typage
    this.tradeSuggestions = cryptos
      .map(crypto => ({
        symbol: crypto.symbol,
        action: crypto.change > 2 
          ? 'sell' as const 
          : crypto.change < -2 
          ? 'buy' as const 
          : 'hold' as const,
        reason: crypto.change > 2 
          ? 'Suracheté' 
          : crypto.change < -2 
          ? 'Survendu' 
          : 'Stable'
      }))
      .filter(suggestion => suggestion.action !== 'hold');
  }

  private updatePriceHistory(cryptos: CryptoData[]) {
    const currentTime = new Date();
    
    cryptos.forEach(crypto => {
      if (!this.priceHistory.has(crypto.symbol)) {
        this.priceHistory.set(crypto.symbol, []);
      }

      const history = this.priceHistory.get(crypto.symbol)!;
      history.push({
        price: crypto.price,
        timestamp: currentTime
      });

      // Garder seulement les MAX_DATA_POINTS derniers points
      if (history.length > this.MAX_DATA_POINTS) {
        history.shift();
      }
    });
  }

  loadAlerts() {
    this.cryptoService.getAlerts().subscribe(alerts => {
      this.activeAlerts = alerts;
    });
  }
}
