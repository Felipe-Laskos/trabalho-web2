import { Component } from '@angular/core';
import { Funcionario } from '../../models/funcionario.model';

@Component({
  selector: 'app-crud-funcionarios',
  standalone: true,
  imports: [],
  templateUrl: './crud-funcionarios.component.html',
  styleUrl: './crud-funcionarios.component.css'
})
export class CrudFuncionariosComponent {
funcionario: Funcionario[] = [
    { id: 1, nome: 'Maria Silva Pereira', email: 'maria@empresa.com', dataNascimento: '1998-11-12' },
    { id: 2, nome: 'Mário da Rocha Bastos', email: 'mario@empresa.com', dataNascimento: '1980-05-20'}
  ];

  get funcionarios() {
    return this.funcionario;
  }
  
  mensagemExclusao() {
    if (confirm('Tem certeza que deseja excluir esse funcionário?')) {
      alert('Funcionário excluído com sucesso');
    } else {
      alert('Exclusão cancelada');
    }
  }
}
