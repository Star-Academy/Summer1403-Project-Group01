import { BlurClickDirective } from './blur-click.directive';
import {ElementRef} from "@angular/core";

describe('BlurClickDirective', () => {
  it('should create an instance', () => {
    const element = new ElementRef(document.createElement('div'));
    const directive = new BlurClickDirective(element);
    expect(directive).toBeTruthy();
  });
});
