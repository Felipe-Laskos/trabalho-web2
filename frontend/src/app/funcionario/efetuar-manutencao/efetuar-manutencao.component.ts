import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardVisualizacaoComponent } from '../../shared/card-visualizacao/card-visualizacao.component';
import { BotaoComponent } from '../../shared/botao/botao.component';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, CardVisualizacaoComponent, BotaoComponent],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrls: ['./efetuar-manutencao.component.css']
})
export class EfetuarManutencaoComponent {

  solicitacao = {
    id: 1,
    status: 'APROVADA',
    dataAbertura: '29/03/2026',
    cliente: {
      nome: 'João Silva',
      email: 'joao@email.com'
    }
  };

  mostrarFormulario = false;

  form = new FormGroup({
    descricao: new FormControl(''),
    orientacoes: new FormControl('')
  });

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  confirmarManutencao() {
    const dados = this.form.value;

    if (!dados.descricao || !dados.orientacoes) {
      alert('Preencha todos os campos!');
      return;
    }

    this.solicitacao.status = 'ARRUMADA';

    alert('Manutenção realizada com sucesso!');
  }

  redirecionar() {
    alert('Redirecionando...'); // redirecionar quando a tela estiver pronta
  }
}