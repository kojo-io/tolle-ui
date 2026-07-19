import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ItemComponent,
  ItemGroupComponent,
  ItemMediaComponent,
  ItemContentComponent,
  ItemTitleComponent,
  ItemDescriptionComponent,
  ItemActionsComponent,
  ItemHeaderComponent,
  ItemFooterComponent
} from './item.component';

@Component({
  standalone: true,
  imports: [
    ItemComponent,
    ItemGroupComponent,
    ItemMediaComponent,
    ItemContentComponent,
    ItemTitleComponent,
    ItemDescriptionComponent,
    ItemActionsComponent,
    ItemHeaderComponent,
    ItemFooterComponent
  ],
  template: `
    <tolle-item-group>
      <tolle-item [variant]="variant" [size]="size">
        <tolle-item-header>Header text</tolle-item-header>
        <tolle-item-media><i class="ri-user-line"></i></tolle-item-media>
        <tolle-item-content>
          <tolle-item-title>Ada Lovelace</tolle-item-title>
          <tolle-item-description>First programmer</tolle-item-description>
        </tolle-item-content>
        <tolle-item-actions><button type="button">Follow</button></tolle-item-actions>
        <tolle-item-footer>Footer text</tolle-item-footer>
      </tolle-item>
    </tolle-item-group>
  `
})
class ItemHostComponent {
  variant: any = 'default';
  size: any = 'default';
}

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const row = (): HTMLElement => fixture.nativeElement.querySelector('div');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applies the base flex row classes', () => {
    expect(row().className).toContain('flex');
    expect(row().className).toContain('items-center');
  });

  it('applies the default variant and size classes', () => {
    expect(row().className).toContain('border-transparent');
    expect(row().className).toContain('px-4');
    expect(row().className).toContain('py-3');
  });

  it('changes classes for the outline variant', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    expect(row().className).toContain('border-border');
    expect(row().className).not.toContain('border-transparent');
  });

  it('changes classes for the muted variant', () => {
    fixture.componentRef.setInput('variant', 'muted');
    fixture.detectChanges();

    expect(row().className).toContain('bg-muted/50');
  });

  it('changes classes when the size variant changes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(row().className).toContain('px-3');
    expect(row().className).toContain('py-2');
    expect(row().className).not.toContain('px-4');
  });

  it('supports the xs size variant', () => {
    fixture.componentRef.setInput('size', 'xs');
    fixture.detectChanges();

    expect(row().className).toContain('px-2');
    expect(row().className).toContain('gap-2');
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-item');
    fixture.detectChanges();

    expect(row().className).toContain('my-custom-item');
  });
});

describe('Item sub-components', () => {
  let hostFixture: ComponentFixture<ItemHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemHostComponent]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(ItemHostComponent);
    hostFixture.detectChanges();
    host = hostFixture.nativeElement;
  });

  it('renders the group as a list', () => {
    const group: HTMLElement = host.querySelector('tolle-item-group div')!;
    expect(group.getAttribute('role')).toBe('list');
    expect(group.className).toContain('flex-col');
  });

  it('projects the title into a paragraph', () => {
    const title: HTMLElement = host.querySelector('tolle-item-title p')!;
    expect(title.textContent!.trim()).toBe('Ada Lovelace');
    expect(title.className).toContain('font-medium');
  });

  it('projects the description into a paragraph', () => {
    const description: HTMLElement = host.querySelector('tolle-item-description p')!;
    expect(description.textContent!.trim()).toBe('First programmer');
    expect(description.className).toContain('text-muted-foreground');
  });

  it('projects media content', () => {
    const media: HTMLElement = host.querySelector('tolle-item-media div')!;
    expect(media.querySelector('i')).toBeTruthy();
    expect(media.className).toContain('shrink-0');
  });

  it('projects action content', () => {
    const actions: HTMLElement = host.querySelector('tolle-item-actions div')!;
    expect(actions.querySelector('button')!.textContent!.trim()).toBe('Follow');
    expect(actions.className).toContain('shrink-0');
  });

  it('projects header and footer content', () => {
    const header: HTMLElement = host.querySelector('tolle-item-header div')!;
    const footer: HTMLElement = host.querySelector('tolle-item-footer div')!;

    expect(header.textContent!.trim()).toBe('Header text');
    expect(footer.textContent!.trim()).toBe('Footer text');
    expect(header.className).toContain('w-full');
    expect(footer.className).toContain('w-full');
  });

  it('lets the content column grow', () => {
    const content: HTMLElement = host.querySelector('tolle-item-content div')!;
    expect(content.className).toContain('flex-1');
    expect(content.className).toContain('min-w-0');
  });

  it('reflects variant changes driven from the host', () => {
    hostFixture.componentInstance.variant = 'outline';
    hostFixture.detectChanges();

    const row: HTMLElement = host.querySelector('tolle-item > div')!;
    expect(row.className).toContain('border-border');
  });
});
