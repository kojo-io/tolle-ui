import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselOverviewComponent } from './carousel-overview/carousel-overview.component';
import { CarouselExamplesComponent } from './carousel-examples/carousel-examples.component';
import { CarouselApiComponent } from './carousel-api/carousel-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BaseService } from '../../shared/base.service';

@Component({
  selector: 'app-carousel-docs',
  standalone: true,
  imports: [
    CommonModule,
    CarouselOverviewComponent,
    CarouselExamplesComponent,
    CarouselApiComponent,
    DocsWrapperComponent
  ],
  templateUrl: './carousel-docs.component.html'
})
export class CarouselDocsComponent {
  baseService = inject(BaseService);
}
