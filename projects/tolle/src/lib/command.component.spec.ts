import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
} from './command.component';

@Component({
  standalone: true,
  imports: [
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandItemComponent,
  ],
  template: `
    <tolle-command (selected)="chosen = $event">
      <tolle-command-input placeholder="Search"></tolle-command-input>
      <tolle-command-list>
        <tolle-command-empty>No results found.</tolle-command-empty>
        <tolle-command-group heading="Suggestions">
          <tolle-command-item value="profile" label="Profile">Profile</tolle-command-item>
          <tolle-command-item value="billing" label="Billing" [keywords]="['invoice']">Billing</tolle-command-item>
        </tolle-command-group>
        <tolle-command-group heading="Settings">
          <tolle-command-item value="theme" label="Theme">Theme</tolle-command-item>
        </tolle-command-group>
      </tolle-command-list>
    </tolle-command>
  `,
})
class HostComponent {
  chosen: any = null;
}

describe('CommandComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  /** Types into the projected search box and settles change detection. */
  const search = (query: string) => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = query;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  const visibleLabels = (): string[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="option"]')).map((el) =>
      (el as HTMLElement).textContent!.trim()
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders every item before any query is typed', () => {
    expect(visibleLabels()).toEqual(['Profile', 'Billing', 'Theme']);
  });

  it('filters items as the user types', () => {
    search('the');

    expect(visibleLabels()).toEqual(['Theme']);
  });

  it('matches on keywords that are not shown in the label', () => {
    search('invoice');

    expect(visibleLabels()).toEqual(['Billing']);
  });

  it('shows the empty state only when nothing matches', () => {
    const empty = () => fixture.nativeElement.querySelector('[role="status"]');
    expect(empty()).toBeNull();

    search('zzzzz');

    expect(empty()).toBeTruthy();
    expect(empty().textContent).toContain('No results found.');
  });

  it('hides a group heading once all of its items are filtered out', () => {
    const settingsHeading = () =>
      Array.from(fixture.nativeElement.querySelectorAll('div')).find(
        (el) => (el as HTMLElement).textContent?.trim() === 'Settings'
      ) as HTMLElement | undefined;

    expect(settingsHeading()?.className).not.toContain('hidden');

    search('profile');

    expect(settingsHeading()?.className).toContain('hidden');
  });

  it('highlights the first item and tracks it on aria-activedescendant', () => {
    const active = fixture.nativeElement.querySelector('[data-active]');
    expect(active.textContent.trim()).toBe('Profile');

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-activedescendant')).toBe(active.getAttribute('id'));
  });

  it('moves the highlight with ArrowDown across group boundaries', () => {
    const command = fixture.nativeElement.querySelector('[role="combobox"]');

    command.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-active]').textContent.trim()).toBe('Billing');

    command.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    // Crosses from the Suggestions group into Settings.
    expect(fixture.nativeElement.querySelector('[data-active]').textContent.trim()).toBe('Theme');
  });

  it('selects the highlighted item on Enter', () => {
    const command = fixture.nativeElement.querySelector('[role="combobox"]');

    command.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    command.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.chosen).toBe('billing');
  });

  it('selects on click', () => {
    const items = fixture.nativeElement.querySelectorAll('[role="option"]');
    items[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.chosen).toBe('theme');
  });

  it('highlights on hover', () => {
    const items = fixture.nativeElement.querySelectorAll('[role="option"]');
    items[2].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-active]').textContent.trim()).toBe('Theme');
  });

  it('keeps the highlight on a visible item after filtering', () => {
    search('theme');

    const active = fixture.nativeElement.querySelector('[data-active]');
    expect(active.textContent.trim()).toBe('Theme');
  });
});
