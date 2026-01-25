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

    /** Data to pass to a Component content */
    data?: { [key: string]: any };

    /** Context to pass to a TemplateRef content */
    context?: T;

    /** Additional CSS classes for the sheet content */
    class?: string;
}
