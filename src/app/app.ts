import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { OurWork } from './components/our-work/our-work';
import { Apps } from './components/apps/apps';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, About, OurWork, Apps, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
