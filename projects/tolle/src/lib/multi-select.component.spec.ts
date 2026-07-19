import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MultiSelectComponent } from './multi-select.component';
import { SelectItemComponent } from './select-item.component';

/**
 * Characterization tests.
 *
 * These pin the behaviour `tolle-multi-select` shipped with — including the
 * chip list, whose `displayItems` getter was rebuilding every badge on every
 * change-detection pass — so the refactor can be proven not to change anything
 * a consumer can observe. Written and run GREEN against the untouched
 * component first.
 */

/** Waits out the component's `setTimeout` open sequence. */
function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      fixture.detectChanges();
      resolve();
    }, 30)
  );
}

@Component({
  standalone: true,
  imports: [MultiSelectComponent, SelectItemComponent, FormsModule],
  template: `
    <tolle-multi-select
      #ms
      [ngModel]="value"
      (ngModelChange)="onValueChange($event)"
      [ngModelOptions]="{ standalone: true }"
      [placeholder]="placeholder"
      [searchable]="searchable"
      [disabled]="disabled"
      [size]="size"
      [error]="error"
      [class]="extraClass"
      [maxSelections]="maxSelections"
      [maxDisplayItems]="maxDisplayItems"
    >
      <tolle-select-item value="apple" [multiSelect]="true">Apple</tolle-select-item>
      <tolle-select-item value="banana" [multiSelect]="true">Banana</tolle-select-item>
      <tolle-select-item value="cherry" [multiSelect]="true">Cherry</tolle-select-item>
      <tolle-select-item value="date" [multiSelect]="true">Date</tolle-select-item>
    </tolle-multi-select>
  `,
})
class MultiSelectHostComponent {
  @ViewChild('ms') ms!: MultiSelectComponent;
  value: any[] = [];
  placeholder = 'Select options...';
  searchable = false;
  disabled = false;
  error = false;
  size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  extraClass = '';
  maxSelections?: number;
  maxDisplayItems = 3;
  changes: any[][] = [];

