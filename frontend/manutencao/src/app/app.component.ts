import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // ⚡ IMPORTANTE

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule],  // ⚡ ADICIONE CommonModule
  template: `
    <h1>Equipamentos</h1>
    <ul>
      <li *ngFor="let eq of equipamentos">{{ eq }}</li>
    </ul>
  `
})
export class AppComponent {
  equipamentos: string[] = [];

  constructor(private http: HttpClient) {
    this.http.get<string[]>('http://localhost:8080/equipamentos')
      .subscribe(data => this.equipamentos = data,
                  error => console.error('Erro ao carregar equipamentos:', error)
      );
  }
}
