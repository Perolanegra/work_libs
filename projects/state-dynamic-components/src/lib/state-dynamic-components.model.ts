export class LazyImport {
    constructor(public id: string, public src: Promise<any>, public data?: any) {}
  }
  
  import { Type } from '@angular/core';
  
  export interface LazyImports {
    getLazyImports: (data?: any) => Array<LazyImport>;
  }
  
  export interface LazyComponentRefModel {
    data: any;
  }
  
  export interface Ref {
    component: Type<LazyComponentRefModel>;
    module: Type<unknown>;
  }
  