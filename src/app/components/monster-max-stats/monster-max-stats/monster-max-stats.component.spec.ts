import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterMaxStatsComponent } from './monster-max-stats.component';

describe('MonsterMaxStatsComponent', () => {
  let component: MonsterMaxStatsComponent;
  let fixture: ComponentFixture<MonsterMaxStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonsterMaxStatsComponent]
    });
    fixture = TestBed.createComponent(MonsterMaxStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
