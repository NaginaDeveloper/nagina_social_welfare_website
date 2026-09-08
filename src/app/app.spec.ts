import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the brand wordmark', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Nagina');
  });

  it('should render the tile-based homepage with Assistant and map', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#top')).toBeTruthy();
    expect(compiled.querySelector('#home-hub-search')).toBeTruthy();
    expect(compiled.querySelector('a[href="/assistant"]')).toBeTruthy();
    expect(compiled.querySelector('iframe[title^="Map of"]')).toBeTruthy();
    expect(compiled.querySelector('#photographs')).toBeNull();
    expect(compiled.querySelector('#shajra')).toBeNull();
    expect(compiled.querySelector('#privacy')).toBeNull();
    expect(compiled.querySelector('#safeguarding')).toBeNull();
  });

  it('should navigate to dedicated content routes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const compiled = fixture.nativeElement as HTMLElement;

    const checks: ReadonlyArray<[string, string]> = [
      ['/about', '#about'],
      ['/work', '#work'],
      ['/madrasa', '#madrasa'],
      ['/spiritual-guide', '#spiritual-guide'],
      ['/spiritual-guide', '#shajra'],
      ['/spiritual-guide', '#photographs'],
      ['/khatme-nabuwwat', '#khatme-nabuwwat'],
      ['/ahle-bait', '#ahle-bait'],
      ['/sahaba-ikram', '#sahaba-ikram'],
      ['/aulia-karam', '#aulia-karam'],
      ['/basic-beliefs', '#basic-beliefs'],
      ['/guidance', '#guidance'],
      ['/namaz', '#prayer-times'],
      ['/zakat', '#zakat'],
      ['/quran', '#quran'],
      ['/hadith', '#hadith'],
      ['/seedha-rastah', '#seedha-rastah'],
      ['/books', '#books'],
      ['/sermons', '#sermons'],
      ['/apps', '#apps'],
      ['/events', '#events'],
      ['/donate', '#donate'],
      ['/contact', '#contact'],
      ['/privacy', '#privacy'],
      ['/safeguarding', '#safeguarding'],
    ];

    for (const [path, selector] of checks) {
      await router.navigateByUrl(path);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(compiled.querySelector(selector), `expected ${selector} on ${path}`).toBeTruthy();
    }
  }, 20_000);

  it('should show at least 20 photographs of Munir-e-Islam on the spiritual guide page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/spiritual-guide');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('#photographs img').length).toBeGreaterThanOrEqual(20);
    expect(compiled.querySelector('#shajra-hero')).toBeTruthy();
    expect(compiled.querySelector('#shajra-source')).toBeTruthy();
    expect(compiled.querySelectorAll('#shajra img').length).toBe(29);
  }, 20_000);
});
