import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'trading-dashboard',
    pathMatch: 'full'
  },
  {
    path: 'trading-dashboard',
    loadComponent: () => import('../core/components/trading-dashboard/trading-dashboard.component')
      .then(m => m.TradingDashboardComponent)
  }
];