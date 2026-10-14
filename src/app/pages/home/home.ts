import { Component } from '@angular/core';
import { HomeClosing } from '../../components/home-closing/home-closing';
import { HomeGlimpse } from '../../components/home-glimpse/home-glimpse';
import { HomeGuides } from '../../components/home-guides/home-guides';
import { HomeHub } from '../../components/home-hub/home-hub';

@Component({
  selector: 'app-home',
  imports: [HomeHub, HomeGlimpse, HomeGuides, HomeClosing],
  templateUrl: './home.html',
})
export class Home {}
