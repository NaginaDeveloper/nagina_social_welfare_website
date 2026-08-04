import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { SpiritualGuide } from './components/spiritual-guide/spiritual-guide';
import { OurWork } from './components/our-work/our-work';
import { Guidance } from './components/guidance/guidance';
import { Apps } from './components/apps/apps';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, About, SpiritualGuide, OurWork, Guidance, Apps, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
