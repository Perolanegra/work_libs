import { BehaviorSubject } from 'rxjs';
import {
  Compiler,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  NgModuleFactory,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
} from '@angular/core';
import { LazyComponentRefModel, LazyImport, Ref } from './state-dynamic-components.model';
import { StateDynamicComponentsService } from './state-dynamic-components.service';
import { StateDynamicDirective } from './state-dynamic-controller.directive';

@Component({
  selector: 'pedm-state-host',
  template: `<ng-template stateDynamicHost></ng-template>`,
})
export class StateDynamicComponent implements OnChanges, OnDestroy {

  constructor(private injector: Injector, private compiler: Compiler, private service: StateDynamicComponentsService) { }

  @Input() lazy: LazyImport[] = [];
  @Input() id = '';
  @Output() hasTriggeredDestroy = new BehaviorSubject<boolean>(false);
  @Output() hasErrors = new BehaviorSubject<boolean>(false);

  @ViewChild(StateDynamicDirective, { static: true }) stateDynamicHost!: StateDynamicDirective;

  private viewRef: any;
  private dynamicImport: any;

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.id) this.loadComponent();
  }

  ngOnDestroy() {
    this.hasTriggeredDestroy.next(true);
  }

  public set _id(currId: string) {
    this.id = currId;
    this.getCurrentImport();
    this.onLazy(this.dynamicImport.data.importId);
  }

  getCurrentImport(): void {
    this.dynamicImport = this.lazy.find(
      (lazyImport) => lazyImport.id.toLocaleLowerCase() === this.id.toLocaleLowerCase()
    );
  }

  private async loadComponent(factoryResolver: ComponentFactoryResolver): Promise<void> {
    try {
      const viewContainerRefVar = this.stateDynamicHost.viewContainerRef;
      viewContainerRefVar.clear();

      if (!this.dynamicImport) throw new Error('Component não encontrado.')

      const source = await this.dynamicImport.src;

      const ref = this.buildRef(source);
      const factory = factoryResolver.resolveComponentFactory(ref.component);

      this.viewRef = viewContainerRefVar.createComponent<LazyComponentRefModel>(
        factory as any
      );

      this.viewRef.instance.data = this.dynamicImport.data;
    } catch (error) {
      this.hasErrors.next(true);
      console.error(error);
    }
  }

  private buildRef(res: any): Ref {
    return Object.entries(res).reduce(
      (prev, [key, value]) => {
        if (key.includes('Component')) prev.component = value;
        if (key.includes('Module')) prev.module = value;
        return prev;
      },
      { component: null, module: null }
    );
  }

  onLazy(importId: string): void {
    this.loadModule(() => this.service.getPathImports(importId));
  }

  loadModule(path: any): void {
    (path() as Promise<NgModuleFactory<any> | Type<any>>)
      .then(elementModuleOrFactory => {
        if (elementModuleOrFactory instanceof NgModuleFactory) {
          // if ViewEngine
          return elementModuleOrFactory;
        } else {
          try {
            // if Ivy
            return this.compiler.compileModuleAsync(elementModuleOrFactory);
          } catch (err) {
            throw err;
          }
        }
      })
      .then(moduleFactory => {
        try {
          const elementModuleRef = moduleFactory.create(this.injector);
          this.loadComponent(elementModuleRef.componentFactoryResolver);
        } catch (err) {
          throw err;
        }
      });
  }

}


