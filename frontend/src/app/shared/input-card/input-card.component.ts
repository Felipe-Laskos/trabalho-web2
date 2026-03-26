import { Component, Input, HostBinding } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-card.component.html',
  styleUrl: './input-card.component.css'
})
export class InputCardComponent {
  @Input() label: string = '';

  @Input() largura = '100%';
  @Input() altura = 'auto';

  @HostBinding('style.width')
   get hostWidth() {
     return this.largura;
  }

  @HostBinding('style.height')
   get hostHeight() {
     return this.altura;
  }
  
  @HostBinding('style.display') display = 'block';
}