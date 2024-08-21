import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appBlurClick]',
  standalone: true
})
export class BlurClickDirective {
  @Output() blurClick = new EventEmitter<void>();

  constructor(private element: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  handleBlur(element: HTMLElement) {
    console.log(this.element.nativeElement.style.display === 'flex')
    console.log(!this.element.nativeElement.contains(element))
    console.log(element.dataset)
    if (this.element.nativeElement.style.display === 'flex' && !this.element.nativeElement.contains(element)
      && element.dataset['triggerButton'] === undefined) {
      this.blurClick.emit();
    }
  }
}
