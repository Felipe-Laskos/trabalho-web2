import { Component } from '@angular/core';
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

export class SolicitarManutencaoComponent {
  categoriasLista: OpcaoCombo[] = [
    { value: 'notebook', viewValue: 'Notebook' },
    { value: 'desktop', viewValue: 'Desktop' },
    { value: 'monitor', viewValue: 'Monitor' },
    { value: 'outros', viewValue: 'Outros' }
  ];

  solicitacao: any = {
    categoria: '',
    modelo: '',
    descricaoDefeito: ''
  };

  enviou: boolean = false;
  constructor(public router: Router, private aviso: MatSnackBar) {}

  solicitarManutencao() {
    this.enviou = true;

    if (!this.solicitacao.categoria || !this.solicitacao.modelo || !this.solicitacao.descricaoDefeito) {
      this.aviso.open('Por favor, preencha todos os campos obrigatórios.', 'OK', { duration: 3000 });
      return;
    }
    console.log('Dados Enviados:', this.solicitacao);
    this.aviso.open('Solicitação enviada com sucesso!', 'Sucesso', { duration: 4000 });
    this.router.navigate(['/cliente']);
  }
}