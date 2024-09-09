import {Component} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import { heroBars3, heroArrowUturnRight } from '@ng-icons/heroicons/outline'
import {NgClass} from "@angular/common";
import { BgGifComponent } from "../bg-gif/bg-gif.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    NgIconComponent,
    NgClass,
    BgGifComponent
],
  providers: [provideIcons({heroBars3, heroArrowUturnRight})],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}
