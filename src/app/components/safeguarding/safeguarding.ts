import { Component } from '@angular/core';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';

interface SafeguardingBlock {
  readonly title: string;
  readonly body: string;
}

@Component({
  selector: 'app-safeguarding',
  templateUrl: './safeguarding.html',
})
export class Safeguarding {
  protected readonly org = ORGANIZATION;
  protected readonly policyWhatsApp = whatsappHref(
    'Assalamu alaikum, please send me the full safeguarding policy for Markaz Deen-e-Islam / Nagina Social Welfare.',
  );
  protected readonly concernWhatsApp = whatsappHref(
    'Assalamu alaikum, I need to raise a safeguarding concern.',
  );

  protected readonly blocks: readonly SafeguardingBlock[] = [
    {
      title: 'Our duty',
      body:
        'Markaz Deen-e-Islam teaches children. Everyone who visits, teaches, or volunteers with us must help keep children and adults at risk safe from harm, abuse, and neglect.',
    },
    {
      title: 'How we work',
      body:
        'Nagina Social Welfare UK is a registered charity. We keep a full safeguarding policy, which trustees review. This page is a public summary, not the complete policy.',
    },
    {
      title: 'If you are worried',
      body:
        'If a child or adult may be at risk, contact us immediately by WhatsApp or email. In an emergency, call 999. You can also contact the Peterborough City Council children’s services team or the NSPCC (0808 800 5000).',
    },
    {
      title: 'Full policy',
      body:
        'Parents, staff, and volunteers may request the full safeguarding policy. We will share it on request by WhatsApp or email.',
    },
  ];
}
