import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardhomeComponent } from './dashboardhome.component';
import {By} from "@angular/platform-browser";

describe('DashboardhomeComponent', () => {
  let component: DashboardhomeComponent;
  let fixture: ComponentFixture<DashboardhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardhomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the text "به کد استار خوش امدید" and an SVG element when ever', () => {
    const pElement = fixture.nativeElement.querySelector('p');
    expect(pElement).withContext("p element must exists.").toBeTruthy();
    expect(pElement.textContent).withContext("must have the value 'به کد استار خوش امدید'").toBe('به کد استار خوش امدید');

    const svgElement = fixture.nativeElement.querySelector('svg');
    expect(svgElement).withContext("SVG must exists and contain the image").not.toBeNull();
  });
});
