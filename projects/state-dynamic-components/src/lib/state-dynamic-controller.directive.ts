// tslint:disable: directive-selector
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[stateDynamicHost]',
})
export class StateDynamicDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
