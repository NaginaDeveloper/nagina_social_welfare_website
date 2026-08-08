import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hero } from '../../components/hero/hero';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Hero],
  templateUrl: './home.html',
})
export class Home {}
