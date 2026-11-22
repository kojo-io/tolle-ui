import { Type, reflectComponentType } from '@angular/core';

/**
 * The entries of `data` that are real inputs of `component`, keyed by their
 * template name — the shape `*ngComponentOutlet`'s `inputs` expects.
 *
 * Used by ModalService / SheetService so `open({ content: MyComponent, data })`
 * sets MyComponent's `@Input()`s. Keys that are not inputs are skipped rather
 * than passed through, because setting an unknown input throws (NG0303); they
 * stay readable from the injected ref (`inject(ModalRef).modal.data`).
 */
export function componentInputs(
  component: Type<unknown> | null | undefined,
  data: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  if (!component || !data) return {};
  const mirror = reflectComponentType(component);
  if (!mirror) return {};
  const names = new Set(mirror.inputs.map((i) => i.templateName));
  return Object.fromEntries(Object.entries(data).filter(([key]) => names.has(key)));
}
