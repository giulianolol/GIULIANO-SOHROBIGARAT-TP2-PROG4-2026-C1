import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe
implements PipeTransform {

  transform(value: Date | string): string {

    const fecha = new Date(value);

    const ahora = new Date();

    const segundos =
      Math.floor(
        (ahora.getTime() - fecha.getTime())
        / 1000,
      );

    if (segundos < 60) {

      return 'Hace unos segundos';

    }

    const minutos =
      Math.floor(segundos / 60);

    if (minutos < 60) {

      return `Hace ${minutos} min`;

    }

    const horas =
      Math.floor(minutos / 60);

    if (horas < 24) {

      return `Hace ${horas} hs`;

    }

    const dias =
      Math.floor(horas / 24);

    return `Hace ${dias} días`;

  }

}