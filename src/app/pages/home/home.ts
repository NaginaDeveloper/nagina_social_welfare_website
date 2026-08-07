import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hero } from '../../components/hero/hero';
import { SpiritualGuide } from '../../components/spiritual-guide/spiritual-guide';
import { AhleBait } from '../../components/ahle-bait/ahle-bait';
import { About } from '../../components/about/about';
import { OurWork } from '../../components/our-work/our-work';
import { Guidance } from '../../components/guidance/guidance';
import { Gallery } from '../../components/gallery/gallery';
import { Donations } from '../../components/donations/donations';
import { Apps } from '../../components/apps/apps';
import { Contact } from '../../components/contact/contact';
import { Privacy } from '../../components/privacy/privacy';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    Hero,
    SpiritualGuide,
    AhleBait,
    About,
    OurWork,
    Guidance,
    Gallery,
    Donations,
    Apps,
    Contact,
    Privacy,
  ],
  templateUrl: './home.html',
})
export class Home {}
