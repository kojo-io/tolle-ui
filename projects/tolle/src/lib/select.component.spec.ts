import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from './select.component';
import { SelectItemComponent } from './select-item.component';

/**
 * Characterization tests.
 *
 * These pin the behaviour `tolle-select` shipped with, so the cva / OnPush /
 * JSDoc refactor can be proven not to change anything a consumer can observe.
 * They were written and run GREEN against the untouched component first.
 */

/** Waits out the component's `requestAnimationFrame` open sequence. */
function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() =>
      setTimeout(() => {
        fixture.detectChanges();
        resolve();
      }, 20)
    )
  );
}

@Component({
  standalone: true,
  imports: [SelectComponent, SelectItemComponent, FormsModule],
  template: `
    <tolle-select
      #select
      [ngModel]="value"
      (ngModelChange)="onValueChange($event)"
      [ngModelOptions]="{ standalone: true }"
      [placeholder]="placeholder"
      [searchable]="searchable"
      [disabled]="disabled"
      [readonly]="readonly"
      [size]="size"
      [class]="extraClass"
    >
      <tolle-select-item value="apple">Apple</tolle-select-item>
      <tolle-select-item value="banana">Banana</tolle-select-item>
      <tolle-select-item value="cherry" [disabled]="cherryDisabled">Cherry</tolle-select-item>
    </tolle-select>
  `,
})
class SelectHostComponent {
  @ViewChild('select') select!: SelectComponent;
  value: any = null;
  placeholder = 'Select an option';
  searchable = false;
  disabled = false;
  readonly = false;
  size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  extraClass = '';
  cherryDisabled = false;
  changes: any[] = [];

