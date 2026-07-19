import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartPieComponent } from '../../../../../../tolle/src/lib/chart-pie.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

interface Region {
    region: string;
    users: number;
}

@Component({
    selector: 'app-chart-pie-many-slices',
    standalone: true,
    imports: [CommonModule, ChartPieComponent, ButtonComponent],
    templateUrl: './chart-pie-many-slices.component.html'
})
export class ChartPieManySlicesComponent {
    /** Six categories: one more than the palette has steps. */
    private readonly all: Region[] = [
        { region: 'North America', users: 5210 },
        { region: 'Europe', users: 4380 },
        { region: 'Asia Pacific', users: 3140 },
        { region: 'Latin America', users: 1620 },
        { region: 'Middle East', users: 880 },
        { region: 'Africa', users: 540 }
    ];

    hidden = new Set<string>();

    /**
     * Recomputed on toggle, NOT read from a getter. A getter that filters would
     * hand the chart a new array reference on every change-detection pass, which
     * re-runs its ngOnChanges each time for no reason.
     */
    data: Region[] = [...this.all];

    get regions(): Region[] {
        return this.all;
    }

    isHidden(region: string): boolean {
        return this.hidden.has(region);
    }

    toggle(region: string): void {
        const next = new Set(this.hidden);
        if (next.has(region)) {
            next.delete(region);
        } else {
            next.add(region);
        }
        this.hidden = next;
        this.data = this.all.filter((row) => !this.hidden.has(row.region));
    }
}
