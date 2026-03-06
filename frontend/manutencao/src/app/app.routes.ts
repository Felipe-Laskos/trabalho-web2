import { Routes } from '@angular/router';
import { MostrarOrcamentoComponent } from './pages/mostrar-orcamento/mostrar-orcamento.component';
import { PagarServicoComponent } from './pages/pagar-servico/pagar-servico.component';
import { RejeitarServicoComponent } from './pages/rejeitar-servico/rejeitar-servico.component';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';

export const routes: Routes = [
  { path: 'orcamento', component: MostrarOrcamentoComponent },
  { path: 'pagar', component: PagarServicoComponent },
  { path: 'rejeitar', component: RejeitarServicoComponent },
  { path: 'visualizar', component: VisualizarServicoComponent }
];

