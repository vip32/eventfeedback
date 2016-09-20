import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LayoutModule } from './layout/layout.module';
import { MaterialModule } from './material.module';
import { AuthService } from './auth.service';
import { BackendService } from './backend.service';
import { LoggerService } from './logger.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule.forRoot()],
  exports: [LayoutModule, MaterialModule,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [AuthService, BackendService, LoggerService]
    };
  }
}
