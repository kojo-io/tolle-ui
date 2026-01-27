import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressComponent } from '../../../../../../tolle/src/lib/progress.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-progress-interactive',
    imports: [
        CommonModule,
        FormsModule,
        ProgressComponent,
        PlaygroundComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <div class="w-full max-w-md">
            <tolle-progress [value]="value"></tolle-progress>
          </div>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Value ({{ value }}%)</label>
            <input 
              type="range" 
              [(ngModel)]="value" 
              min="0" 
              max="100"
              class="w-full"
            />
          </div>
          <button 
            (click)="simulateProgress()" 
            class="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            Simulate Load
          </button>
        </div>
      </app-playground>
    </section>
  `
})
export class ProgressInteractiveComponent implements OnInit, OnDestroy {
    value = 33;
    timer: any;

    ngOnInit() { }

    ngOnDestroy() {
        if (this.timer) clearTimeout(this.timer);
    }

    simulateProgress() {
        this.value = 0;
        const update = () => {
            if (this.value < 100) {
                this.value += Math.floor(Math.random() * 10) + 5;
                if (this.value > 100) this.value = 100;
                this.timer = setTimeout(update, 500);
            }
        };
        update();
    }

    get playgroundCode() {
        return `<tolle-progress [value]="${this.value}"></tolle-progress>`;
    }
}
