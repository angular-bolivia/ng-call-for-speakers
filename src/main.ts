if (typeof window !== 'undefined') {
  const filterFn = (...args: any[]) => {
    return args.some(arg => {
      try {
        const str = typeof arg === 'string' ? arg : JSON.stringify(arg);
        return str && (str.includes('SessionIDFound') || str.includes('Session ID'));
      } catch (e) {
        return false;
      }
    });
  };

  const originalLog = console.log;
  console.log = function(...args: any[]) {
    if (!filterFn(...args)) originalLog.apply(console, args);
  };

  const originalInfo = console.info;
  console.info = function(...args: any[]) {
    if (!filterFn(...args)) originalInfo.apply(console, args);
  };

  const originalDebug = console.debug;
  console.debug = function(...args: any[]) {
    if (!filterFn(...args)) originalDebug.apply(console, args);
  };
}

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
