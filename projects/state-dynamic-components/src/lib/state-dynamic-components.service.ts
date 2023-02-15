import { Injectable } from "@angular/core";
import { LazyImports, LazyImport } from "./state-dynamic-components.model";

@Injectable()
export class StateDynamicComponentsService implements LazyImports {

  constructor(private clientAppService: HomeService) {}

  getLazyImports(
    componentsRef: Array<{ id: string; componentRef: string }>,
    payload?: any
  ): Array<LazyImport> {
    return componentsRef.map(
      (c) =>
        new LazyImport(
          c.id,
          import(
            `../../lazy/components/${c.componentRef}/${c.componentRef}.component`
          ),
          payload
        )
    );
  }

  getPathImports(importId: string) {
    return this.clientAppService.getLazyImports().find((i) => i.id === importId).import;
  }
}
