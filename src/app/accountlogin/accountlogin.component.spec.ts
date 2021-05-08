import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountloginComponent } from './accountlogin.component';

describe('AccountloginComponent', () => {
  let component: AccountloginComponent;
  let fixture: ComponentFixture<AccountloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
