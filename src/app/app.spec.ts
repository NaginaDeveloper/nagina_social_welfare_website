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

  it('should render home marketing sections without tool pages embedded', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#spiritual-guide')).toBeTruthy();
    expect(compiled.querySelector('#about')).toBeTruthy();
    expect(compiled.querySelector('#work')).toBeTruthy();
    expect(compiled.querySelector('#guidance')).toBeTruthy();
    expect(compiled.querySelector('#events')).toBeTruthy();
    expect(compiled.querySelector('#donate')).toBeTruthy();
    expect(compiled.querySelector('#apps')).toBeTruthy();
    expect(compiled.querySelector('#contact')).toBeTruthy();
    expect(compiled.querySelector('#privacy')).toBeTruthy();
    expect(compiled.querySelector('#ahle-bait')).toBeNull();
    expect(compiled.querySelector('#sahaba-ikram')).toBeNull();
    expect(compiled.querySelector('#khatme-nabuwwat')).toBeNull();
    expect(compiled.querySelector('#prayer-times')).toBeNull();
    expect(compiled.querySelector('#quran')).toBeNull();
    expect(compiled.querySelector('#books')).toBeNull();
    expect(compiled.querySelector('#sermons')).toBeNull();
  });

  it('should navigate to dedicated namaz, quran, books and sermons routes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const compiled = fixture.nativeElement as HTMLElement;

    await router.navigateByUrl('/namaz');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('#prayer-times')).toBeTruthy();

    await router.navigateByUrl('/quran');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('#quran')).toBeTruthy();

    await router.navigateByUrl('/books');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('#books')).toBeTruthy();

    await router.navigateByUrl('/sermons');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('#sermons')).toBeTruthy();
  });

  it('should navigate to khatme-nabuwwat, ahle-bait and sahaba-ikram routes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const compiled = fixture.nativeElement as HTMLElement;

    await router.navigateByUrl('/khatme-nabuwwat');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('#khatme-nabuwwat')).toBeTruthy();

    await router.navigateByUrl('/ahle-bait');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('#ahle-bait')).toBeTruthy();

    await router.navigateByUrl('/sahaba-ikram');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('#sahaba-ikram')).toBeTruthy();
  });

  it('should render both programme arms on the home page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('#work article').length).toBe(2);
  });

  it('should render all three app install cards on the home page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('#apps article').length).toBe(3);
  });
});
