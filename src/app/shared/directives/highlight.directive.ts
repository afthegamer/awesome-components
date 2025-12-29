import { computed, Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[highlight]',
  standalone: true,
  host: {
    '[style.backgroundColor]': 'backgroundColor()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(click)': 'onClick()',
  },
})
export class HighlightDirective {
  // Inputs modernes (signal inputs)
  readonly color = input('yellow');
  readonly hoverColor = input('lightgreen');

  // État interne (signaux)
  private readonly hovered = signal(false);
  private readonly locked = signal(false);

  // Style dérivé (computed)
  protected readonly backgroundColor = computed(() => {
    if (this.locked()) return this.hoverColor();
    return this.hovered() ? this.hoverColor() : this.color();
  });

  onMouseEnter(): void {
    this.hovered.set(true);
  }

  onMouseLeave(): void {
    this.hovered.set(false);
  }

  onClick(): void {
    this.locked.set(true);
  }
}
