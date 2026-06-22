import { Component, signal, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  fullText = "Comparte tu pasión por Angular con la comunidad";
  typedText = signal<string>('');
  private typeInterval: any;
  private observer: IntersectionObserver | null = null;

  constructor(private elementRef: ElementRef) {}

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

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Add a small delay for staggered effect or smooth render
            requestAnimationFrame(() => {
              entry.target.classList.add('is-visible');
            });
            this.observer?.unobserve(entry.target);
          }
        }
      }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

      setTimeout(() => {
        const elements = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal, .scroll-reveal-left');
        elements.forEach((el: Element) => this.observer?.observe(el));
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.typeInterval) {
      clearInterval(this.typeInterval);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
