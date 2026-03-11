import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaEquipamento } from '../../models/interfaces';

@Component({
  selector: 'app-crud-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crud-categoria.component.html',
  styleUrl: './crud-categoria.component.css'
})
export class CrudCategoriaComponent {
  categorias: CategoriaEquipamento[] = [
    { id: 100, nome: 'Laptop', quantidade: 50, ativa: true },
    { id: 101, nome: 'Ultrabook', quantidade: 45, ativa: true },
    { id: 200, nome: 'Desktop torre', quantidade: 30, ativa: true },
    { id: 201, nome: 'All-in-One', quantidade: 20, ativa: false },
    { id: 300, nome: 'Impressora jato de tinta', quantidade: 20, ativa: true },
    { id: 301, nome: 'Impressora laser', quantidade: 25, ativa: true },
    { id: 400, nome: 'Monitor LED', quantidade: 80, ativa: false },
    { id: 401, nome: 'Mouse sem fio', quantidade: 150, ativa: true },
    { id: 500, nome: 'Teclado mecânico', quantidade: 50, ativa: true },

  ];

  get categoriasAtivas() {
    return this.categorias.filter(c => c.ativa == true);
  }

  mensagemExclusao() {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      alert('Categoria excluída com sucesso!');
    } else {
      alert('Exclusão cancelada.');
    }
  }
}

