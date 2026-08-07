import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { SermonsService } from '../../services/sermons.service';
import type { Sermon } from '../../models/sermon';

@Component({
  selector: 'app-sermons',
  imports: [FormsModule],
  templateUrl: './sermons.html',
})
export class Sermons implements OnInit {
  protected readonly sermons = inject(SermonsService);
  private readonly sanitizer = inject(DomSanitizer);

  protected search = '';
  protected readonly active = signal<Sermon | null>(null);
  protected readonly embedUrl = signal<SafeResourceUrl | null>(null);

  ngOnInit(): void {
    void this.sermons.load();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closePlayer();
  }

  protected onSearch(value: string): void {
    this.search = value;
    this.sermons.setQuery(value);
  }

  protected thumbnail(sermon: Sermon): string | null {
    return this.sermons.thumbnailUrl(sermon);
  }

  protected open(sermon: Sermon): void {
    const embed = this.sermons.youtubeEmbedUrl(sermon);
    if (embed) {
      this.active.set(sermon);
      this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embed));
      return;
    }
    window.open(sermon.sourceUrl, '_blank', 'noopener,noreferrer');
  }

  protected closePlayer(): void {
    this.active.set(null);
    this.embedUrl.set(null);
  }

  protected watchOnYoutube(sermon: Sermon): string {
    return this.sermons.openUrl(sermon);
  }

  protected onThumbError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
