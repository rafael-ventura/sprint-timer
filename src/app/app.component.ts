import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  display = '25:00';
  modoEdicao = false;

  tempoTotalEmSegundos = 1500;
  tempoIntervaloEmSegundos = 300;
  tempoRestante = this.tempoTotalEmSegundos;
  intervalo: any;
  sprintAtual = 1;
  totalSprints = 4;

  tempo = {
    min: 25,
    seg: 0,
    intervaloMin: 5,
    intervaloSeg: 0,
    sprints: 4
  };
  modoDigitacao: keyof typeof this.tempo | null = null;

  definirValorManual(valor: string) {
    if (this.modoDigitacao && /^\d+$/.test(valor)) {
      let v = Math.min(Math.max(0, parseInt(valor)), this.modoDigitacao === 'sprints' ? 20 : 59);
      if (this.modoDigitacao === 'sprints' && v === 0) v = 1;
      this.tempo[this.modoDigitacao] = v;
    }
    this.modoDigitacao = null;
  }

  start() {
    if (this.intervalo) return;
    this.intervalo = setInterval(() => {
      if (this.tempoRestante > 0) {
        this.tempoRestante--;
        this.atualizarDisplay();
      } else {
        clearInterval(this.intervalo);
        this.intervalo = null;
        this.proximaSprint();
      }
    }, 1000);
  }

  pause() {
    clearInterval(this.intervalo);
    this.intervalo = null;
  }

  edit() {
    this.modoEdicao = true;
  }

  ajustar(campo: keyof typeof this.tempo, delta: number) {
    this.tempo[campo] += delta;

    // Validar campos
    if (['min', 'seg', 'intervaloMin', 'intervaloSeg'].includes(campo)) {
      if (this.tempo[campo] < 0) this.tempo[campo] = 0;
      if (this.tempo[campo] > 59) this.tempo[campo] = 59;
    }

    if (campo === 'sprints') {
      if (this.tempo[campo] < 1) this.tempo[campo] = 1;
      if (this.tempo[campo] > 20) this.tempo[campo] = 20;
    }
  }

  salvarTudo() {
    const tempoMin = this.tempo.min;
    const tempoSeg = this.tempo.seg;
    const intervaloMin = this.tempo.intervaloMin;
    const intervaloSeg = this.tempo.intervaloSeg;
    const totalSprints = this.tempo.sprints;

    const tempo = tempoMin * 60 + tempoSeg;
    const intervalo = intervaloMin * 60 + intervaloSeg;

    if (tempo < 1 || tempo > 3599) {
      return alert('Tempo de sprint deve estar entre 1 segundo e 59:59');
    }

    this.tempoTotalEmSegundos = tempo;
    this.tempoIntervaloEmSegundos = intervalo;
    this.totalSprints = totalSprints;
    this.tempoRestante = tempo;
    this.atualizarDisplay();
    this.sprintAtual = 1;
    this.modoEdicao = false;
  }

  atualizarDisplay() {
    const minutos = Math.floor(this.tempoRestante / 60);
    const segundos = this.tempoRestante % 60;
    this.display = `${this.pad(minutos)}:${this.pad(segundos)}`;
  }

  proximaSprint() {
    if (this.sprintAtual < this.totalSprints) {
      this.sprintAtual++;
      this.tempoRestante = this.tempoTotalEmSegundos;
      this.atualizarDisplay();
      this.start();
    } else {
      this.display = 'Done!';
    }
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : String(num);
  }
}
