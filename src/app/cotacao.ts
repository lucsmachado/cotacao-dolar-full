export class Cotacao {
  preco: number;
  data: Date | string;
  hora: String;
  diferenca: number | null = null;
  diferencaTexto: String | null = '';
  precoTexto: String = '';
  dataTexto: string | null = '';

  constructor(preco: number, data: string | Date, hora: String) {
    this.preco = preco;
    this.data = data;
    this.hora = hora;
  }
}
