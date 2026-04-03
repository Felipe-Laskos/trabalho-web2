import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AutocadastroComponent } from './auth/autocadastro/autocadastro.component';
import { HomeClienteComponent } from './cliente/home-cliente/home-cliente.component';
import { HomeFuncionarioComponent } from './funcionario/home-funcionario/home-funcionario.component';
import { CrudCategoriaComponent } from './funcionario/crud-categoria/crud-categoria.component';
import { CrudFuncionariosComponent } from './funcionario/crud-funcionarios/crud-funcionarios.component';
import { EfetuarOrcamentoComponent } from './funcionario/efetuar-orcamento/efetuar-orcamento.component';
import { VisualizarSolicitacoesComponent } from './funcionario/visualizar-solicitacoes/visualizar-solicitacoes.component';
import { MostrarOrcamentoComponent } from './cliente/mostrar-orcamento/mostrar-orcamento.component';
import { SolicitarManutencaoComponent } from './cliente/solicitar-manutencao/solicitar-manutencao.component';
import { EfetuarManutencaoComponent } from './funcionario/efetuar-manutencao/efetuar-manutencao.component';
import { RedirecionarManutencaoComponent } from './funcionario/redirecionar-manutencao/redirecionar-manutencao.component';
import { RelatorioReceitasComponent } from './funcionario/relatorio-receitas/relatorio-receitas.component';
import { PagarServicoComponent } from './cliente/pagar-servico/pagar-servico.component';
import { clienteGuard, funcionarioGuard } from './guards/auth.guard';
import { RelatorioCategoriasComponent } from './funcionario/relatorio-categoria/relatorio-categoria.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'autocadastro', component: AutocadastroComponent },
  { path: 'cliente', component: HomeClienteComponent, canActivate: [clienteGuard] },
  { path: 'cliente/mostrar-orcamento/:id', component: MostrarOrcamentoComponent, canActivate: [clienteGuard] },
  { path: 'cliente/solicitar-manutencao', component: SolicitarManutencaoComponent, canActivate: [clienteGuard] },
  { path: 'cliente/pagar/:id', component: PagarServicoComponent, canActivate: [clienteGuard] },
  { path: 'funcionario', component: HomeFuncionarioComponent, canActivate: [funcionarioGuard] },
  { path: 'funcionario/categorias', component: CrudCategoriaComponent, canActivate: [funcionarioGuard] },
  { path: 'funcionario/funcionarios', component: CrudFuncionariosComponent, canActivate: [funcionarioGuard] },
  { path: 'funcionario/efetuar-orcamento/:id', component: EfetuarOrcamentoComponent, canActivate: [funcionarioGuard] },
  { path: 'funcionario/visualizar-solicitacoes', component: VisualizarSolicitacoesComponent, canActivate: [funcionarioGuard] },
  { path: 'funcionario/efetuar-manutencao/:id', component: EfetuarManutencaoComponent, canActivate: [funcionarioGuard] },
  { path: 'funcionario/redirecionar-manutencao/:id', component: RedirecionarManutencaoComponent, canActivate: [funcionarioGuard] },
  { path: 'funcionario/relatorio-receitas', component: RelatorioReceitasComponent, canActivate: [funcionarioGuard] },
  { path: 'funcionario/relatorio-categoria', component: RelatorioCategoriasComponent, canActivate: [funcionarioGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
