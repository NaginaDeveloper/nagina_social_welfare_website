import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { BooksService } from '../../services/books.service';
import { SermonsService } from '../../services/sermons.service';

interface ArchiveLink {
  readonly id: string;
  readonly titleKey: string;
  readonly hintKey: string;
  readonly href: string;
}

@Component({
  selector: 'app-seedha-rastah',
  imports: [RouterLink],
  templateUrl: './seedha-rastah.html',
})
export class SeedhaRastah implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly books = inject(BooksService);
  protected readonly sermons = inject(SermonsService);

  protected readonly originalUrl = 'https://seedharastah.com/';
  protected readonly naginaTvUrl = 'https://www.youtube.com/user/92nagina/';
  protected readonly portraitSrc = 'brand/munir-ahmed-yusufi.jpg';
  protected readonly wikipediaUrl =
    'https://ur.wikipedia.org/wiki/%D9%85%D9%86%DB%8C%D8%B1_%D8%A7%D8%AD%D9%85%D8%AF_%DB%8C%D9%88%D8%B3%D9%81%DB%8C';

  protected readonly bookCount = computed(() => this.books.books().length);
  protected readonly sermonCount = computed(() => this.sermons.sermons().length);

  protected readonly archiveLinks: readonly ArchiveLink[] = [
    {
      id: 'books',
      titleKey: 'seedha.dir.books',
      hintKey: 'seedha.dir.booksHint',
      href: 'https://seedharastah.com/books.htm',
    },
    {
      id: 'audio',
      titleKey: 'seedha.dir.audio',
      hintKey: 'seedha.dir.audioHint',
      href: 'https://seedharastah.com/audio_bayan.htm',
    },
    {
      id: 'video',
      titleKey: 'seedha.dir.video',
      hintKey: 'seedha.dir.videoHint',
      href: 'https://seedharastah.com/audio_video.htm',
    },
    {
      id: 'tafseer',
      titleKey: 'seedha.dir.tafseer',
      hintKey: 'seedha.dir.tafseerHint',
      href: 'https://seedharastah.com/tafseer.htm',
    },
    {
      id: 'seedha',
      titleKey: 'seedha.dir.seedha',
      hintKey: 'seedha.dir.seedhaHint',
      href: 'https://seedharastah.com/seedha.htm',
    },
    {
      id: 'tabia',
      titleKey: 'seedha.dir.tabia',
      hintKey: 'seedha.dir.tabiaHint',
      href: 'https://seedharastah.com/tabia.htm',
    },
    {
      id: 'zakat',
      titleKey: 'seedha.dir.zakat',
      hintKey: 'seedha.dir.zakatHint',
      href: 'https://seedharastah.com/zakat.htm',
    },
    {
      id: 'calendar',
      titleKey: 'seedha.dir.calendar',
      hintKey: 'seedha.dir.calendarHint',
      href: 'https://seedharastah.com/calendar.php',
    },
    {
      id: 'magazine',
      titleKey: 'seedha.dir.magazine',
      hintKey: 'seedha.dir.magazineHint',
      href: 'https://seedharastah.com/ColumnMain1.php?Wri_id=430',
    },
    {
      id: 'yousafi',
      titleKey: 'seedha.dir.yousafi',
      hintKey: 'seedha.dir.yousafiHint',
      href: 'https://seedharastah.com/mollanayousfi.htm',
    },
    {
      id: 'society',
      titleKey: 'seedha.dir.society',
      hintKey: 'seedha.dir.societyHint',
      href: 'https://seedharastah.com/nagina_soceity.htm',
    },
    {
      id: 'tv',
      titleKey: 'seedha.dir.tv',
      hintKey: 'seedha.dir.tvHint',
      href: 'http://www.nagina.tv/',
    },
  ];

  ngOnInit(): void {
    void this.books.load();
    void this.sermons.load();
  }
}
