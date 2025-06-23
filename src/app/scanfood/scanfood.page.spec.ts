import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanfoodPage } from './scanfood.page';

describe('ScanfoodPage', () => {
  let component: ScanfoodPage;
  let fixture: ComponentFixture<ScanfoodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanfoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
