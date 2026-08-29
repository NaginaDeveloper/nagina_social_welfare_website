import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Assistant } from './components/assistant/assistant';
import { FloatingWhatsapp } from './components/floating-whatsapp/floating-whatsapp';
import { DonateInvite } from './components/donate-invite/donate-invite';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { SeoService } from './seo/seo.service';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, DonateInvite, Footer, Assistant, FloatingWhatsapp],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);

  /** Soft site-wide invite — skipped on donate flow and privacy. */
  protected readonly showDonateInvite = signal(true);
  protected readonly showFloatingAssistant = signal(true);
  protected readonly showFloatingWhatsapp = signal(true);

  ngOnInit(): void {
    this.seo.start();
    this.syncDonateInvite(this.router.url);
    this.syncAssistantVisibility(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.syncDonateInvite(e.urlAfterRedirects);
        this.syncAssistantVisibility(e.urlAfterRedirects);
      });
  }

  private syncDonateInvite(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    const hide =
      path === '/donate' ||
      path === '/assistant' ||
      path.startsWith('/donate/') ||
      path === '/privacy' ||
      path === '/safeguarding' ||
      path === '/apply' ||
      path.startsWith('/apply/') ||
      path === '/membership' ||
      path.startsWith('/membership/');
    this.showDonateInvite.set(!hide);
  }

  private syncAssistantVisibility(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    this.showFloatingAssistant.set(path !== '/assistant');
  }
}
