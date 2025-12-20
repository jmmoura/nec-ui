import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagePersonsPage } from './manage-persons.page';

describe('ManagePersonsPage', () => {
  let component: ManagePersonsPage;
  let fixture: ComponentFixture<ManagePersonsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePersonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
