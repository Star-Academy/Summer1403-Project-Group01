import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { render, screen } from '@testing-library/angular';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'کد استار' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('کد استار');
  });

  it('Should render a main tag when ever', async () => {
    await render(AppComponent);
    const mainTag = screen.getByRole('main');
    expect(mainTag).toBeTruthy();
  })
});
