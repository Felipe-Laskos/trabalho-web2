import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaEquipamento } from '../../models/categoria.model';

@Component({
  selector: 'app-crud-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crud-categoria.component.html',
  styleUrl: './crud-categoria.component.css'
})
export class CrudCategoriaComponent {
  categorias: CategoriaEquipamento[] = [
    { id: 100, nome: 'Laptop', quantidade: 10, ativa: true },
    { id: 101, nome: 'Ultrabook', quantidade: 5, ativa: true },
    { id: 200, nome: 'Desktop torre', quantidade: 12, ativa: true },
    { id: 201, nome: 'All-in-One', quantidade: 2, ativa: true },
    { id: 300, nome: 'Impressora jato de tinta', quantidade: 5, ativa: true },
    { id: 301, nome: 'Impressora laser', quantidade: 8, ativa: true },
    { id: 400, nome: 'Monitor LED', quantidade: 2, ativa: true },
    { id: 401, nome: 'Mouse sem fio', quantidade: 0, ativa: false },
    { id: 500, nome: 'Teclado mecânico', quantidade: 0, ativa: false },

  ];

  get categoriasAtivas() {
    return this.categorias.filter(c => c.ativa == true);
  }

categoria: CategoriaEquipamento | undefined;

  mensagemExclusao() {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      alert('Categoria excluída com sucesso!');
    } else {
      alert('Exclusão cancelada.');
    }
  }
}