  onValueChange(v: any[]) {
    this.value = v;
    this.changes.push(v);
  }
}

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('MultiSelectComponent (characterization)', () => {
  let fixture: ComponentFixture<MultiSelectHostComponent>;
  let host: MultiSelectHostComponent;

  const trigger = () =>
    fixture.nativeElement.querySelector('button[role="combobox"]') as HTMLButtonElement;
  const chips = () => Array.from(trigger().querySelectorAll('tolle-badge')) as HTMLElement[];
  const chipLabels = () => chips().map((c) => c.textContent!.trim());
  const options = () =>
    Array.from(fixture.nativeElement.querySelectorAll('tolle-select-item')) as HTMLElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectHostComponent);
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

  const openPanel = async () => {
    trigger().click();
    await settle(fixture);
  };

  // ---- trigger content ----

  it('shows the placeholder when nothing is selected', () => {
    expect(trigger().textContent).toContain('Select options...');
    expect(chips().length).toBe(0);
  });

  it('honours a custom placeholder', () => {
    host.placeholder = 'Pick some fruit';
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Pick some fruit');
  });

  // ---- ControlValueAccessor round-trip ----

  it('writeValue() renders a chip per selected value', async () => {
    host.ms.writeValue(['apple', 'cherry']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.ms.value).toEqual(['apple', 'cherry']);
    expect(chipLabels()).toEqual(['Apple', 'Cherry']);
  });

  it('writeValue() coerces a non-array to an empty selection', () => {
    host.ms.writeValue(null as any);
    fixture.detectChanges();
    expect(host.ms.value).toEqual([]);
  });

  it('selecting several options accumulates the value and notifies registerOnChange', async () => {
    await openPanel();

    options()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    options()[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.ms.value).toEqual(['apple', 'cherry']);
    expect(host.value).toEqual(['apple', 'cherry']);
    expect(chipLabels()).toEqual(['Apple', 'Cherry']);
  });

  it('stays open after a selection', async () => {
    await openPanel();

    options()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(host.ms.isOpen).toBe(true);
  });

  it('clicking a selected option again deselects it', async () => {
    await openPanel();

    options()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(host.ms.value).toEqual(['banana']);

    options()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(host.ms.value).toEqual([]);
  });

  // ---- chips / remove ----

  it('removing a chip via its remove control drops that value', async () => {
    host.ms.writeValue(['apple', 'banana']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const removeBtn = chips()[0].querySelector('button') as HTMLButtonElement;
    expect(removeBtn).not.toBeNull();

    removeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.ms.value).toEqual(['banana']);
    expect(chipLabels()).toEqual(['Banana']);
    expect(host.changes[host.changes.length - 1]).toEqual(['banana']);
  });

  it('removing a chip does not open the panel', async () => {
    host.ms.writeValue(['apple']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    (chips()[0].querySelector('button') as HTMLButtonElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    await settle(fixture);

    expect(host.ms.isOpen).toBe(false);
  });

  // ---- maxDisplayItems ----

  it('caps the chips at maxDisplayItems and shows an overflow indicator', async () => {
    host.ms.writeValue(['apple', 'banana', 'cherry', 'date']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(chipLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
    expect(trigger().textContent).toContain('+1 more');
  });

  it('honours a custom maxDisplayItems', async () => {
    host.maxDisplayItems = 2;
    fixture.detectChanges();

    host.ms.writeValue(['apple', 'banana', 'cherry', 'date']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(chipLabels()).toEqual(['Apple', 'Banana']);
    expect(trigger().textContent).toContain('+2 more');
    expect(host.ms.exceedsDisplayLimit).toBe(true);
  });

  it('shows no overflow indicator at or below the limit', async () => {
    host.ms.writeValue(['apple', 'banana', 'cherry']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.ms.exceedsDisplayLimit).toBe(false);
    expect(trigger().textContent).not.toContain('more');
  });

  // ---- maxSelections ----

  it('caps the selection at maxSelections and flags the limit', async () => {
    host.maxSelections = 2;
    fixture.detectChanges();
    await openPanel();

    options()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    options()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    options()[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(host.ms.value).toEqual(['apple', 'banana']);
    expect(host.ms.availableSelections).toBe(0);
    expect(trigger().textContent).toContain('(Max reached)');
  });

  it('selectAll() respects maxSelections', async () => {
    host.maxSelections = 2;
    fixture.detectChanges();
    await openPanel();

    host.ms.selectAll();
    fixture.detectChanges();

    expect(host.ms.value.length).toBe(2);
  });

  it('selectAll() with no cap selects every enabled option, clearAll() empties it', async () => {
    await openPanel();

    host.ms.selectAll();
    fixture.detectChanges();
    expect(host.ms.value).toEqual(['apple', 'banana', 'cherry', 'date']);

    host.ms.clearAll();
    fixture.detectChanges();
    expect(host.ms.value).toEqual([]);
    expect(host.changes[host.changes.length - 1]).toEqual([]);
  });

  // ---- open / close ----

  it('toggles open on trigger click', async () => {
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    await openPanel();
    expect(host.ms.isOpen).toBe(true);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).not.toBeNull();

    trigger().click();
    fixture.detectChanges();
    expect(host.ms.isOpen).toBe(false);
  });

  it('Escape closes the panel', async () => {
    await openPanel();

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(host.ms.isOpen).toBe(false);
  });

  it('an outside pointerdown closes the panel', async () => {
    await openPanel();
    expect(host.ms.isOpen).toBe(true);

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(host.ms.isOpen).toBe(false);
  });

  it('does not open when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();

    host.ms.toggle();
    fixture.detectChanges();

    expect(host.ms.isOpen).toBe(false);
    expect(trigger().disabled).toBe(true);
  });

  it('setDisabledState() disables the trigger', () => {
    host.ms.setDisabledState(true);
    fixture.detectChanges();

    expect(host.ms.disabled).toBe(true);
    expect(trigger().disabled).toBe(true);
  });

  // ---- keyboard ----

  it('ArrowDown on a closed multi-select opens it', async () => {
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await settle(fixture);

    expect(host.ms.isOpen).toBe(true);
  });

  it('arrow navigation moves the active option and tracks aria-activedescendant', async () => {
    await openPanel();

    expect(host.ms.activeIndex).toBe(0);
    const first = trigger().getAttribute('aria-activedescendant');
    expect(first).toBeTruthy();

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(host.ms.activeIndex).toBe(1);
    expect(trigger().getAttribute('aria-activedescendant')).not.toBe(first);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    expect(host.ms.activeIndex).toBe(0);
  });

  it('Enter toggles the active option without closing', async () => {
    await openPanel();

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.ms.value).toEqual(['banana']);
    expect(host.ms.isOpen).toBe(true);
  });

  it('aria-activedescendant is null while closed', () => {
    expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
  });

  // ---- searchable ----

  it('renders no search box unless searchable', async () => {
    await openPanel();
    expect(fixture.nativeElement.querySelector('tolle-input input')).toBeNull();
  });

  it('searchable filters the options and shows the empty state', async () => {
    host.searchable = true;
    fixture.detectChanges();
    await openPanel();

    expect(fixture.nativeElement.querySelector('tolle-input input')).not.toBeNull();

    host.ms.onSearchChange('ban');
    fixture.detectChanges();

    expect(host.ms.items.map((i) => i.hidden)).toEqual([true, false, true, true]);
    expect(host.ms.noResults).toBe(false);

    host.ms.onSearchChange('zzz');
    fixture.detectChanges();

    expect(host.ms.noResults).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('No results found');
  });

  it('clears the search filter when the panel closes', async () => {
    host.searchable = true;
    fixture.detectChanges();
    await openPanel();

    host.ms.onSearchChange('ban');
    fixture.detectChanges();
    expect(host.ms.items.get(0)!.hidden).toBe(true);

    host.ms.close();
    fixture.detectChanges();

    expect(host.ms.searchQuery).toBe('');
    expect(host.ms.items.get(0)!.hidden).toBe(false);
  });

  // ---- content-child registration ----

  it('registers projected options through ContentChildren', () => {
    expect(host.ms.items.length).toBe(4);
    expect(host.ms.selectableItems.length).toBe(4);
  });

  it('reflects selection state onto the projected options', async () => {
    host.ms.writeValue(['banana', 'date']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.ms.items.map((i) => i.selected)).toEqual([false, true, false, true]);
  });

  // ---- size / error / class ----

  it('applies the size padding to the trigger', () => {
    const sizes: Array<[MultiSelectHostComponent['size'], string]> = [
      ['xs', 'px-2'],
      ['sm', 'px-3'],
      ['default', 'px-3'],
      ['lg', 'px-4'],
    ];

    for (const [size, expected] of sizes) {
      host.size = size;
      fixture.detectChanges();
      expect(trigger().className).toContain(expected);
    }
  });

  it('applies the destructive border when error is set', () => {
    expect(trigger().className).not.toContain('border-destructive');

    host.error = true;
    fixture.detectChanges();

    expect(trigger().className).toContain('border-destructive');
  });

  it('merges the consumer class onto the trigger', () => {
    host.extraClass = 'my-custom-class';
    fixture.detectChanges();
    expect(trigger().className).toContain('my-custom-class');
  });

  it('applies the disabled trigger styling', () => {
    host.disabled = true;
    fixture.detectChanges();
    expect(trigger().className).toContain('cursor-not-allowed');
    expect(trigger().className).toContain('opacity-50');
  });

  it('rotates the chevron while open', async () => {
    const icon = () => trigger().querySelector('i')!;
    expect(icon().className).not.toContain('rotate-180');

    await openPanel();

    expect(icon().className).toContain('rotate-180');
  });

  // ---- the chip-recycling defect ----

  it('keeps the same chip DOM nodes across change-detection passes', async () => {
    host.ms.writeValue(['apple', 'banana']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const before = chips();
    expect(before.length).toBe(2);

    fixture.detectChanges();
    fixture.detectChanges();

    const after = chips();
    expect(after.length).toBe(2);
    expect(after[0]).toBe(before[0]);
    expect(after[1]).toBe(before[1]);
  });

  it('keeps a surviving chip node when another chip is removed', async () => {
    host.ms.writeValue(['apple', 'banana']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const bananaBefore = chips()[1];

    (chips()[0].querySelector('button') as HTMLButtonElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(chipLabels()).toEqual(['Banana']);
    // Without trackBy, syncItems() hands *ngFor a list of freshly-allocated
    // objects, so the untouched Banana chip is torn down and rebuilt too.
    expect(chips()[0]).toBe(bananaBefore);
  });

  it('keeps existing chip nodes when a further value is selected', async () => {
    host.ms.writeValue(['apple']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const appleBefore = chips()[0];

    await openPanel();
    options()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(chipLabels()).toEqual(['Apple', 'Banana']);
    expect(chips()[0]).toBe(appleBefore);
  });
});
