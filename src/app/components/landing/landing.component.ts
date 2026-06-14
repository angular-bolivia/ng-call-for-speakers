import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy {
  fullText = "Comparte tu pasión por Angular con la comunidad";
  typedText = signal<string>('');
  private typeInterval: any;

  ngOnInit() {
    let i = 0;
    this.typeInterval = setInterval(() => {
      if (i < this.fullText.length) {
        this.typedText.update(text => text + this.fullText.charAt(i));
        i++;
      } else {
        clearInterval(this.typeInterval);
      }
    }, 50);
  }

  ngOnDestroy() {
    if (this.typeInterval) {
      clearInterval(this.typeInterval);
    }
  }
}
