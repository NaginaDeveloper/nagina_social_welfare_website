import { Component } from '@angular/core';
import { HomeClosing } from '../../components/home-closing/home-closing';
import { HomeGlimpse } from '../../components/home-glimpse/home-glimpse';
import { HomeHub } from '../../components/home-hub/home-hub';

@Component({
  selector: 'app-home',
  imports: [HomeHub, HomeGlimpse, HomeClosing],
  templateUrl: './home.html',
})
export class Home {}
