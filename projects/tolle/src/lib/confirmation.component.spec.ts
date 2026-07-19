import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConfirmationComponent] }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Delete 12 rows?');
    fixture.componentRef.setInput('description', 'This cannot be undone.');
    fixture.detectChanges();
  });

  const root = (): HTMLElement => fixture.nativeElement.querySelector('[role="group"]');
  const buttons = (): HTMLButtonElement[] => Array.from(fixture.nativeElement.querySelectorAll('button'));
  const resolvedPill = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('span.inline-flex');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the title and description', () => {
    expect(root().textContent).toContain('Delete 12 rows?');
    expect(root().textContent).toContain('This cannot be undone.');
  });

  it('omits the description paragraph when none is given', () => {
    fixture.componentRef.setInput('description', '');
    fixture.detectChanges();

    expect(root().querySelectorAll('p').length).toBe(1);
  });

  it('shows both buttons with their default labels while pending', () => {
    expect(buttons().length).toBe(2);
    expect(buttons()[0].textContent).toContain('Approve');
    expect(buttons()[1].textContent).toContain('Deny');
    expect(root().getAttribute('data-state')).toBe('pending');
    expect(resolvedPill()).toBeNull();
  });

  it('accepts custom button labels', () => {
    fixture.componentRef.setInput('confirmLabel', 'Run it');
    fixture.componentRef.setInput('cancelLabel', 'Skip');
    fixture.detectChanges();

    expect(buttons()[0].textContent).toContain('Run it');
    expect(buttons()[1].textContent).toContain('Skip');
  });

  it('applies the pending container and icon classes', () => {
    expect(root().className).toContain('border-border');
    expect(fixture.nativeElement.querySelector('i').className).toContain('text-warning');
  });

  it('emits confirmed and swaps to the resolved row when approved', () => {
    const confirmed = jasmine.createSpy('confirmed');
    component.confirmed.subscribe(confirmed);

    buttons()[0].click();
    fixture.detectChanges();

    expect(confirmed).toHaveBeenCalledTimes(1);
    expect(component.currentState).toBe('confirmed');
    expect(root().getAttribute('data-state')).toBe('confirmed');
    expect(buttons().length).toBe(0);
    expect(resolvedPill()!.textContent).toContain('Approved');
    expect(resolvedPill()!.className).toContain('text-success');
    expect(root().className).toContain('border-success/40');
  });

  it('emits cancelled and swaps to the resolved row when denied', () => {
    const cancelled = jasmine.createSpy('cancelled');
    component.cancelled.subscribe(cancelled);

    buttons()[1].click();
    fixture.detectChanges();

    expect(cancelled).toHaveBeenCalledTimes(1);
    expect(component.currentState).toBe('cancelled');
    expect(resolvedPill()!.textContent).toContain('Denied');
    expect(resolvedPill()!.className).toContain('text-destructive');
    expect(root().className).toContain('border-destructive/40');
  });

  it('accepts custom resolved labels', () => {
    fixture.componentRef.setInput('confirmedLabel', 'Ran');
    fixture.detectChanges();

    buttons()[0].click();
    fixture.detectChanges();

    expect(resolvedPill()!.textContent).toContain('Ran');
  });

  it('renders the resolved row straight away when state is set by the host', () => {
    fixture.componentRef.setInput('state', 'cancelled');
    fixture.detectChanges();

    expect(buttons().length).toBe(0);
    expect(resolvedPill()!.textContent).toContain('Denied');
  });

  it('lets the host take the prompt back to pending', () => {
    buttons()[0].click();
    fixture.detectChanges();
    expect(buttons().length).toBe(0);

    fixture.componentRef.setInput('state', 'pending');
    fixture.detectChanges();

    expect(component.currentState).toBe('pending');
    expect(buttons().length).toBe(2);
  });

  it('does not emit twice once resolved', () => {
    const confirmed = jasmine.createSpy('confirmed');
    component.confirmed.subscribe(confirmed);

    component.confirm();
    component.confirm();

    expect(confirmed).toHaveBeenCalledTimes(1);
  });

  it('ignores clicks while disabled', () => {
    const confirmed = jasmine.createSpy('confirmed');
    component.confirmed.subscribe(confirmed);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    component.confirm();
    fixture.detectChanges();

    expect(confirmed).not.toHaveBeenCalled();
    expect(component.currentState).toBe('pending');
    expect(buttons()[0].disabled).toBeTrue();
  });

  it('merges extra classes onto the prompt', () => {
    fixture.componentRef.setInput('class', 'my-confirmation');
    fixture.detectChanges();

    expect(root().className).toContain('my-confirmation');
  });
});
