import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  Chart,
  registerables,
} from 'chart.js';

import { Navbar } from '../../components/navbar/navbar';
import { StatsService } from '../../core/services/stats.service';
import { AfterViewInit } from '@angular/core';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [Navbar],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.scss',
})
export class DashboardEstadisticas
  implements AfterViewInit {

  private statsService =
    inject(StatsService);

  ngAfterViewInit(): void {

  this.loadPostsChart();

  this.loadCommentsChart();

  this.loadPieChart();
}
private loadPostsChart() {

  this.statsService.getPostsByUser().subscribe({

    next: (data) => {

      const labels =
        data.map(x => x.usuario);

      const values =
        data.map(x => x.cantidad);

      new Chart(

        'postsChart',

        {

          type: 'bar',

          data: {

            labels,

            datasets: [

              {

                label: 'Publicaciones',

                data: values,

                borderWidth: 1,

              },

            ],

          },

          options: {

            responsive: true,

            plugins: {

              legend: {

                display: false,

              },

            },

          },

        },

      );

    },

  });

}

private loadCommentsChart() {

  this.statsService.getCommentsByDate().subscribe({

    next: (data) => {

      const labels =
        data.map(x => x.fecha);

      const values =
        data.map(x => x.cantidad);

      new Chart(

        'commentsChart',

        {

          type: 'line',

          data: {

            labels,

            datasets: [

              {

                label: 'Comentarios',

                data: values,

                fill: false,

                tension: .3,

              },

            ],

          },

          options: {

            responsive: true,

          },

        },

      );

    },

  });

}

private loadPieChart() {

  this.statsService.getCommentsByPost().subscribe({

    next: (data) => {

      const labels =
        data.map(x => x.publicacion);

      const values =
        data.map(x => x.cantidad);

      new Chart(

        'pieChart',

        {

          type: 'pie',

          data: {

            labels,

            datasets: [

              {

                data: values,

              },

            ],

          },

          options: {

            responsive: true,

          },

        },

      );

    },

  });

}
}