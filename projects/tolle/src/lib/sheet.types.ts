import { TemplateRef, Type } from "@angular/core";

export type SheetSide = 'top' | 'bottom' | 'left' | 'right';

export interface SheetConfig<T = any> {
    /** The content to display (String, Component, or Template) */
    content: string | Type<any> | TemplateRef<any>;

    /** Optional title for the standard header */
    title?: string;

    /** Optional description for the standard header */
    description?: string;

    /** The edge of the screen where the component will appear. Defaults to 'right' */
    side?: SheetSide;

    /** Whether the sheet has a backdrop. Defaults to true */
    hasBackdrop?: boolean;

    /** If true, clicking the backdrop closes the sheet. Defaults to true */
    backdropClose?: boolean;

    /** Whether to show the close button. Defaults to true */
    showCloseButton?: boolean;

    /** Whether the sheet content has rounded corners on its inner side. Defaults to false */
    rounded?: boolean;

    /**
     * Data for a Component content. Keys that match the component's `@Input()`s
     * are bound to them; every key is also readable from the injected
     * `SheetRef` (`inject(SheetRef).config.data`).
     */
    data?: { [key: string]: any };

    /** Context to pass to a TemplateRef content */
    context?: T;

    /** Additional CSS classes for the sheet content */
    class?: string;
}
