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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'autocadastro', component: AutocadastroComponent },
  { path: 'cliente', component: HomeClienteComponent },
  { path: 'cliente/mostrar-orcamento/:id', component: MostrarOrcamentoComponent},
  { path: 'funcionario', component: HomeFuncionarioComponent },
  { path: 'funcionario/categorias', component: CrudCategoriaComponent },
  { path: 'funcionario/funcionarios', component: CrudFuncionariosComponent },
  { path: 'funcionario/efetuar-orcamento/:id', component: EfetuarOrcamentoComponent },
  { path: 'funcionario/visualizar-solicitacoes', component: VisualizarSolicitacoesComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
