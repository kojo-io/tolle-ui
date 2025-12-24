import { TemplateRef, Type } from "@angular/core";

export class Modal<T = any> {
  /** The content to display (String, Component, or Template) */
  content!: string | Type<any> | TemplateRef<any>;

  /** Optional title for the standard header */
  title?: string;

  /** * Predefined size scale.
   * - xs: 320px (Mobile alerts)
   * - sm: 425px (Standard dialogs)
   * - default: 544px (Forms)
   * - lg: 90% / 1024px (Data tables)
   * - fullscreen: 100vw/100vh (Complex workflows)
   */
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'fullscreen' = 'default';

  /** * If true (default), clicking the backdrop closes the modal.
   * Set to false for "blocking" modals (e.g., Terms of Service).
   */
  backdropClose?: boolean = true;

  /** * Data to pass to a Component content.
   * Accessed via @Input() in the child component.
   */
  data?: { [key: string]: any };

  /** * Context to pass to a TemplateRef content.
   * Accessed via `let-val` in the HTML.
   */
  context?: T;
}
