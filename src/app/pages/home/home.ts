import { Component } from '@angular/core';
import { About } from '../../components/about/about';
import { Apps } from '../../components/apps/apps';
import { Contact } from '../../components/contact/contact';
import { Guidance } from '../../components/guidance/guidance';
import { Hero } from '../../components/hero/hero';
import { HomeSpotlight } from '../../components/home-spotlight/home-spotlight';
import { OurWork } from '../../components/our-work/our-work';
import { SeedhaRastahSpotlight } from '../../components/seedha-rastah-spotlight/seedha-rastah-spotlight';
import { SpiritualGuide } from '../../components/spiritual-guide/spiritual-guide';

@Component({
  selector: 'app-home',
  imports: [
    Hero,
    HomeSpotlight,
    SpiritualGuide,
    SeedhaRastahSpotlight,
    About,
    OurWork,
    Guidance,
    Apps,
    Contact,
  ],
  templateUrl: './home.html',
})
export class Home {}
