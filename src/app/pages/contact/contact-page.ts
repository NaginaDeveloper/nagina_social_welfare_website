import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Contact } from '../../components/contact/contact';

@Component({
  selector: 'app-contact-page',
  imports: [PageShell, Contact],
  template: `
    <app-page-shell title="Contact">
      <app-contact />
    </app-page-shell>
  `,
})
export class ContactPage {}
