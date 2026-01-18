import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearPickDocComponent } from './year-pick-doc.component';

describe('YearPickDocComponent', () => {
  let component: YearPickDocComponent;
  let fixture: ComponentFixture<YearPickDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearPickDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearPickDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
