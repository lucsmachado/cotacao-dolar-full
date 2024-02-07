import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Cotacao } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  cotacaoAtual = 0;
  cotacaoPorPeriodoLista: Cotacao[] = [];
  today = new Date().toISOString().split('T')[0];
  startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  requiredError = false;

  constructor(
    private cotacaoDolarService: CotacaoDolarService,
    private dateFormat: DatePipe
  ) { }

  public getCotacaoPorPeriodo(
    dataInicialString: string,
    dataFinalString: string
  ): void {
    this.cotacaoPorPeriodoLista = [];

    const dataInicial =
      this.dateFormat.transform(dataInicialString, 'MM-dd-yyyy') || '';
    const dataFinal =
      this.dateFormat.transform(dataFinalString, 'MM-dd-yyyy') || '';

    if (dataInicial && dataFinal) {
      this.requiredError = false;
      this.cotacaoDolarService
        .getCotacaoPorPeriodoFront(dataInicial, dataFinal)
        .subscribe((cotacoes) => {
          this.cotacaoPorPeriodoLista = cotacoes;
        });
    } else {
      this.requiredError = true;
    }
  }

  ngOnInit() {
    this.cotacaoDolarService.getCotacaoAtual().subscribe((cotacao) => {
      this.cotacaoAtual = cotacao.preco;
    });
  }
}
