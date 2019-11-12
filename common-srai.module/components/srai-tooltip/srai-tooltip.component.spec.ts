import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SraiTooltipComponent } from './srai-tooltip.component';

describe('SraiTooltipComponent', () => {
  let component: SraiTooltipComponent;
  let fixture: ComponentFixture<SraiTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SraiTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SraiTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
