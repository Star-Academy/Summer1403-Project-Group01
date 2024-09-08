import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDataComponent } from './show-data.component';
import {provideHttpClient} from "@angular/common/http";

describe('ShowDataComponent', () => {
  let component: ShowDataComponent;
  let fixture: ComponentFixture<ShowDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDataComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
