import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesTopBarComponent } from './messages-top-bar.component';

describe('MessagesTopBarComponent', () => {
  let component: MessagesTopBarComponent;
  let fixture: ComponentFixture<MessagesTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesTopBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
