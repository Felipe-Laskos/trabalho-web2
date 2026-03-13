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
    { id: 100, nome: 'Notebooks', descricao: 'Inclui laptops e ultrabooks.', ativa: true },
    { id: 200, nome: 'Desktop', descricao: 'Inclui torres e all-in-one.', ativa: true },
    { id: 300, nome: 'Impressoras', descricao: 'Inclui impressoras jato de tinta e laser.', ativa: true }
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

