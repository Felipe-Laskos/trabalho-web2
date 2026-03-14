import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AutocadastroComponent } from './auth/autocadastro/autocadastro.component';
import { HomeClienteComponent } from './cliente/home-cliente/home-cliente.component';
import { HomeFuncionarioComponent } from './funcionario/home-funcionario/home-funcionario.component';
import { CrudCategoriaComponent } from './funcionario/crud-categoria/crud-categoria.component';
import { MostrarOrcamentoComponent } from './cliente/mostrar-orcamento/mostrar-orcamento.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'autocadastro', component: AutocadastroComponent },
  { path: 'cliente', component: HomeClienteComponent },
  { path: 'cliente/mostrar-orcamento', component: MostrarOrcamentoComponent},
  { path: 'funcionario', component: HomeFuncionarioComponent },
  { path: 'funcionario/categorias', component: CrudCategoriaComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
