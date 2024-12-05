import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsViewHomeComponent } from './ads-view-home.component';

describe('AdsViewHomeComponent', () => {
  let component: AdsViewHomeComponent;
  let fixture: ComponentFixture<AdsViewHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsViewHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsViewHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
