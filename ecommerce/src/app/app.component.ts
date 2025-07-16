import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce';

  reloadProductsPage(event: MouseEvent): void {
    event.preventDefault();
    window.location.href = '/products';
  }
}
