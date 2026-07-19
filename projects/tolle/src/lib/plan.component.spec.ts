import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PlanComponent, PlanStepComponent, type PlanStepStatus } from './plan.component';

@Component({
  standalone: true,
  imports: [PlanComponent, PlanStepComponent],
  template: `
    <tolle-plan [title]="title" [collapsed]="collapsed" (collapsedChange)="lastCollapsed = $event">
      <tolle-plan-step label="Read the schema" [status]="firstStatus"></tolle-plan-step>
      <tolle-plan-step label="Write the migration" [status]="secondStatus" description="Adds two columns"></tolle-plan-step>
      <tolle-plan-step label="Run it" status="pending"></tolle-plan-step>
    </tolle-plan>
  `,
})
class PlanHostComponent {
  @Input() title = 'Plan';
  @Input() collapsed = false;
  @Input() firstStatus: PlanStepStatus = 'done';
  @Input() secondStatus: PlanStepStatus = 'active';
  lastCollapsed: boolean | null = null;
}

describe('PlanComponent', () => {
  let fixture: ComponentFixture<PlanHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PlanHostComponent] }).compileComponents();

    fixture = TestBed.createComponent(PlanHostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  const header = (): HTMLButtonElement => host.querySelector('tolle-plan button')!;
  const summary = (): string => header().querySelectorAll('span')[1].textContent!.trim();
  const stepsWrapper = (): HTMLElement => host.querySelector('tolle-plan > div > div')!;
  const steps = (): HTMLElement[] => Array.from(host.querySelectorAll('tolle-plan-step'));
  const badge = (index: number): HTMLElement =>
    steps()[index].querySelector('span:not(.tolle-plan-rail)')!;

  it('should create', () => {
    expect(fixture.debugElement.query(By.directive(PlanComponent))).toBeTruthy();
  });

  it('renders the title in the header', () => {
    expect(header().textContent).toContain('Plan');

    fixture.componentRef.setInput('title', 'Migration plan');
    fixture.detectChanges();
    expect(header().textContent).toContain('Migration plan');
  });

  it('numbers the steps in order', () => {
    const instances = fixture.debugElement
      .queryAll(By.directive(PlanStepComponent))
      .map((debugEl) => debugEl.componentInstance.index);

    expect(instances).toEqual([1, 2, 3]);
  });

  it('shows the number on unresolved steps only', () => {
    expect(badge(0).querySelector('i')!.className).toContain('ri-check-line');
    expect(badge(1).textContent!.trim()).toBe('2');
    expect(badge(2).textContent!.trim()).toBe('3');
  });

  it('summarises progress from the active step', () => {
    expect(summary()).toBe('Step 2 of 3');
  });

  it('falls back to the resolved count when no step is active', () => {
    fixture.componentRef.setInput('secondStatus', 'done');
    fixture.detectChanges();

    expect(summary()).toBe('Step 2 of 3');
  });

  it('applies the done badge classes and marks the label as complete', () => {
    expect(steps()[0].getAttribute('data-status')).toBe('done');
    expect(badge(0).className).toContain('text-success');
    expect(steps()[0].querySelector('p')!.className).toContain('text-foreground');
  });

  it('applies the active badge classes and bolds the label', () => {
    expect(badge(1).className).toContain('bg-primary');
    expect(steps()[1].querySelector('p')!.className).toContain('font-medium');
  });

  it('applies the pending badge classes', () => {
    expect(badge(2).className).toContain('border-border');
    expect(badge(2).className).toContain('text-muted-foreground');
  });

  it('applies the skipped treatment', () => {
    fixture.componentRef.setInput('firstStatus', 'skipped');
    fixture.detectChanges();

    expect(steps()[0].className).toContain('opacity-60');
    expect(badge(0).className).toContain('border-dashed');
    expect(badge(0).querySelector('i')!.className).toContain('ri-subtract-line');
    expect(steps()[0].querySelector('p')!.className).toContain('line-through');
  });

  it('renders a connector on every step', () => {
    expect(host.querySelectorAll('.tolle-plan-rail').length).toBe(3);
    // The final step hides its own connector via the last-child rule.
    expect(steps()[0].className).toContain('[&:last-child_.tolle-plan-rail]:hidden');
  });

  it('renders step descriptions when given', () => {
    expect(steps()[1].textContent).toContain('Adds two columns');
    expect(steps()[0].querySelectorAll('p').length).toBe(1);
  });

  it('shows the steps expanded by default', () => {
    expect(stepsWrapper().className).not.toContain('hidden');
    expect(header().getAttribute('aria-expanded')).toBe('true');
  });

  it('collapses to just the summary when the header is clicked', () => {
    header().click();
    fixture.detectChanges();

    expect(stepsWrapper().className).toContain('hidden');
    expect(header().getAttribute('aria-expanded')).toBe('false');
    expect(summary()).toBe('Step 2 of 3');
  });

  it('emits collapsedChange on toggle but not on init', () => {
    expect(fixture.componentInstance.lastCollapsed).toBeNull();

    header().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastCollapsed).toBeTrue();

    header().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastCollapsed).toBeFalse();
  });

  it('collapses from the collapsed input', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();

    expect(stepsWrapper().className).toContain('hidden');
  });
});

describe('PlanComponent without steps', () => {
  it('leaves the summary empty and disables the header when not collapsible', async () => {
    await TestBed.configureTestingModule({ imports: [PlanComponent] }).compileComponents();

    const fixture = TestBed.createComponent(PlanComponent);
    fixture.componentRef.setInput('collapsible', false);
    fixture.detectChanges();

    const header: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(fixture.componentInstance.summary).toBe('');
    expect(header.disabled).toBeTrue();
    expect(header.querySelector('i')).toBeNull();
  });
});
