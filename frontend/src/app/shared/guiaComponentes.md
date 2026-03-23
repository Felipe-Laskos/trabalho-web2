# 📘 Guia de Componentes 

Este guia contém a documentação técnica para implementação dos componentes customizados do projeto.

---

### 1. Componente: Combo (Dropdown)
**Onde importar no .ts:** `import { ComboComponent, OpcaoCombo } from './shared/combo/combo.component';`

**Exemplo de configuração no .ts:**
```typescript
minhaLista: OpcaoCombo[] = [
  { value: 'rep', viewValue: 'Reparo' },
  { value: 'inst', viewValue: 'Instalação' }
];

aoMudarValor(valor: string | number) {
  console.log('Valor selecionado:', valor);
}
```
**Como usar no arquivo html**
```html
<app-combo 
  titulo="Tipo de Manutenção"
  label="Escolha uma opção"
  [lista]="minhaLista"
  (mudou)="aoMudarValor($event)">
</app-combo>
```

### 2. Componente: Input
**Onde importar no .ts:** `import { InputComponent } from './shared/input/input.component';`

**Exemplo de configuração no .ts: Criar variável**
```typescript
valorDigitado: string = 'Sushi';
```

**Como usar no arquivo html**
```html
<app-input 
  titulo="Comida Favorita"
  placeholder="Digite aqui..."
  [valor]="valorDigitado"
  (mudou)="valorDigitado = $event">
</app-input>
```

### 3. Componente: Input-card
**Onde importar no .ts:** 
`import { InputCardComponent } from './shared/input-card/input-card.component';`
`import { FormsModule } from '@angular/forms';`

**Exemplo de configuração no .ts: Exemplo:**
```typescript
nomeCliente: string = '';
telCliente: string = '';
descricao: string = '';
```

**Como usar no arquivo html**

* Dados do cliente
```html
<app-input-card label="Dados do Cliente">
  <input type="text" [(ngModel)]="nomeCliente" placeholder="Nome" />
  <input type="text" [(ngModel)]="telCliente" placeholder="Telefone" />
</app-input-card> 
```

* Descrição
```html
<app-input-card label="Descrição">
  <textarea [(ngModel)]="descricao" placeholder="Digite uma descrição..."></textarea>
</app-input-card>
```
### Você deve estilizar o input interno no seu css!
* Exemplo:
```css
/* Estiliza o input dentro do card */
app-input-card input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; 
}

/* Estiliza a textarea dentro do card */
app-input-card textarea {
  width: 100%;
  min-height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical; 
}
```

### 4. Componente: Botão Aprovar
**Onde importar no .ts:** 
`import { BotaoAprovarComponent } from './shared/botao-aprovar/botao-aprovar.component';`

**Exemplo de configuração no .ts: Exemplo: Criar a função**
```typescript
aprovar() {
  console.log('Aprovado!');
}
```

**Como usar no arquivo html**
```html
<app-botao-aprovar (clicou)="aprovar()">
  Aprovar Solicitação
</app-botao-aprovar>
```

### 5. Componente: Botão Cancelar
**Onde importar no .ts:** 
`import { BotaoCancelarComponent } from './shared/botao-cancelar/botao-cancelar.component';`

**Exemplo de configuração no .ts: Exemplo: Criar a função**
```typescript
cancelar() {
  console.log('Cancelado!');
}
```

**Como usar no arquivo html**
```html
<app-botao-cancelar 
  [confirmacao]="true"
  (clicou)="cancelar()">
  Cancelar Solicitação
</app-botao-cancelar>
```

### 6. Componente: Text-area
**Onde importar no .ts:** 
`import { TextAreaComponent } from './shared/text-area/text-area.component';`

**Exemplo de configuração no .ts: Exemplo: Criar a variável**
```typescript
observacao: string = '';
```

**Como usar no arquivo html**
```html
<app-text-area
  titulo="Observações"
  placeholder="Digite algo..."
  [valor]="observacao"
  (mudou)="observacao = $event">
</app-text-area>
```

### 7. Componente: Card-visualizacao
**Onde importar no .ts:** 
`import { CardVisualizacaoComponent } from './shared/card-visualizacao/card-visualizacao.component';`

**Como usar no arquivo html**
```html
<app-card-visualizacao>
  CONTÉUDO DO SEU HTML
</app-card-visualizacao>
```

## Componentes
<img src="../../assets/imgs/image-1.png" width="400">


## Dicas Gerais
* ✅ Sempre importar o componente antes de usar
* ✅ Criar variáveis no .ts quando necessário
* ✅ Usar (evento)="funcao()" para capturar ações
* ✅ Usar [propriedade]="variavel" para enviar dados