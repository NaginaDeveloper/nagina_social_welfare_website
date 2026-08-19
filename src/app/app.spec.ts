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

  it('should keep home as hero plus explore gateway without embedded sections', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#top')).toBeTruthy();
    expect(compiled.querySelector('#explore-heading')).toBeTruthy();
    expect(compiled.querySelector('#about')).toBeNull();
    expect(compiled.querySelector('#work')).toBeNull();
    expect(compiled.querySelector('#spiritual-guide')).toBeNull();
    expect(compiled.querySelector('#guidance')).toBeNull();
    expect(compiled.querySelector('#events')).toBeNull();
    expect(compiled.querySelector('#donate')).toBeNull();
    expect(compiled.querySelector('#apps')).toBeNull();
    expect(compiled.querySelector('#contact')).toBeNull();
    expect(compiled.querySelector('#privacy')).toBeNull();
    expect(compiled.querySelector('#prayer-times')).toBeNull();
  });

  it('should navigate to dedicated content routes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const compiled = fixture.nativeElement as HTMLElement;

    const checks: ReadonlyArray<[string, string]> = [
      ['/about', '#about'],
      ['/work', '#work'],
      ['/spiritual-guide', '#spiritual-guide'],
      ['/khatme-nabuwwat', '#khatme-nabuwwat'],
      ['/ahle-bait', '#ahle-bait'],
      ['/sahaba-ikram', '#sahaba-ikram'],
      ['/aulia-karam', '#aulia-karam'],
      ['/guidance', '#guidance'],
      ['/namaz', '#prayer-times'],
      ['/quran', '#quran'],
      ['/books', '#books'],
      ['/sermons', '#sermons'],
      ['/apps', '#apps'],
      ['/events', '#events'],
      ['/donate', '#donate'],
      ['/contact', '#contact'],
      ['/privacy', '#privacy'],
    ];

    for (const [path, selector] of checks) {
      await router.navigateByUrl(path);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(compiled.querySelector(selector), `expected ${selector} on ${path}`).toBeTruthy();
    }
  });
});
