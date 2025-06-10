import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerritoryDetailsPage } from './territory-details.page';

describe('TerritoryDetailsPage', () => {
  let component: TerritoryDetailsPage;
  let fixture: ComponentFixture<TerritoryDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
