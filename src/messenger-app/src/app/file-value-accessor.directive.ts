import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[input[type=file]]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileValueAccessorDirective,
      multi: true
    }
  ]
})
export class FileValueAccessorDirective implements ControlValueAccessor {
  onChange: Function | null = null;
  private file: File | null = null;

  @HostListener('change', ['$event.target.files']) _handleInput(event: FileList) {
    const file = event && event.item(0);
    if (this.onChange != null) {
      this.onChange(file);
    }
    this.file = file;
  }

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  registerOnChange(f: Function) {
    this.onChange = f;
  }

  registerOnTouched(f: Function) {

  }

  writeValue(value: any) {
    this.renderer.setProperty(this.element.nativeElement, 'value', value ?? '');
  }
}
