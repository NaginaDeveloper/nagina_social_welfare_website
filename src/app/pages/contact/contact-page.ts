import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Contact } from '../../components/contact/contact';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-contact-page',
  imports: [NextSteps, PageShell, Contact],
  template: `
    <app-page-shell title="Contact">
      <app-contact />
      <app-next-steps page="/contact" />
    </app-page-shell>
  `,
})
export class ContactPage {}
