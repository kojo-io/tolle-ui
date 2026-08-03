import { Component } from '@angular/core';
import { EmptyStateComponent } from '../../../../../../tolle/src/lib/empty-state.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-basic-empty-state',
    imports: [EmptyStateComponent, ButtonComponent],
    template: `
    <tolle-empty-state 
      title="No projects found" 
      description="You haven't created any projects yet. Get started by creating your first project.">
      <i icon class="ri-folder-open-line text-3xl text-muted-foreground/60"></i>
      <div actions class="flex gap-2">
        <tolle-button variant="outline" size="sm">Import Project</tolle-button>
        <tolle-button size="sm">Create Project</tolle-button>
      </div>
    </tolle-empty-state>
  `
})
export class BasicEmptyStateComponent { }
