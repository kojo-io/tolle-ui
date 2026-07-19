import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { coloris, init as colorisInit } from '@melloware/coloris';

import { ThemeService } from '../../../../tolle/src/lib/theme.service';
import { generateThemeCss, generateBaseCss, generateChartCss } from '../../../../tolle/src/lib/utils/color';
import { ButtonComponent } from '../../../../tolle/src/lib/button.component';
import { SelectComponent } from '../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../tolle/src/lib/select-item.component';
import { SeparatorComponent } from '../../../../tolle/src/lib/separator.component';
import { TooltipDirective } from '../../../../tolle/src/lib/tooltip.directive';
import { SegmentComponent, SegmentItem } from '../../../../tolle/src/lib/segment.component';
import {
  FieldComponent,
  FieldLabelComponent,
  FieldDescriptionComponent,
} from '../../../../tolle/src/lib/field.component';
import {
  ItemComponent,
  ItemMediaComponent,
  ItemContentComponent,
  ItemTitleComponent,
  ItemActionsComponent,
} from '../../../../tolle/src/lib/item.component';
import {
  ChartComponent,
  ChartGridComponent,
  ChartXAxisComponent,
  ChartYAxisComponent,
  ChartBarComponent,
} from '../../../../tolle/src/lib/chart.component';
import { ChartPieComponent } from '../../../../tolle/src/lib/chart-pie.component';
import type { ChartSeries } from '../../../../tolle/src/lib/chart.service';
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
} from '../../../../tolle/src/lib/tabs.component';

import { ThemePreviewComponent } from './theme-preview.component';
import { DemoIconComponent } from './demo-icon.component';
import {
  COLOR_PRESETS,
  BASE_COLORS,
  RADIUS_PRESETS,
  FONT_SANS,
  FONT_SERIF,
  FONT_MONO,
  ICON_SETS,
  NAMED_PRESETS,
  DEFAULT_PRESET,
  ThemePreset,
  NamedPreset,
  encodePreset,
  decodePreset,
} from './theme-data';

type FontKind = 'sans' | 'serif' | 'mono';

/**
 * The Tolle theme generator — a shadcn `/create`-style configurator. A control rail
 * (color, radius, appearance, typography, icon set) drives the live design tokens via
 * ThemeService, a kitchen-sink canvas shows the result, and the whole configuration
 * round-trips through a shareable `?preset=` URL + copy-paste CSS / provider / CLI code.
 */
@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonComponent,
    SelectComponent,
    SelectItemComponent,
    SeparatorComponent,
    TooltipDirective,
    SegmentComponent,
    FieldComponent,
    FieldLabelComponent,
    FieldDescriptionComponent,
    ItemComponent,
    ItemMediaComponent,
    ItemContentComponent,
    ItemTitleComponent,
    ItemActionsComponent,
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartBarComponent,
    ChartPieComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    ThemePreviewComponent,
    DemoIconComponent,
  ],
  templateUrl: './themes.component.html',
  styleUrl: './themes.component.css',
})
export class ThemesComponent implements OnInit, AfterViewInit {
  private theme = inject(ThemeService);
  private route = inject(ActivatedRoute);

  // option catalogs (template-bound)
  colorPresets = COLOR_PRESETS;
  baseColors = BASE_COLORS;
  radiusPresets = RADIUS_PRESETS;
  fontSans = FONT_SANS;
  fontSerif = FONT_SERIF;
  fontMono = FONT_MONO;
  iconSets = ICON_SETS;
  namedPresets = NAMED_PRESETS;

  /* --- segmented-control catalogs ---
   * Built once as fields, never as getters: `tolle-segment` diffs `items` in
   * ngOnChanges, so a fresh array on every read would re-measure the glider on
   * every change-detection pass. */

  radiusItems: SegmentItem[] = RADIUS_PRESETS.map((r) => ({ label: r.label, value: r.value }));

  appearanceItems: SegmentItem[] = [
    { label: 'Light', value: 'light', icon: 'ri-sun-line' },
    { label: 'Dark', value: 'dark', icon: 'ri-moon-line' },
  ];

  iconItems: SegmentItem[] = ICON_SETS.map((s) => ({ label: s.label, value: s.id, data: s }));

  /* --- chart palette demo data ---
   * Plain fields for the same reason: `tolle-chart` reacts to `data`/`series`
   * identity in ngOnChanges, and a getter that rebuilt the array would fire it
   * on every pass. The palette itself is read from `--chart-1…5` at paint time,
   * so the charts recolour with the theme without Angular touching them. */

