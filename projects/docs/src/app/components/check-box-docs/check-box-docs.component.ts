import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {AnalyticsService} from '../../analytics.service';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import {NgIf} from '@angular/common';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {CheckboxComponent} from '../../../../../tolle/src/lib/checkbox.component';

@Component({
  selector: 'app-check-box-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    CheckboxComponent
  ],
  templateUrl: './check-box-docs.component.html',
  styleUrl: './check-box-docs.component.css'
})
export class CheckBoxDocsComponent implements OnInit {
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

  installation = "import {CheckboxComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    CheckboxComponent,\n" +
    "  ]";


  previewCode = "<div class=\"flex items-start gap-3\">\n" +
    "  <tolle-checkbox ></tolle-checkbox>\n" +
    "  <div class=\"grid gap-1.5 leading-none\">\n" +
    "    <label class=\"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70\">\n" +
    "      Accept terms and conditions\n" +
    "    </label>\n" +
    "    <p class=\"text-xs text-muted-foreground\">\n" +
    "      You agree to our Terms of Service and Privacy Policy.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"flex items-center gap-2 mt-2\">\n" +
    "  <tolle-checkbox size=\"xs\"></tolle-checkbox>\n" +
    "  <span class=\"text-xs\">Remember me</span>\n" +
    "</div>";
}
