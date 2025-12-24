import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TollePaginationComponent } from './pagination.component';

describe('TollePaginationComponent', () => {
  let component: TollePaginationComponent;
  let fixture: ComponentFixture<TollePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TollePaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TollePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
