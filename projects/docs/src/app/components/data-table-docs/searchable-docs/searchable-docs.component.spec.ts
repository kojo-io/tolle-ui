import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableDocsComponent } from './searchable-docs.component';

describe('SearchableDocsComponent', () => {
  let component: SearchableDocsComponent;
  let fixture: ComponentFixture<SearchableDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchableDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchableDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
