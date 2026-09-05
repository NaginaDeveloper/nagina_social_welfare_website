import { Component } from '@angular/core';
import { About } from '../../components/about/about';
import { Contact } from '../../components/contact/contact';
import { HomeHub } from '../../components/home-hub/home-hub';

@Component({
  selector: 'app-home',
  imports: [HomeHub, About, Contact],
  templateUrl: './home.html',
})
export class Home {}
