import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {AnalyticsService} from '../../analytics.service';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import { NgIf} from '@angular/common';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent, CardTitleComponent
} from '../../../../../tolle/src/lib/card.component';
import {ButtonComponent} from '../../../../../tolle/src/lib/button.component';
import {InputComponent} from '../../../../../tolle/src/lib/input.component';

@Component({
  selector: 'app-card-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardFooterComponent,
    CardTitleComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './card-docs.component.html',
  styleUrl: './card-docs.component.css'
})
export class CardDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
  selectedTab = "preview";
  basicTab = "preview";
  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  installation = "import {\n" +
    "  CardComponent,\n" +
    "  CardContentComponent,\n" +
    "  CardFooterComponent,\n" +
    "  CardHeaderComponent,\n" +
    "  CardTitleComponent\n" +
    "} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "     CardComponent,\n" +
    "    CardContentComponent,\n" +
    "    CardHeaderComponent,\n" +
    "    CardFooterComponent,\n" +
    "    CardTitleComponent,\n" +
    "  ]";


  previewCode = "<tolle-card class=\"max-w-md\">\n" +
    "  <tolle-card-header>\n" +
    "    <tolle-card-title class=\"flex items-center gap-2\">\n" +
    "      <i class=\"ri-palette-line text-primary\"></i>\n" +
    "      Theme Settings\n" +
    "    </tolle-card-title>\n" +
    "    <p class=\"text-sm text-muted-foreground\">\n" +
    "      Derived colors will update as you change the primary.\n" +
    "    </p>\n" +
    "  </tolle-card-header>\n" +
    "\n" +
    "  <tolle-card-content class=\"space-y-4\">\n" +
    "    <div class=\"space-y-1.5\">\n" +
    "      <label class=\"text-xs font-bold uppercase text-muted-foreground\">Primary Hex</label>\n" +
    "      <tolle-input [ngModel]=\"'#2563eb'\">\n" +
    "        <i prefix class=\"ri-drop-line\"></i>\n" +
    "      </tolle-input>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"p-4 rounded-lg bg-secondary text-secondary-foreground text-sm\">\n" +
    "      <strong>Pro Tip:</strong> This background is auto-generated using <code>color-mix</code>\n" +
    "      based on your primary color!\n" +
    "    </div>\n" +
    "  </tolle-card-content>\n" +
    "\n" +
    "  <tolle-card-footer class=\"flex justify-between gap-1\">\n" +
    "    <tolle-button variant=\"ghost\">Cancel</tolle-button>\n" +
    "    <tolle-button>Save Changes</tolle-button>\n" +
    "  </tolle-card-footer>\n" +
    "</tolle-card>";
}
