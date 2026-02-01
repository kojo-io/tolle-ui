import { Subject, Observable } from 'rxjs';

export type AlertDialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'fit';

export interface AlertDialogConfig {
    title: string;
    description: string;
    cancelText?: string;
    actionText?: string;
    variant?: 'default' | 'destructive';
    size?: AlertDialogSize;
}

export class AlertDialogRef {
    private readonly _afterClosed = new Subject<boolean>();
    afterClosed$: Observable<boolean> = this._afterClosed.asObservable();

    close(result: boolean = false): void {
        this._afterClosed.next(result);
        this._afterClosed.complete();
    }
}
