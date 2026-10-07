import {
  Component,
  HostListener,
  OnInit,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PrayerTimesService } from '../../services/prayer-times.service';
import { EventsService } from '../../services/events.service';
import { MemberAuthService } from '../../services/member-auth.service';
import { AssistantLauncherService } from '../../services/assistant-launcher.service';
import { ORGANIZATION } from '../../config/organization.config';
import { buildNavGroups, type NavGroup, type NavLink } from '../../config/navigation.config';
import { centrePath } from '../../config/centre-pages.config';
import { LanguageService } from '../../i18n/language.service';
import { isEventToday } from '../../config/upcoming-events.config';
import { campusTown } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { Icon } from '../ui/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  protected readonly memberAuth = inject(MemberAuthService);

  protected readonly prayer = inject(PrayerTimesService);
  private readonly events = inject(EventsService);
  private readonly assistantLauncher = inject(AssistantLauncherService);
  private readonly router = inject(Router);
  private readonly campusService = inject(CampusService);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly openGroupId = signal<string | null>(null);
  protected readonly currentPath = signal('/');
  protected readonly latestEvent = this.events.latestDatedEvent;

  /** Dark bar everywhere except the untouched top of the home page. */
  protected readonly solid = computed(
    () => this.scrolled() || this.menuOpen() || this.currentPath() !== '/' || !!this.latestEvent(),
  );

  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Grouped navigation — every destination is a dedicated route (no hash links).
   * About = organisation; Beliefs = creed pages; kept separate so menus stay scannable.
   */
  private readonly centreLinks = computed<readonly NavLink[]>(() =>
    this.campusService.campuses().flatMap((campus): NavLink[] => {
      const centre: NavLink = {
        labelKey: 'nav.centre',
        label: campusTown(campus),
        hint: campus.displayName,
        path: centrePath(campus.id),
        icon: 'mosque',
      };
      return [centre];
    }),
  );

  protected readonly groups = computed<readonly NavGroup[]>(() => buildNavGroups(this.centreLinks()));

  ngOnInit(): void {
    void this.memberAuth.restoreSession();
    void this.campusService.load();
    void this.events.load();
    this.syncPath(this.router.url);
    this.schedulePrayerLoad();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.syncPath(e.urlAfterRedirects);
        this.closeMenu();
      });
  }

  constructor() {
    afterNextRender(() => {
      this.onScroll();
    });
    effect(() => {
      const hasTicker = !!this.latestEvent();
      if (typeof document === 'undefined') {
        return;
      }
      document.documentElement.classList.toggle('has-event-ticker', hasTicker);
    });
  }

  /** Defer AlAdhan fetch so it does not compete with first paint on every page. */
  private schedulePrayerLoad(): void {
    const run = () => void this.prayer.load();
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(() => run(), { timeout: 2500 });
    } else {
      setTimeout(run, 1200);
    }
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 16);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.openGroupId.set(null);
    this.menuOpen.set(false);
  }

  protected tickerTitle(): string {
    const event = this.latestEvent();
    if (!event) {
      return '';
    }
    return this.i18n.lang() === 'ur' ? event.titleUr : event.title;
  }

  protected tickerMeta(): string {
    const event = this.latestEvent();
    if (!event) {
      return '';
    }
    if (this.i18n.lang() === 'ur') {
      return event.whenLabelUr ?? event.recurringUr ?? event.audienceUr;
    }
    return event.whenLabel ?? event.recurring ?? event.audience;
  }

  protected tickerIsToday(): boolean {
    const event = this.latestEvent();
    return !!event && isEventToday(event);
  }

  protected tickerFragment(): string {
    const event = this.latestEvent();
    return event ? `event-${event.id}` : 'events';
  }

  protected openLatestEvent(domEvent: Event): void {
    domEvent.preventDefault();
    domEvent.stopPropagation();
    this.onNavClick();
    void this.router.navigate(['/events'], { fragment: this.tickerFragment() });
  }

  protected linkLabel(item: NavLink): string {
    return item.label ?? this.i18n.t(item.labelKey);
  }

  protected linkHint(item: NavLink): string {
    return item.hint ?? (item.hintKey ? this.i18n.t(item.hintKey) : '');
  }

  protected isLinkActive(item: NavLink): boolean {
    if (item.externalHref || !item.path) return false;
    return this.currentPath() === item.path;
  }

  protected isGroupActive(group: NavGroup): boolean {
    return group.items.some((item) => this.isLinkActive(item));
  }

  protected isGroupOpen(id: string): boolean {
    return this.openGroupId() === id;
  }

  /** First half of the menus hang left; the rest hang right so wide panels never run off-screen. */
  protected panelAlign(index: number): string {
    return index < this.groups().length / 2 ? 'left-0' : 'right-0';
  }

  protected menuPanelWidth(group: NavGroup): string {
    return group.items.length > 5 ? 'min(40rem, calc(100vw - 2rem))' : '18rem';
  }

  /** Mouse users get hover-to-open; touch and pen keep tap-to-toggle. */
  protected onGroupPointerEnter(id: string, event: PointerEvent): void {
    if (event.pointerType !== 'mouse') {
      return;
    }
    this.cancelClose();
    this.openGroupId.set(id);
  }

  protected onGroupPointerLeave(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') {
      return;
    }
    this.cancelClose();
    this.closeTimer = setTimeout(() => this.openGroupId.set(null), 150);
  }

  private cancelClose(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  protected toggleLang(): void {
    this.i18n.setLang(this.i18n.lang() === 'en' ? 'ur' : 'en');
  }

  protected otherLangLabel(): string {
    return this.i18n.lang() === 'en' ? this.i18n.t('header.langUr') : this.i18n.t('header.langEn');
  }

  protected toggleGroup(id: string, event?: Event): void {
    event?.stopPropagation();
    this.cancelClose();
    this.openGroupId.update((current) => (current === id ? null : id));
  }

  protected closeGroups(): void {
    this.cancelClose();
    this.openGroupId.set(null);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.openGroupId.set(null);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.openGroupId.set(null);
  }

  protected onNavClick(): void {
    this.closeMenu();
  }

  protected openAssistant(): void {
    this.closeMenu();
    if (this.currentPath() === '/assistant') {
      return;
    }
    this.assistantLauncher.open();
  }

  private syncPath(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    this.currentPath.set(path === '' ? '/' : path);
  }
}
