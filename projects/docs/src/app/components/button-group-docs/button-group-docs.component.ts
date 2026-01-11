import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {AnalyticsService} from '../../analytics.service';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import {ButtonComponent} from '../../../../../tolle/src/lib/button.component';
import {NgIf} from '@angular/common';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {TooltipDirective} from '../../../../../tolle/src/lib/tooltip.directive';
import {FormsModule} from '@angular/forms';
import {ButtonGroupComponent} from '../../../../../tolle/src/lib/button-group.component';

@Component({
  selector: 'app-button-group-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    ButtonComponent,
    ButtonGroupComponent,
    NgIf,
    SegmentedComponent,
    TooltipDirective,
    FormsModule
  ],
  templateUrl: './button-group-docs.component.html',
  styleUrl: './button-group-docs.component.css'
})
export class ButtonGroupDocsComponent implements OnInit {
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

  installation = "import {ButtonGroupComponent, ButtonComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    ButtonGroupComponent,\n" +
    "    ButtonComponent,\n" +
    "  ]";

  previewCode = "<tolle-button-group>\n" +
    "  <tolle-button>Primary (Auto)</tolle-button>\n" +
    "  <tolle-button variant=\"secondary\">Secondary (Derived)</tolle-button>\n" +
    "  <tolle-button variant=\"outline\">Outline</tolle-button>\n" +
    "  <tolle-button variant=\"destructive\">\n" +
    "    Close (Destructive)\n" +
    "  </tolle-button>\n" +
    "</tolle-button-group>\n" +
    "\n" +
    "<tolle-button-group>\n" +
    "  <tolle-button variant=\"outline\" size=\"lg\">\n" +
    "    <i class=\"ri-github-line mr-1\"></i>\n" +
    "    <span>View on GitHub</span>\n" +
    "  </tolle-button>\n" +
    "\n" +
    "  <tolle-button\n" +
    "    variant=\"outline\"\n" +
    "    size=\"icon-lg\"\n" +
    "    tolleTooltip=\"Edit Profile\"\n" +
    "    placement=\"top\">\n" +
    "    <i class=\"ri-edit-line\"></i>\n" +
    "  </tolle-button>\n" +
    "</tolle-button-group>\n" +
    "\n" +
    "<tolle-button-group>\n" +
    "  <tolle-button size=\"icon-lg\">\n" +
    "    <i class=\"ri-more-2-fill\"></i>\n" +
    "  </tolle-button>\n" +
    "  <tolle-button size=\"icon-lg\" variant=\"destructive\">\n" +
    "    <i class=\"ri-more-2-fill\"></i>\n" +
    "  </tolle-button>\n" +
    "  <tolle-button size=\"icon-lg\" variant=\"secondary\">\n" +
    "    <i class=\"ri-more-2-fill\"></i>\n" +
    "  </tolle-button>\n" +
    "  <tolle-button size=\"icon-lg\">\n" +
    "    <i class=\"ri-more-2-fill\"></i>\n" +
    "  </tolle-button>\n" +
    "</tolle-button-group>"
}
