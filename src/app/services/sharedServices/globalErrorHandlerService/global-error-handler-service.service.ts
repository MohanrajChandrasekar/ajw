import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { LoggerServiceService } from '../loggerService/logger-service.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerServiceService implements ErrorHandler{

  constructor(private injector: Injector, private logger: LoggerServiceService) { }
  
  // Handling Errors
  handleError(error: any) {
    let router = this.injector.get(Router);
    this.logger.log(error, router.url).subscribe(res => {
      console.log(res);
    },
    err => {
      throw err;
    });
    
  }
}
