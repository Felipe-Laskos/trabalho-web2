import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ComboComponent, OpcaoCombo } from '../../shared/combo/combo.component';
import { InputComponent } from '../../shared/input/input.component';
import { TextAreaComponent } from '../../shared/text-area/text-area.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { CardVisualizacaoComponent } from "../../shared/card-visualizacao/card-visualizacao.component";
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoENUM } from '../../models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoService } from '../../services/historico.service';
import { CategoriaService } from '../../services/categoria.service';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatSnackBarModule,
    MatCardModule,
    ComboComponent,
    InputComponent,
    TextAreaComponent,
    BotaoAprovarComponent,
    BotaoCancelarComponent,
    CardVisualizacaoComponent
  ],
  templateUrl: './solicitar-manutencao.component.html',
  styleUrls: ['./solicitar-manutencao.component.css']
})
export class SolicitarManutencaoComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private historicoService = inject(HistoricoService);
  private categoriaService = inject(CategoriaService);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);

  categoriasLista: OpcaoCombo[] = [];

  solicitacao: any = {
    categoriaId: '',
    modelo: '',
    descricaoDefeito: ''
  };

  enviou: boolean = false;

  constructor(public router: Router, private aviso: MatSnackBar) {}

  ngOnInit(): void {
    this.categoriasLista = this.categoriaService.listarAtivas().map(c => ({
      value: c.id!,
      viewValue: c.nome
    }));
  }

  solicitarManutencao(): void {
    this.enviou = true;

    if (!this.solicitacao.categoriaId || !this.solicitacao.modelo || !this.solicitacao.descricaoDefeito) {
      this.aviso.open('Por favor, preencha todos os campos obrigatórios.', 'OK', { duration: 3000 });
      return;
    }

    const emailLogado = this.authService.getEmail();
    const clienteLogado = this.clienteService.buscarPorEmail(emailLogado);
    const categoriaSelecionada = this.categoriaService.buscarPorId(Number(this.solicitacao.categoriaId));

    const novaSolicitacao: Solicitacao = {
      descricaoEquipamento: this.solicitacao.modelo,
      descricaoDefeito: this.solicitacao.descricaoDefeito,
      estadoAtual: SolicitacaoENUM.ABERTA,
      dataHoraCriacao: new Date().toISOString(),
      ativo: true,
      cliente: clienteLogado,
      categoria: categoriaSelecionada,
      historico: []
    };

    this.solicitacaoService.inserir(novaSolicitacao);

    this.historicoService.inserir({
      dataHora: new Date().toISOString(),
      estadoNovo: SolicitacaoENUM.ABERTA,
      solicitacaoId: novaSolicitacao.id!,
      observacao: 'Solicitação criada pelo cliente.'
    });

    this.aviso.open('Solicitação enviada com sucesso!', 'OK', { duration: 4000, verticalPosition: 'top' });
    this.router.navigate(['/cliente']);
  }
}