  chartSeries: ChartSeries[] = [
    { key: 'direct', label: 'Direct' },
    { key: 'organic', label: 'Organic' },
    { key: 'referral', label: 'Referral' },
    { key: 'social', label: 'Social' },
  ];

  chartData = [
    { month: 'Jan', direct: 186, organic: 142, referral: 88, social: 61 },
    { month: 'Feb', direct: 214, organic: 158, referral: 96, social: 74 },
    { month: 'Mar', direct: 178, organic: 191, referral: 112, social: 69 },
    { month: 'Apr', direct: 243, organic: 176, referral: 104, social: 92 },
    { month: 'May', direct: 262, organic: 208, referral: 131, social: 87 },
    { month: 'Jun', direct: 295, organic: 226, referral: 148, social: 108 },
  ];

  /** Five slices — one per palette step, so the whole scale is visible at once. */
  pieData = [
    { label: 'Direct', value: 1378 },
    { label: 'Organic', value: 1101 },
    { label: 'Referral', value: 679 },
    { label: 'Social', value: 491 },
    { label: 'Email', value: 284 },
  ];

  /** The active configuration mirrored from the live theme. */
  preset: ThemePreset = { ...DEFAULT_PRESET };

  /** Which code block was last copied (for transient "Copied" feedback). */
  copied = '';

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('preset');
    const decoded = code ? decodePreset(code) : null;
    if (decoded) {
      this.applyPreset(decoded);
    } else {
      this.preset = this.readCurrentTheme();
      this.syncUrl();
    }
  }

  ngAfterViewInit(): void {
    // Register + bind the custom color picker (styles are loaded app-wide).
    colorisInit();
    coloris({
      el: '.themes-coloris',
      theme: 'polaroid',
      themeMode: 'dark',
      formatToggle: true,
      closeButton: true,
      clearButton: false,
    });
  }

  /* --- controls --- */

  selectBase(id: string): void {
    this.preset = { ...this.preset, base: id };
    this.theme.setBaseColor(id);
    this.syncUrl();
  }

  selectColor(hex: string): void {
    this.preset = { ...this.preset, primary: hex };
    this.theme.setPrimaryColor(hex);
    this.syncUrl();
  }

  onCustomColor(hex: string): void {
    if (!hex) return;
    this.selectColor(hex);
  }

  selectChart(hex: string): void {
    this.preset = { ...this.preset, chart: hex };
    this.theme.setChartColor(hex);
    this.syncUrl();
  }

  onCustomChart(hex: string): void {
    if (!hex) return;
    this.selectChart(hex);
  }

  selectRadius(value: string): void {
    this.preset = { ...this.preset, radius: value };
    this.theme.setRadius(value);
    this.syncUrl();
  }

  setAppearance(mode: 'light' | 'dark'): void {
    this.preset = { ...this.preset, appearance: mode };
    this.theme.setAppearance(mode);
    this.syncUrl();
  }

  toggleAppearance(): void {
    this.setAppearance(this.preset.appearance === 'dark' ? 'light' : 'dark');
  }

  selectFont(kind: FontKind, stack: string): void {
    this.preset = { ...this.preset, [`font${cap(kind)}`]: stack } as ThemePreset;
    this.theme.setFont(kind, stack);
    this.syncUrl();
  }

  selectIcons(id: string): void {
    this.preset = { ...this.preset, icons: id };
    this.persistIcons(id);
    this.syncUrl();
  }

  applyNamed(n: NamedPreset): void {
    this.applyPreset(n.preset);
  }

  reset(): void {
    this.applyPreset(DEFAULT_PRESET);
  }

  /* --- active-state helpers --- */

  isBase(id: string): boolean {
    return this.preset.base === id;
  }
  isColor(hex: string): boolean {
    return this.preset.primary?.toLowerCase() === hex.toLowerCase();
  }
  isChart(hex: string): boolean {
    return this.preset.chart?.toLowerCase() === hex.toLowerCase();
  }
  // Radius / appearance / icon set no longer need an `is*` predicate: they are
  // `tolle-segment` controls now, and the segment tracks its own selection
  // through ngModel.
  isNamed(n: NamedPreset): boolean {
    return (
      n.preset.base === this.preset.base &&
      n.preset.primary === this.preset.primary &&
      n.preset.chart === this.preset.chart &&
      n.preset.radius === this.preset.radius &&
      n.preset.appearance === this.preset.appearance &&
      n.preset.icons === this.preset.icons &&
      n.preset.fontSans === this.preset.fontSans
    );
  }

  fontValue(kind: FontKind): string {
    return this.preset[`font${cap(kind)}` as keyof ThemePreset] as string;
  }

  get iconLabel(): string {
    return this.iconSets.find((s) => s.id === this.preset.icons)?.label ?? 'Remix';
  }

  get iconHint(): string {
    return this.iconSets.find((s) => s.id === this.preset.icons)?.hint ?? 'Library default';
  }

  /* --- code output --- */

  get cssCode(): string {
    const dedent = (css: string) =>
      css
        .split('\n')
        .map((l) => l.replace(/^ {6}/, ''))
        .join('\n')
        .trim();

    const baseName = this.baseColors.find((b) => b.id === this.preset.base)?.name ?? 'Zinc';
    return [
      `/* Base color · ${baseName} */`,
      dedent(generateBaseCss(this.preset.base)),
      ``,
      `/* Theme color · radius · typography */`,
      dedent(
        generateThemeCss(this.preset.primary, this.preset.radius, {
          sans: this.preset.fontSans,
          serif: this.preset.fontSerif,
          mono: this.preset.fontMono,
        })
      ),
      ``,
      `/* Charts */`,
      dedent(generateChartCss(this.preset.chart)),
    ].join('\n');
  }

  get providerCode(): string {
    return [
      `import { provideTolleConfig } from '@tolle_/tolle-ui';`,
      ``,
      `export const appConfig: ApplicationConfig = {`,
      `  providers: [`,
      `    provideTolleConfig({`,
      `      baseColor: '${this.preset.base}',`,
      `      primaryColor: '${this.preset.primary}',`,
      `      chartColor: '${this.preset.chart}',`,
      `      radius: '${this.preset.radius}',`,
      `      darkByDefault: ${this.preset.appearance === 'dark'},`,
      `      fontSans: '${this.preset.fontSans}',`,
      `      fontSerif: '${this.preset.fontSerif}',`,
      `      fontMono: '${this.preset.fontMono}',`,
      `    }),`,
      `  ],`,
      `};`,
    ].join('\n');
  }

  get cliCode(): string {
    return [
      `# 1 · Add Tolle UI to your Angular app`,
      `npx @tolle_/cli init`,
      ``,
      `# 2 · Generate the components you need (source you own)`,
      `npx @tolle_/cli add button card input select tabs calendar data-table`,
      ``,
      `# 3 · Apply this theme — paste the CSS from the "CSS variables" tab`,
      `#     into your global stylesheet, or pass the values to`,
      `#     provideTolleConfig() (see the "Provider" tab).`,
      ``,
      `# Icons: this preset uses "${this.iconLabel}". Component internals ship`,
      `# with Remix Icons; the icon set applies to your own markup.`,
    ].join('\n');
  }

  get shareUrl(): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tolle-ui.com';
    return `${origin}/themes?preset=${encodePreset(this.preset)}`;
  }

  copy(text: string, key: string): void {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(text);
    }
    this.copied = key;
    setTimeout(() => {
      if (this.copied === key) this.copied = '';
    }, 1400);
  }

  copyShare(): void {
    this.copy(this.shareUrl, 'share');
  }

  /* --- internals --- */

  private applyPreset(p: ThemePreset): void {
    this.preset = { ...p };
    this.theme.setBaseColor(p.base);
    this.theme.setPrimaryColor(p.primary);
    this.theme.setChartColor(p.chart);
    this.theme.setRadius(p.radius);
    this.theme.setAppearance(p.appearance);
    this.theme.setFont('sans', p.fontSans);
    this.theme.setFont('serif', p.fontSerif);
    this.theme.setFont('mono', p.fontMono);
    this.persistIcons(p.icons);
    this.syncUrl();
  }

  private readCurrentTheme(): ThemePreset {
    const ls = (k: string) => (typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null);
    return {
      base: this.theme.baseColor || DEFAULT_PRESET.base,
      primary: this.theme.primaryColor || DEFAULT_PRESET.primary,
      chart: this.theme.chartColor || DEFAULT_PRESET.chart,
      radius: ls('tolle-radius') || DEFAULT_PRESET.radius,
      appearance: this.theme.isDark ? 'dark' : 'light',
      fontSans: ls('tolle-font-sans') || DEFAULT_PRESET.fontSans,
      fontSerif: ls('tolle-font-serif') || DEFAULT_PRESET.fontSerif,
      fontMono: ls('tolle-font-mono') || DEFAULT_PRESET.fontMono,
      icons: ls('tolle-preview-icons') || DEFAULT_PRESET.icons,
    };
  }

  private persistIcons(id: string): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem('tolle-preview-icons', id);
  }

  private syncUrl(): void {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('preset', encodePreset(this.preset));
    history.replaceState(history.state, '', url.toString());
  }
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
