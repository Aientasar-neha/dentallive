import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddaccountbasicComponent } from './addaccountbasic.component';

describe('AddaccountbasicComponent', () => {
  let component: AddaccountbasicComponent;
  let fixture: ComponentFixture<AddaccountbasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddaccountbasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddaccountbasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
