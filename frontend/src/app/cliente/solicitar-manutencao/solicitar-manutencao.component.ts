import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ModalGenericoComponent } from '../../shared/modal-generico/modal-generico.component';
import { ComboComponent, OpcaoCombo } from '../../shared/combo/combo.component';
import { InputComponent } from '../../shared/input/input.component';
import { TextAreaComponent } from '../../shared/text-area/text-area.component';
import { BotaoAprovarComponent } from '../../shared/botao-aprovar/botao-aprovar.component';
import { BotaoCancelarComponent } from '../../shared/botao-cancelar/botao-cancelar.component';
import { CardVisualizacaoComponent } from "../../shared/card-visualizacao/card-visualizacao.component";
import { Solicitacao } from '../../core/models/solicitacao.model';
import { SolicitacaoENUM } from '../../core/models/solicitacaoENUM.model';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { HistoricoService } from '../../core/services/historico.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ClienteService } from '../../core/services/cliente.service';
import { AuthService } from '../../core/services/auth.service';

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
  private dialog = inject(MatDialog);

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
    const faltando: string[] = [];
    if (!this.solicitacao.categoriaId) faltando.push('Categoria do Equipamento');
    if (!this.solicitacao.modelo) faltando.push('Descrição do Equipamento');
    if (!this.solicitacao.descricaoDefeito) faltando.push('Descrição do Defeito');

    if (faltando.length > 0) {
      this.dialog.open(ModalGenericoComponent, {
        data: {
          tipo: 'confirmacao',
          titulo: 'Campos obrigatórios',
          mensagem: 'Preencha os seguintes campos:<br><br>• ' + faltando.join('<br>• '),
          textoConfirmar: 'OK'
        }
      });
      return;
    }

    const emailLogado = this.authService.getEmail();
    const clienteLogado = this.clienteService.buscarPorEmail(emailLogado);
    const categoriaSelecionada = this.categoriaService.buscarPorId(Number(this.solicitacao.categoriaId));
    
    if (!categoriaSelecionada) {
      this.aviso.open('Categoria inválida.', 'OK', { duration: 3000 });
      return;
    }

    const novaSolicitacao: Solicitacao = {
      descricaoEquipamento: this.solicitacao.modelo,
      descricaoDefeito: this.solicitacao.descricaoDefeito,
      estadoAtual: SolicitacaoENUM.ABERTA,
      dataHoraCriacao: new Date().toISOString(),
      ativo: true,
      cliente: clienteLogado,
      categoriaEquipamento: categoriaSelecionada,
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

  confirmarCancelamento(): void {
    const dialogRef = this.dialog.open(ModalGenericoComponent, {
      data: {
        tipo: 'confirmacao',
        titulo: 'Confirmar Cancelamento',
        mensagem: 'Deseja realmente cancelar? Dados não salvos serão perdidos.',
        textoConfirmar: 'Sim, cancelar',
        textoCancelar: 'Não'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.router.navigate(['/cliente']);
    });
  }
}
