import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
    name: 'removespaces'
})
export class RemoveSpaces implements PipeTransform {
  transform(value: string): string {
    return value.replace(/ /g, "");
  }
} 