import { TemplateRef, Type } from "@angular/core";

/**
 * Configuration for `ModalService.open()`. Always passed as a plain object
 * literal, so unset fields fall back to `MODAL_DEFAULTS` in `modal.service.ts`
 * rather than a class field initializer — those never run for a literal.
 */
export interface Modal<T = any> {
  /** The content to display (String, Component, or Template) */
  content: string | Type<any> | TemplateRef<any>;

  /** Optional title for the standard header */
  title?: string;

  /** * Predefined size scale.
   * - xs: 320px (Mobile alerts)
   * - sm: 425px (Standard dialogs)
   * - default: 512px (Forms)
   * - lg: 1024px (Data tables)
   * - xl: 1280px (Large forms, dashboards)
   * - fullscreen: 100vw/100vh (Complex workflows)
   */
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'fullscreen';

  /** * If true (default), clicking the backdrop closes the modal.
   * Set to false for "blocking" modals (e.g., Terms of Service).
   */
  backdropClose?: boolean;

  /** * Data to pass to a Component content.
   * Accessed via @Input() in the child component.
   */
  data?: { [key: string]: any };

  /** * Context to pass to a TemplateRef content.
   * Accessed via `let-val` in the HTML.
   */
  context?: T;

  /** Whether the built-in corner close button renders. Defaults to true. */
  showCloseButton?: boolean;
}
