import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRouteComponent } from './message-route.component';

describe('MessageRouteComponent', () => {
  let component: MessageRouteComponent;
  let fixture: ComponentFixture<MessageRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
