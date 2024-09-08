import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import {provideHttpClient} from "@angular/common/http";
import {ActivatedRoute, provideRouter, Router} from "@angular/router";
import {RouterTestingHarness} from "@angular/router/testing";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let comp: any;
  let harness: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideHttpClient(), {provide: ActivatedRoute, useValue: 'profile' },
        provideRouter([{path: '**', component: NavbarComponent}])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    harness = await RouterTestingHarness.create();
    comp = await harness.navigateByUrl('/', NavbarComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should give the active class to the activated route when ever', () => {
  //   const linkElement = fixture.nativeElement.querySelector('li[routerLink="profile"]');
  //   linkElement.click();
  //   expect(TestBed.inject(Router).url).toBe("/profile");
  // });
});
