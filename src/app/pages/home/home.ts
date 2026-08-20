import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hero } from '../../components/hero/hero';
import { HomeSpotlight } from '../../components/home-spotlight/home-spotlight';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Hero, HomeSpotlight],
  templateUrl: './home.html',
})
export class Home {}