  onValueChange(v: any) {
    this.value = v;
    this.changes.push(v);
  }
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('SelectComponent (characterization)', () => {
  let fixture: ComponentFixture<SelectHostComponent>;
  let host: SelectHostComponent;

  const trigger = () =>
    fixture.nativeElement.querySelector('button[role="combobox"]') as HTMLButtonElement;
  const triggerText = () => trigger().querySelector('span')!.textContent!.trim();
  const options = () =>
    Array.from(fixture.nativeElement.querySelectorAll('tolle-select-item')) as HTMLElement[];
  const searchInput = () =>
    fixture.nativeElement.querySelector('tolle-input input') as HTMLInputElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectHostComponent);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture.nativeElement.parentNode) {
      document.body.removeChild(fixture.nativeElement);
    }
    fixture.destroy();
  });

  // ---- trigger label ----

  it('shows the placeholder when nothing is selected', () => {
    expect(triggerText()).toBe('Select an option');
    expect(trigger().querySelector('span')!.className).toContain('text-muted-foreground');
  });

  it('honours a custom placeholder', () => {
    host.placeholder = 'Pick a fruit';
    fixture.detectChanges();
    expect(triggerText()).toBe('Pick a fruit');
  });

  it('shows the selected option label once a value is written', async () => {
    host.value = 'banana';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(triggerText()).toBe('Banana');
    expect(trigger().querySelector('span')!.className).not.toContain('text-muted-foreground');
  });

  // ---- ControlValueAccessor round-trip ----

  it('writeValue() reflects in the trigger and marks the item selected', async () => {
    host.select.writeValue('cherry');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.select.value).toBe('cherry');
    expect(triggerText()).toBe('Cherry');
  });

  it('choosing an option propagates the value through registerOnChange', async () => {
    trigger().click();
    await settle(fixture);

    options()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.changes).toContain('banana');
    expect(host.value).toBe('banana');
    expect(triggerText()).toBe('Banana');
  });

  it('closes after a selection is made', async () => {
    trigger().click();
    await settle(fixture);
    expect(host.select.isOpen).toBe(true);

    options()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(host.select.isOpen).toBe(false);
  });

  // ---- open / close ----

  it('toggles open on trigger click and exposes aria-expanded / data-state', async () => {
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('data-state')).toBe('closed');

    trigger().click();
    await settle(fixture);

    expect(host.select.isOpen).toBe(true);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('data-state')).toBe('open');

    trigger().click();
    fixture.detectChanges();
    expect(host.select.isOpen).toBe(false);
  });

  it('Escape closes the panel', async () => {
    trigger().click();
    await settle(fixture);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(host.select.isOpen).toBe(false);
  });

  it('an outside pointerdown closes the panel', async () => {
    trigger().click();
    await settle(fixture);
    expect(host.select.isOpen).toBe(true);

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(host.select.isOpen).toBe(false);
  });

  it('does not open when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();

    host.select.toggle();
    fixture.detectChanges();

    expect(host.select.isOpen).toBe(false);
    expect(trigger().disabled).toBe(true);
  });

  it('does not open when readonly', () => {
    host.readonly = true;
    fixture.detectChanges();

    trigger().click();
    fixture.detectChanges();

    expect(host.select.isOpen).toBe(false);
  });

  it('setDisabledState() disables the trigger', () => {
    host.select.setDisabledState(true);
    fixture.detectChanges();

    expect(host.select.disabled).toBe(true);
    expect(trigger().disabled).toBe(true);
  });

  // ---- keyboard ----

  it('ArrowDown on a closed select opens it', async () => {
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await settle(fixture);

    expect(host.select.isOpen).toBe(true);
  });

  it('arrow navigation moves the active option and tracks aria-activedescendant', async () => {
    trigger().click();
    await settle(fixture);

    const first = trigger().getAttribute('aria-activedescendant');
    expect(first).toBeTruthy();
    expect(host.select.activeIndex).toBe(0);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(host.select.activeIndex).toBe(1);
    const second = trigger().getAttribute('aria-activedescendant');
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    expect(host.select.activeIndex).toBe(0);
  });

  it('End / Home jump to the last / first navigable option', async () => {
    trigger().click();
    await settle(fixture);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(host.select.activeIndex).toBe(2);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(host.select.activeIndex).toBe(0);
  });

  it('Enter selects the active option', async () => {
    trigger().click();
    await settle(fixture);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.value).toBe('banana');
    expect(host.select.isOpen).toBe(false);
  });

  it('skips disabled options during navigation', async () => {
    host.cherryDisabled = true;
    fixture.detectChanges();

    trigger().click();
    await settle(fixture);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();

    // Cherry is disabled, so the last navigable option is Banana (index 1).
    expect(host.select.activeIndex).toBe(1);
  });

  it('aria-activedescendant is null while closed', () => {
    expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
  });

  // ---- searchable ----

  it('renders no search box unless searchable', () => {
    expect(searchInput()).toBeNull();
  });

  it('searchable filters the options and shows the empty state', async () => {
    host.searchable = true;
    fixture.detectChanges();

    trigger().click();
    await settle(fixture);

    expect(searchInput()).not.toBeNull();

    host.select.onSearchChange('ban');
    fixture.detectChanges();

    expect(host.select.items.map((i) => i.hidden)).toEqual([true, false, true]);
    expect(host.select.noResults).toBe(false);

    host.select.onSearchChange('zzz');
    fixture.detectChanges();

    expect(host.select.noResults).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('No results found.');
  });

  it('clears the search filter when the panel closes', async () => {
    host.searchable = true;
    fixture.detectChanges();

    trigger().click();
    await settle(fixture);

    host.select.onSearchChange('ban');
    fixture.detectChanges();
    expect(host.select.items.get(0)!.hidden).toBe(true);

    host.select.close();
    fixture.detectChanges();

    expect(host.select.searchQuery).toBe('');
    expect(host.select.items.get(0)!.hidden).toBe(false);
  });

  // ---- content-child registration ----

  it('registers projected options through ContentChildren', () => {
    expect(host.select.items.length).toBe(3);
    expect(host.select.items.map((i) => i.value)).toEqual(['apple', 'banana', 'cherry']);
  });

  it('reflects selection state onto the projected options', async () => {
    host.value = 'cherry';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.select.items.map((i) => i.selected)).toEqual([false, false, true]);
  });

  // ---- size / class ----

  it('applies the size classes to the trigger', () => {
    const sizes: Array<[SelectHostComponent['size'], string]> = [
      ['xs', 'h-8'],
      ['sm', 'h-9'],
      ['default', 'h-10'],
      ['lg', 'h-11'],
    ];

    for (const [size, expected] of sizes) {
      host.size = size;
      fixture.detectChanges();
      expect(trigger().className).toContain(expected);
    }
  });

  it('merges the consumer class onto the trigger', () => {
    host.extraClass = 'my-custom-class';
    fixture.detectChanges();
    expect(trigger().className).toContain('my-custom-class');
  });

  it('applies the readonly and disabled trigger styling', () => {
    host.readonly = true;
    fixture.detectChanges();
    expect(trigger().className).toContain('border-dashed');
    expect(trigger().className).toContain('cursor-default');

    host.readonly = false;
    host.disabled = true;
    fixture.detectChanges();
    expect(trigger().className).toContain('cursor-not-allowed');
    expect(trigger().className).toContain('opacity-50');
  });

  it('rotates the chevron while open', async () => {
    const icon = () => trigger().querySelector('i')!;
    expect(icon().className).not.toContain('rotate-180');

    trigger().click();
    await settle(fixture);

    expect(icon().className).toContain('rotate-180');
  });
});
