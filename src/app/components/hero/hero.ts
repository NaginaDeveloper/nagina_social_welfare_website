import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { whatsappHref } from '../../config/organization.config';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly whatsapp = whatsappHref(
    'Assalamu alaikum, I would like to get in touch with Nagina Social Welfare.',
  );
}
