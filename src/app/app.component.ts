import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingDashboardComponent } from '../core/components/trading-dashboard/trading-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TradingDashboardComponent],
  template: '<app-trading-dashboard></app-trading-dashboard>'
})
export class AppComponent {
  title = 'crypto-dashboard';
}