import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutHomeComponent } from '../../shared/layout-home/layout-home.component';
import { mockSolicitacao } from '../../mocks/solicitacao.mock';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [
    LayoutHomeComponent,
    CommonModule, 
    RouterLink, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent implements OnInit {
  nomeUsuario: string = 'Cliente';
  solicitacoes = mockSolicitacao;
 idPedidoAnalise: string | number = '00000';

  constructor(private router: Router) {}

  ngOnInit() {
  const nomeSessao = localStorage.getItem('usuarioSessao');
  if (nomeSessao) {
    this.nomeUsuario = nomeSessao;
  }

  if (this.solicitacoes && this.solicitacoes.length > 0) {
    const pendente = this.solicitacoes.find(s => 
      s.estadoAtual === SolicitacaoENUM.ABERTA || 
      s.estadoAtual === SolicitacaoENUM.ORCADA
    );

    if (pendente && pendente.id !== undefined) {
      this.idPedidoAnalise = pendente.id;
    } else {
      const primeiroId = this.solicitacoes[0]?.id;
      if (primeiroId !== undefined) {
        this.idPedidoAnalise = primeiroId;
      }
    }
  }
}

  efetuarLogout() {
    localStorage.removeItem('usuarioSessao');
    this.router.navigate(['/login']);
  }

  abrirAcao(solicitacao: any) {
    if (solicitacao.status === 'ORÇADA') {
      this.router.navigate(['/cliente/mostrar-orcamento', solicitacao.id]);
    } else {
        this.router.navigate(['/cliente/mostrar-orcamento', solicitacao.id]);
    }
  }
}