import { Component } from '@angular/core';

import { SkeletonComponent } from '../../../../../../tolle/src/lib/skeleton.component';

@Component({
  selector: 'app-basic-skeleton-example',
  imports: [SkeletonComponent],
  template: `
    <div class="flex w-full max-w-sm items-center space-x-4 rounded-lg border bg-card p-4">
      <tolle-skeleton variant="circle" class="h-12 w-12" />
      <div class="flex flex-1 flex-col space-y-2">
        <tolle-skeleton variant="rect" class="h-4 w-[250px]" />
        <tolle-skeleton variant="rect" class="h-4 w-[200px]" />
      </div>
    </div>
  `,
})
export class BasicSkeletonExampleComponent {}
