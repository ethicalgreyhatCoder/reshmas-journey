import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnBengali } from './learn-bengali';

describe('LearnBengali', () => {
  let component: LearnBengali;
  let fixture: ComponentFixture<LearnBengali>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnBengali],
    }).compileComponents();

    fixture = TestBed.createComponent(LearnBengali);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
