import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionModal } from './session-modal';

describe('SessionModal', () => {
  let component: SessionModal;
  let fixture: ComponentFixture<SessionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
