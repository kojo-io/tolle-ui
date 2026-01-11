import {Component, inject, OnInit} from '@angular/core';
import {ButtonComponent} from "../../../../../tolle/src/lib/button.component";
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import {NgIf} from '@angular/common';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {BaseService} from '../../shared/base.service';
import {AnalyticsService} from '../../analytics.service';
import {TooltipDirective} from '../../../../../tolle/src/lib/tooltip.directive';

@Component({
  selector: 'app-button-docs',
  standalone: true,
  imports: [
    ButtonComponent,
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    TooltipDirective,
  ],
  templateUrl: './button-docs.component.html',
  styleUrl: './button-docs.component.css'
})
export class ButtonDocsComponent implements OnInit {
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

  installation = "import {ButtonComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    ButtonComponent,\n" +
    "  ]";

  previewCode = "<tolle-button>Primary (Auto)</tolle-button>\n" +
    "<tolle-button variant=\"secondary\">Secondary (Derived)</tolle-button>\n" +
    "<tolle-button variant=\"outline\">Outline</tolle-button>\n" +
    "<tolle-button variant=\"ghost\">Ghost</tolle-button>\n" +
    "<tolle-button variant=\"link\">I am button link</tolle-button>\n" +
    "<tolle-button size=\"lg\" variant=\"destructive\">\n" +
    "  Close (Destructive)\n" +
    "</tolle-button>\n" +
    "<tolle-button variant=\"outline\" size=\"lg\">\n" +
    "  <i class=\"ri-github-line mr-1\"></i>\n" +
    "  <span>View on GitHub</span>\n" +
    "</tolle-button>\n" +
    "<tolle-button\n" +
    "  variant=\"outline\"\n" +
    "  size=\"icon\"\n" +
    "  tolleTooltip=\"Edit Profile\"\n" +
    "  placement=\"top\">\n" +
    "  <i class=\"ri-edit-line\"></i>\n" +
    "</tolle-button>\n" +
    "<tolle-button size=\"icon-lg\">\n" +
    "  <i class=\"ri-more-2-fill\"></i>\n" +
    "</tolle-button>\n" +
    "<tolle-button size=\"icon\" variant=\"destructive\">\n" +
    "  <i class=\"ri-more-2-fill\"></i>\n" +
    "</tolle-button>\n" +
    "<tolle-button size=\"icon-sm\" variant=\"secondary\">\n" +
    "  <i class=\"ri-more-2-fill\"></i>\n" +
    "</tolle-button>\n" +
    "<tolle-button size=\"icon-xs\">\n" +
    "  <i class=\"ri-more-2-fill\"></i>\n" +
    "</tolle-button>";
}
