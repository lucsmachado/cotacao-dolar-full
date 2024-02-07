import { CurrencyPipe, DatePipe } from '@angular/common';
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
  menorAtualChecked = false;

  constructor(
    private cotacaoDolarService: CotacaoDolarService,
    private dateFormat: DatePipe,
    private currencyFormat: CurrencyPipe
  ) { }

  private formatCotacoes(cotacoes: Cotacao[]): Cotacao[] {
    return cotacoes.reduce<Cotacao[]>((acc, cotacao) => {
      const diferenca = cotacao.preco - this.cotacaoAtual;
      return acc.concat({
        ...cotacao,
        diferenca,
        diferencaTexto: `${diferenca > 0 ? '+' : ''}${diferenca.toFixed(2)}`,
        dataTexto: this.dateFormat.transform(cotacao.data, 'dd/MM/yyyy') || '',
        precoTexto: this.currencyFormat.transform(cotacao.preco, 'BRL') || '',
      });
    }, []);
  }

  public getCotacaoPorPeriodo(
    dataInicialString: string,
    dataFinalString: string
  ): void {
    console.log(this.menorAtualChecked);
    this.cotacaoPorPeriodoLista = [];

    const dataInicial =
      this.dateFormat.transform(dataInicialString, 'MM-dd-yyyy') || '';
    const dataFinal =
      this.dateFormat.transform(dataFinalString, 'MM-dd-yyyy') || '';

    if (dataInicial && dataFinal) {
      this.requiredError = false;
      if (this.menorAtualChecked) {
        this.cotacaoDolarService
          .getCotacoesMenoresAtual(dataInicial, dataFinal)
          .subscribe((cotacoes) => {
            this.cotacaoPorPeriodoLista = this.formatCotacoes(cotacoes);
          });
      } else {
        this.cotacaoDolarService
          .getCotacaoPorPeriodoFront(dataInicial, dataFinal)
          .subscribe((cotacoes) => {
            this.cotacaoPorPeriodoLista = this.formatCotacoes(cotacoes);
          });
      }
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
