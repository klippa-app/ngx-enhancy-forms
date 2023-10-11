import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnSubmitErrorsComponent } from './on-submit-errors.component';

describe('OnSubmitErrorsComponent', () => {
  let component: OnSubmitErrorsComponent;
  let fixture: ComponentFixture<OnSubmitErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnSubmitErrorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnSubmitErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
