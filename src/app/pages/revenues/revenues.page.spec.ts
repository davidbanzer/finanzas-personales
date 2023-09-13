import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevenuesPage } from './revenues.page';

describe('RevenuesPage', () => {
  let component: RevenuesPage;
  let fixture: ComponentFixture<RevenuesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RevenuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
