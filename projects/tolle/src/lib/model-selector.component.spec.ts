import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSelectorComponent, type ModelOption } from './model-selector.component';

const MODELS: ModelOption[] = [
  { id: 'sonnet', name: 'Sonnet', provider: 'Anthropic', description: 'Balanced', badge: 'new' },
  { id: 'opus', name: 'Opus', provider: 'Anthropic', description: 'Most capable' },
  { id: 'llama', name: 'Llama 3', provider: 'Meta' },
  { id: 'retired', name: 'Retired model', provider: 'Meta', disabled: true },
];

describe('ModelSelectorComponent', () => {
  let component: ModelSelectorComponent;
  let fixture: ComponentFixture<ModelSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ModelSelectorComponent] }).compileComponents();

    fixture = TestBed.createComponent(ModelSelectorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('models', MODELS);
    fixture.detectChanges();
  });

  const trigger = (): HTMLButtonElement => fixture.nativeElement.querySelector('button[role="combobox"]');
  const openPanel = () => {
    trigger().click();
    fixture.detectChanges();
  };
  const options = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tolle-command-item [role="option"]'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the placeholder until a model is chosen', () => {
    expect(trigger().textContent).toContain('Select a model');
    expect(trigger().querySelector('span')!.className).toContain('text-muted-foreground');
  });

  it('groups the models by provider, preserving input order', () => {
    expect(component.groups.map((group) => group.provider)).toEqual(['Anthropic', 'Meta']);
    expect(component.groups[0].models.map((model) => model.id)).toEqual(['sonnet', 'opus']);
    expect(component.groups[1].models.map((model) => model.id)).toEqual(['llama', 'retired']);
  });

  it('files models without a provider into a single unlabelled group', () => {
    fixture.componentRef.setInput('models', [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
    ]);
    fixture.detectChanges();

    expect(component.groups.length).toBe(1);
    expect(component.groups[0].provider).toBe('');
    expect(component.groups[0].models.length).toBe(2);
  });

  it('applies the default trigger size and variant classes', () => {
    expect(trigger().className).toContain('h-9');
    expect(trigger().className).toContain('border-input');
  });

  it('changes trigger classes for the sm size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(trigger().className).toContain('h-8');
    expect(trigger().className).not.toContain('h-9');
  });

  it('changes trigger classes for the ghost variant', () => {
    fixture.componentRef.setInput('variant', 'ghost');
    fixture.detectChanges();

    expect(trigger().className).toContain('border-transparent');
    expect(trigger().className).toContain('bg-transparent');
  });

  it('round-trips a value written by a form control', () => {
    component.writeValue('opus');
    fixture.detectChanges();

    expect(component.value).toBe('opus');
    expect(trigger().textContent).toContain('Opus');
    expect(trigger().querySelector('span')!.className).toContain('text-foreground');
  });

  it('reports the selected option object', () => {
    component.writeValue('llama');
    fixture.detectChanges();

    expect(component.selected!.name).toBe('Llama 3');
    expect(component.selected!.provider).toBe('Meta');
  });

  it('resolves to null when the written value matches no model', () => {
    component.writeValue('does-not-exist');
    fixture.detectChanges();

    expect(component.selected).toBeNull();
    expect(trigger().textContent).toContain('Select a model');
  });

  it('optionally prefixes the trigger label with the provider', () => {
    fixture.componentRef.setInput('showProviderOnTrigger', true);
    component.writeValue('sonnet');
    fixture.detectChanges();

    expect(trigger().textContent).toContain('Anthropic / Sonnet');
  });

  it('notifies the form control and emits when a model is chosen', () => {
    const onChange = jasmine.createSpy('onChange');
    const valueChange = jasmine.createSpy('valueChange');
    const modelChange = jasmine.createSpy('modelChange');
    component.registerOnChange(onChange);
    component.valueChange.subscribe(valueChange);
    component.modelChange.subscribe(modelChange);

    component.onSelect('opus');
    fixture.detectChanges();

    expect(component.value).toBe('opus');
    expect(onChange).toHaveBeenCalledWith('opus');
    expect(valueChange).toHaveBeenCalledWith('opus');
    expect(modelChange).toHaveBeenCalledWith(jasmine.objectContaining({ id: 'opus', name: 'Opus' }));
  });

  it('marks the control as touched when the panel closes', () => {
    const onTouched = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouched);

    component.onPopoverClose();

    expect(onTouched).toHaveBeenCalled();
  });

  it('honours setDisabledState from the forms API', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.disabled).toBeTrue();
    expect(trigger().disabled).toBeTrue();
  });

  it('renders the grouped list when the trigger is clicked', () => {
    openPanel();

    const headings = Array.from(
      fixture.nativeElement.querySelectorAll('tolle-command-group [role="group"] > div')
    ).map((el) => (el as HTMLElement).textContent!.trim());

    expect(headings).toContain('Anthropic');
    expect(headings).toContain('Meta');
    expect(options().length).toBe(4);
  });

  it('renders descriptions and badges on the options', () => {
    openPanel();

    expect(options()[0].textContent).toContain('Sonnet');
    expect(options()[0].textContent).toContain('Balanced');
    expect(options()[0].textContent).toContain('new');
  });

  it('marks disabled models as unselectable', () => {
    openPanel();

    expect(options()[3].getAttribute('aria-disabled')).toBe('true');
  });

  it('selects a model when its row is clicked', () => {
    const valueChange = jasmine.createSpy('valueChange');
    component.valueChange.subscribe(valueChange);

    openPanel();
    options()[2].click();
    fixture.detectChanges();

    expect(component.value).toBe('llama');
    expect(valueChange).toHaveBeenCalledWith('llama');
    expect(trigger().textContent).toContain('Llama 3');
  });

  it('hides the search box when searchable is false', () => {
    fixture.componentRef.setInput('searchable', false);
    fixture.detectChanges();
    openPanel();

    expect(fixture.nativeElement.querySelector('tolle-command-input')).toBeNull();
  });

  it('merges extra classes onto the trigger', () => {
    fixture.componentRef.setInput('class', 'my-selector');
    fixture.detectChanges();

    expect(trigger().className).toContain('my-selector');
  });
});
