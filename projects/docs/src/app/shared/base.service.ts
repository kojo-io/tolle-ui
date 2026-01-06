import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseService {
  copyTo(value: any) {
    navigator.clipboard.writeText(value).then(r =>console.log('Copied to clipboard', r));
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
