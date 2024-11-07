import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService, CryptoAlert, CryptoData } from '../../services/crypto.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alert-form.component.html',
  styleUrl: './alert-form.component.css'
})
export class AlertFormComponent implements OnInit, OnDestroy {
  @Input() cryptos: CryptoData[] = [];
  @Output() alertCreated = new EventEmitter<void>();
  
  activeAlerts: CryptoAlert[] = [];
  private alertCheckSubscription?: Subscription;

  newAlert: CryptoAlert = {
    symbol: '',
    threshold: 0,
    type: 'above',
    triggered: false
  };

  constructor(private cryptoService: CryptoService) {}

  ngOnInit() {
    this.loadAlerts();
    this.startAlertChecking();
  }

  ngOnDestroy() {
    if (this.alertCheckSubscription) {
      this.alertCheckSubscription.unsubscribe();
    }
  }

  private startAlertChecking() {
    this.alertCheckSubscription = this.cryptoService.cryptos$.subscribe(cryptos => {
      this.checkAlerts(cryptos);
    });
  }

  private checkAlerts(cryptos: CryptoData[]) {
    this.activeAlerts.forEach(alert => {
      const crypto = cryptos.find(c => c.symbol === alert.symbol);
      if (crypto) {
        const isTriggered = alert.type === 'above' 
          ? crypto.price > alert.threshold
          : crypto.price < alert.threshold;

        if (isTriggered && !alert.triggered) {
          alert.triggered = true;
          this.showNotification(alert, crypto.price);
        }
      }
    });
  }

  isAlertTriggered(alert: CryptoAlert): boolean {
    const crypto = this.cryptos.find(c => c.symbol === alert.symbol);
    if (!crypto) return false;

    return alert.type === 'above' 
      ? crypto.price > alert.threshold
      : crypto.price < alert.threshold;
  }

  private showNotification(alert: CryptoAlert, currentPrice: number) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Alerte ${alert.symbol}`, {
        body: `Le prix (${currentPrice}$) est ${alert.type === 'above' ? 'au-dessus' : 'en-dessous'} du seuil de ${alert.threshold}$`,
        icon: '/assets/notification-icon.png'
      });
    }
  }

  onSubmit() {
    this.cryptoService.createAlert(this.newAlert).subscribe({
      next: (alert) => {
        console.log('Alerte créée:', alert);
        this.alertCreated.emit();
        this.loadAlerts();
        this.newAlert = {
          symbol: '',
          threshold: 0,
          type: 'above',
          triggered: false
        };
      },
      error: (error) => console.error('Erreur lors de la création de l\'alerte:', error)
    });
  }

  deleteAlert(id: number) {
    this.cryptoService.deleteAlert(id).subscribe({
      next: () => {
        this.loadAlerts();
        this.alertCreated.emit();
      },
      error: (error) => console.error('Erreur lors de la suppression de l\'alerte:', error)
    });
  }

  private loadAlerts() {
    this.cryptoService.getAlerts().subscribe({
      next: (alerts) => {
        this.activeAlerts = alerts || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des alertes:', error);
        this.activeAlerts = [];
      }
    });
  }
}
