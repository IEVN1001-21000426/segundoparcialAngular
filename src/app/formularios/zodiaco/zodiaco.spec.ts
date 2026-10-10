import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zodiaco } from './zodiaco';

describe('Zodiaco', () => {
  let component: Zodiaco;
  let fixture: ComponentFixture<Zodiaco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zodiaco],
    }).compileComponents();

    fixture = TestBed.createComponent(Zodiaco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
