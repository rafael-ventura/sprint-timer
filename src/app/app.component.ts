import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    NgIf,
    NgOptimizedImage
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

  salvarConfiguracoes(min: string, seg: string, intervaloMin: string, intervaloSeg: string, total: string) {
    const tempoMin = parseInt(min, 10) || 0;
    const tempoSeg = parseInt(seg, 10) || 0;
    const intervaloMinutos = parseInt(intervaloMin, 10) || 0;
    const intervaloSegundos = parseInt(intervaloSeg, 10) || 0;
    const totalSprints = parseInt(total, 10) || 1;

    const tempo = tempoMin * 60 + tempoSeg;
    const intervalo = intervaloMinutos * 60 + intervaloSegundos;

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
