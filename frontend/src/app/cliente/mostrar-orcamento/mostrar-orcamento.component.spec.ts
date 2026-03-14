import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarOrcamento } from './mostrar-orcamento.component';

describe('MostrarOrcamento', () => {
  let component: MostrarOrcamento;
  let fixture: ComponentFixture<MostrarOrcamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarOrcamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarOrcamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
