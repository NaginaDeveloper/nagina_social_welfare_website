import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { imageTitle } from '../../config/image-seo.config';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-spiritual-guide',
  imports: [RouterLink],
  templateUrl: './spiritual-guide.html',
})
export class SpiritualGuide {
  protected readonly i18n = inject(LanguageService);
  protected readonly imageTitle = imageTitle;
  protected readonly portraitSrc = '/brand/allama-munir-ahmed-yusufi-portrait.jpg';
  protected readonly wikipediaUrl =
    'https://ur.wikipedia.org/wiki/%D9%85%D9%86%DB%8C%D8%B1_%D8%A7%D8%AD%D9%85%D8%AF_%DB%8C%D9%88%D8%B3%D9%81%DB%8C';
}
