import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalLiveMailMainComponent } from './dental-live-mail-main.component';

describe('DentalLiveMailMainComponent', () => {
  let component: DentalLiveMailMainComponent;
  let fixture: ComponentFixture<DentalLiveMailMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DentalLiveMailMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalLiveMailMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
