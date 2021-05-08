import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsignupComponent } from './accountsignup.component';

describe('AccountsignupComponent', () => {
  let component: AccountsignupComponent;
  let fixture: ComponentFixture<AccountsignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
