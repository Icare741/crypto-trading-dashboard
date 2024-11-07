import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingDashboardComponent } from './trading-dashboard.component';

describe('TradingDashboardComponent', () => {
  let component: TradingDashboardComponent;
  let fixture: ComponentFixture<TradingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
