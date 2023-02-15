import { ModuleWithProviders, NgModule } from "@angular/core";
import { StateDynamicComponent } from "./state-dynamic-components.component";
import { StateDynamicComponentsService } from "./state-dynamic-components.service";
import { StateDynamicDirective } from "./state-dynamic-controller.directive";

@NgModule({
  declarations: [
    StateDynamicComponent,
    StateDynamicDirective
  ],
  providers: [
    StateDynamicComponentsService
  ],
  imports: [],
  exports: [StateDynamicComponent],
})
export class StateDynamicComponentsModule {
  public static forRoot(
    service: any
  ): ModuleWithProviders<StateDynamicComponentsModule> {
    return {
      ngModule: StateDynamicComponentsModule,
      providers: [
        StateDynamicComponentsService,
        {
          provide: "clientAppService", // you can also use InjectionToken
          useValue: service,
        },
      ],
    };
  }
}
