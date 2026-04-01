import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { CpfPipe } from '../pipes/cpf.pipe';
import { NomePipe } from '../pipes/nome.pipe';

export interface ColunaTabela {
  campo: string;
  titulo: string;
  tipo?: 'texto' | 'data' | 'estado' | 'acao' | 'cpf' | 'nome';
  truncar?: number;
}

export interface AcaoTabela {
  nome: string;
  acao: string;
  estados?: string[];
  cor?: 'primary' | 'warn' | 'accent';
}

export interface EventoAcao {
  acao: string;
  item: any;
}

@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, TruncatePipe, CpfPipe, NomePipe],
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.css'
})
export class TabelaComponent {
  @Input() colunas: ColunaTabela[] = [];
  @Input() dados: any[] = [];
  @Input() acoes: AcaoTabela[] = [];
  @Input() campoEstado: string = 'estadoAtual';

  @Output() acaoClicada = new EventEmitter<EventoAcao>();

  @Output() linhaSelecionada = new EventEmitter<any>();

  linhaAtiva: any = null;

  selecionarLinha(item: any) {
    this.linhaAtiva = item;
    this.linhaSelecionada.emit(item);
  }

  deselecionarLinha(item: any) {
  if (this.linhaAtiva === item) {
    this.linhaAtiva = null;
    this.linhaSelecionada.emit(null); 
  }
}

  coresEstado: Record<string, string> = {
    'ABERTA': '#808080',
    'ORCADA': '#8B4513',
    'REJEITADA': '#DC3545',
    'APROVADA': '#FFC107',
    'REDIRECIONADA': '#6F42C1',
    'ARRUMADA': '#0D6EFD',
    'PAGA': '#FD7E14',
    'FINALIZADA': '#198754'
  };

  get camposExibidos(): string[] {
    return this.colunas.map(c => c.campo);
  }

  getValor(item: any, campo: string): any {
    return campo.split('.').reduce((obj, key) => obj?.[key], item);
  }

  getAcoesDoItem(item: any): AcaoTabela[] {
    return this.acoes.filter(a =>
      !a.estados || a.estados.length === 0 || a.estados.includes(item[this.campoEstado])
    );
  }

  onAcao(acao: string, item: any): void {
    this.acaoClicada.emit({ acao, item });
  }
}
