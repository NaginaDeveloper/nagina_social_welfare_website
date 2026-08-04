import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { SpiritualGuide } from './components/spiritual-guide/spiritual-guide';
import { AhleBait } from './components/ahle-bait/ahle-bait';
import { About } from './components/about/about';
import { OurWork } from './components/our-work/our-work';
import { Guidance } from './components/guidance/guidance';
import { Apps } from './components/apps/apps';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, SpiritualGuide, AhleBait, About, OurWork, Guidance, Apps, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
