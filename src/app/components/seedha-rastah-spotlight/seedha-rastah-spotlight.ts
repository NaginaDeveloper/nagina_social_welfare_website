import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-seedha-rastah-spotlight',
  imports: [RouterLink],
  templateUrl: './seedha-rastah-spotlight.html',
})
export class SeedhaRastahSpotlight {
  protected readonly i18n = inject(LanguageService);
  protected readonly originalUrl = 'https://seedharastah.com/';
}
