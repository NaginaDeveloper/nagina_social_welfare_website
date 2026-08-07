import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  effect,
  inject,
  viewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BISMILLAH_ARABIC, QuranService } from '../../services/quran.service';
import type { QuranAyah, SurahSummary } from '../../models/quran';

@Component({
  selector: 'app-quran',
  imports: [FormsModule],
  templateUrl: './quran.html',
})
export class Quran implements OnInit, OnDestroy {
  protected readonly quran = inject(QuranService);
  protected readonly bismillah = BISMILLAH_ARABIC;
  protected search = '';

  private readonly ayahEls = viewChildren<ElementRef<HTMLElement>>('ayahCard');

  constructor() {
    effect(() => {
      const playing = this.quran.playingAyah();
      if (playing == null) return;
      const cards = this.ayahEls();
      const el = cards.find((c) => Number(c.nativeElement.dataset['ayah']) === playing);
      el?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  ngOnInit(): void {
    void this.quran.loadSurahs();
  }

  ngOnDestroy(): void {
    this.quran.destroy();
  }

  protected onSearch(value: string): void {
    this.search = value;
    this.quran.setQuery(value);
  }

  protected openSurah(surah: SurahSummary): void {
    void this.quran.openSurah(surah.number);
  }

  protected backToList(): void {
    this.quran.backToList();
  }

  protected prevSurah(): void {
    const current = this.quran.currentSurah();
    if (!current || current.number <= 1) return;
    void this.quran.openSurah(current.number - 1);
  }

  protected nextSurah(): void {
    const current = this.quran.currentSurah();
    if (!current || current.number >= 114) return;
    void this.quran.openSurah(current.number + 1);
  }

  protected playAyah(ayah: QuranAyah): void {
    this.quran.playAyah(ayah);
  }

  protected playSurah(): void {
    this.quran.playSurah();
  }

  protected stopAudio(): void {
    this.quran.stop();
  }

  protected isPlaying(ayah: QuranAyah): boolean {
    return this.quran.playingAyah() === ayah.numberInSurah;
  }

  protected revelationLabel(type: string): string {
    return type === 'Medinan' ? 'Madani' : type === 'Meccan' ? 'Makki' : type;
  }
}
