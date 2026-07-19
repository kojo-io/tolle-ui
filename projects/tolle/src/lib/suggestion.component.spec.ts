import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestionComponent, SuggestionsComponent } from './suggestion.component';

@Component({
  standalone: true,
  imports: [CommonModule, SuggestionsComponent, SuggestionComponent],
  template: `
    <tolle-suggestions (selected)="fromRow.push($event)">
      <tolle-suggestion
        *ngFor="let prompt of prompts"
        [value]="prompt"
        [size]="size"
        [disabled]="disabled"
        (selected)="fromPill.push($event)"
        >{{ prompt }}</tolle-suggestion
      >
    </tolle-suggestions>
  `,
})
class HostComponent {
  prompts = ['Summarise this', 'Explain like I am five', 'Show me the code'];
  size: 'sm' | 'default' | 'lg' = 'default';
  disabled = false;
  fromPill: string[] = [];
  fromRow: string[] = [];
}

describe('SuggestionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const pills = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[data-suggestion]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders one pill per suggestion, labelled with its projected text', () => {
    expect(pills().length).toBe(3);
    expect(pills().map((pill) => pill.textContent!.trim())).toEqual([
      'Summarise this',
      'Explain like I am five',
      'Show me the code',
    ]);
  });

  it('emits selected with the pressed pill value', () => {
    pills()[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.fromPill).toEqual(['Explain like I am five']);
  });

  it('relays the choice to the containing row', () => {
    pills()[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.fromRow).toEqual(['Show me the code']);
  });

  it('stays silent while disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(pills()[0].disabled).toBe(true);

    pills()[0].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.fromPill).toEqual([]);
    expect(fixture.componentInstance.fromRow).toEqual([]);
  });

  it('applies the size variant classes', () => {
    expect(pills()[0].className).toContain('h-8');

    fixture.componentInstance.size = 'sm';
    fixture.detectChanges();
    expect(pills()[0].className).toContain('h-7');

    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();
    expect(pills()[0].className).toContain('h-10');
  });

  it('lays the row out as a horizontally scrollable, faded strip', () => {
    const row: HTMLElement = fixture.nativeElement.querySelector('[role="group"]');

    expect(row.className).toContain('overflow-x-auto');
    expect(row.className).toContain('scroll-fade-x');
  });
});
