import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CryptoData {
  id: number;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
}

export interface Prediction {
  symbol: string;
  trend: 'up' | 'down';
  percentage: number;
}

export interface TradeSuggestion {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  reason: string;
}

export interface CryptoAlert {
  id?: number;
  symbol: string;
  threshold: number;
  type: 'above' | 'below';
  triggered: boolean;
  createdAt?: Date;
  triggeredAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private socket: Socket;
  private apiUrl = 'http://localhost:3000';
  private cryptosSubject = new BehaviorSubject<CryptoData[]>([]);
  public cryptos$ = this.cryptosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = io(this.apiUrl);
    this.setupSocketListeners();
    this.loadInitialData();
  }

  private setupSocketListeners() {
    this.socket.on('priceUpdates', (cryptos: CryptoData[]) => {
      this.cryptosSubject.next(cryptos);
    });
  }

  private loadInitialData() {
    this.http.get<CryptoData[]>(`${this.apiUrl}/crypto`).subscribe(
      cryptos => this.cryptosSubject.next(cryptos)
    );
  }

  getPriceHistory(symbol: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/crypto/${symbol}/history`);
  }

  createAlert(alert: CryptoAlert): Observable<CryptoAlert> {
    return this.http.post<CryptoAlert>(`${this.apiUrl}/alerts`, alert);
  }

  getAlerts(): Observable<CryptoAlert[]> {
    return this.http.get<CryptoAlert[]>(`${this.apiUrl}/alerts`);
  }

  deleteAlert(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/alerts/${id}`);
  }
} 