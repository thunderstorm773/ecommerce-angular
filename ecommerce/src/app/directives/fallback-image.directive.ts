import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appFallbackImage]',
  standalone: false
})
export class FallbackImageDirective {

  @Input() fallbackImage: string = 'images/placeholder.png';

  constructor() { }

  @HostListener('error', ['$event.target'])
  onError(img: HTMLImageElement) {
    if (img.src !== this.fallbackImage) {
      img.src = this.fallbackImage;
    }
  }
}
