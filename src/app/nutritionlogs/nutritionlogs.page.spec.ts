import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NutritionlogsPage } from './nutritionlogs.page';

describe('NutritionlogsPage', () => {
  let component: NutritionlogsPage;
  let fixture: ComponentFixture<NutritionlogsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionlogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
