import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from '../../../../../../tolle/src/lib/popover.component';
import { PopoverContentComponent } from '../../../../../../tolle/src/lib/popover-content.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-basic-popover-example',
    standalone: true,
    imports: [CommonModule, PopoverComponent, PopoverContentComponent, ButtonComponent],
    template: `
    <div class="flex justify-center p-10">
      <tolle-popover placement="bottom">
        <tolle-button trigger variant="outline">Open Popover</tolle-button>
        <tolle-popover-content>
          <div class="grid gap-4">
            <div class="space-y-2">
              <h4 class="font-medium leading-none">Dimensions</h4>
              <p class="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div class="grid gap-2">
              <div class="grid grid-cols-3 items-center gap-4">
                <span class="text-sm font-medium">Width</span>
                <span class="col-span-2 text-sm text-right px-3 py-1 border rounded bg-muted/50">100%</span>
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <span class="text-sm font-medium">Height</span>
                <span class="col-span-2 text-sm text-right px-3 py-1 border rounded bg-muted/50">25px</span>
              </div>
            </div>
          </div>
        </tolle-popover-content>
      </tolle-popover>
    </div>
  `
})
export class BasicPopoverExampleComponent { }
