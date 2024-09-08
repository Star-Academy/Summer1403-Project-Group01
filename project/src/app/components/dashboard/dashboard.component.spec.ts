import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import {NavbarComponent} from "./navbar/navbar.component";
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {NgClass} from "@angular/common";
import {BgGifComponent} from "../bg-gif/bg-gif.component";
import {heroArrowUturnRight, heroBars3} from "@ng-icons/heroicons/outline";
import {forwardRef} from "@angular/core";
import {provideHttpClient} from "@angular/common/http";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        forwardRef(() => NavbarComponent),
        RouterOutlet,
        NgIconComponent,
        NgClass,
        BgGifComponent
      ],
      providers: [provideIcons({heroBars3, heroArrowUturnRight}), provideHttpClient(), {provide: ActivatedRoute, useValue: 'dashboard/profile' }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
