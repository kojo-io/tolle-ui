import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../../../../tolle/src/lib/skeleton.component';

@Component({
    selector: 'app-basic-skeleton-example',
    imports: [CommonModule, SkeletonComponent],
    template: `
    <div class="flex items-center space-x-4 p-4 border rounded-lg bg-card max-w-sm w-full">
      <tolle-skeleton variant="circle" class="h-12 w-12" />
      <div class="space-y-2 flex-1 flex flex-col">
        <tolle-skeleton variant="rect" class="h-4 w-[250px]" />
        <tolle-skeleton variant="rect" class="h-4 w-[200px]" />
      </div>
    </div>
  `
})
export class BasicSkeletonExampleComponent { }
