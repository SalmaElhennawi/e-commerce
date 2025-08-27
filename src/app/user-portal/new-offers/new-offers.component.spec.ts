import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOffersComponent } from './new-offers.component';

describe('NewOffersComponent', () => {
  let component: NewOffersComponent;
  let fixture: ComponentFixture<NewOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
