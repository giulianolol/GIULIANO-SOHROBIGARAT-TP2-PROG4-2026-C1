import {
  Directive,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {

  constructor(
    private el: ElementRef,
  ) {}

  @HostListener('mouseenter')
  mouseEnter() {

    this.el.nativeElement.style.boxShadow =
      '0 12px 30px rgba(0,0,0,.25)';

  }

  @HostListener('mouseleave')
  mouseLeave() {

    this.el.nativeElement.style.boxShadow = '';

  }

}