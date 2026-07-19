import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointComponent } from './checkpoint.component';

describe('CheckpointComponent', () => {
  let component: CheckpointComponent;
  let fixture: ComponentFixture<CheckpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CheckpointComponent] }).compileComponents();

    fixture = TestBed.createComponent(CheckpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const row = (): HTMLElement => fixture.nativeElement.querySelector('div');
  const pill = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');
  const rules = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('span.h-px'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a rule on each side of the pill', () => {
    expect(rules().length).toBe(2);
    expect(rules()[0].className).toContain('flex-1');
    expect(row().className).toContain('items-center');
  });

  it('shows the default label', () => {
    expect(pill().textContent).toContain('Checkpoint');
  });

  it('shows a custom label', () => {
    fixture.componentRef.setInput('label', 'Before refactor');
    fixture.detectChanges();

    expect(pill().textContent).toContain('Before refactor');
  });

  it('hides the timestamp until one is supplied', () => {
    expect(pill().textContent).not.toContain('14:02');

    fixture.componentRef.setInput('timestamp', '14:02');
    fixture.detectChanges();

    expect(pill().textContent).toContain('14:02');
  });

  it('uses the inactive pill classes by default', () => {
    expect(pill().className).toContain('text-muted-foreground');
    expect(pill().className).toContain('border-border');
    expect(row().getAttribute('data-active')).toBeNull();
    expect(pill().getAttribute('aria-current')).toBeNull();
  });

  it('highlights the pill when active', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(pill().className).toContain('text-primary');
    expect(pill().className).toContain('bg-primary/10');
    expect(row().getAttribute('data-active')).toBe('');
    expect(pill().getAttribute('aria-current')).toBe('step');
  });

  it('supports the small size variant', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(pill().className).toContain('text-[11px]');
    expect(pill().className).not.toContain('text-xs');
  });

  it('emits restore when the pill is clicked', () => {
    const restore = jasmine.createSpy('restore');
    component.restore.subscribe(restore);

    pill().click();

    expect(restore).toHaveBeenCalledTimes(1);
  });

  it('does not emit restore while disabled', () => {
    const restore = jasmine.createSpy('restore');
    component.restore.subscribe(restore);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    pill().click();

    expect(pill().disabled).toBeTrue();
    expect(restore).not.toHaveBeenCalled();
  });

  it('builds an accessible name from the restore label and the checkpoint label', () => {
    fixture.componentRef.setInput('label', 'Before refactor');
    fixture.detectChanges();

    expect(pill().getAttribute('aria-label')).toBe('Restore checkpoint: Before refactor');
  });

  it('lets the accessible name be overridden', () => {
    fixture.componentRef.setInput('ariaLabel', 'Rewind here');
    fixture.detectChanges();

    expect(pill().getAttribute('aria-label')).toBe('Rewind here');
  });

  it('accepts a custom leading icon', () => {
    fixture.componentRef.setInput('icon', 'ri-bookmark-line');
    fixture.detectChanges();

    expect(pill().querySelector('i')!.className).toContain('ri-bookmark-line');
  });

  it('merges extra classes onto the row', () => {
    fixture.componentRef.setInput('class', 'my-checkpoint');
    fixture.detectChanges();

    expect(row().className).toContain('my-checkpoint');
  });
});
