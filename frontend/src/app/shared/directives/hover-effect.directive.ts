import {
  Directive,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appHoverEffect]',
  standalone: true,
})
export class HoverEffectDirective {

  constructor(
    private el: ElementRef,
  ) {}

  @HostListener('mouseenter')
  onEnter() {

    this.el.nativeElement.style.transform =
      'scale(1.05)';

    this.el.nativeElement.style.transition =
      '0.2s';

  }

  @HostListener('mouseleave')
  onLeave() {

    this.el.nativeElement.style.transform =
      'scale(1)';

  }

}