import {
  Component,
  AfterViewInit,
  inject,
} from '@angular/core';

import {
  Chart,
  registerables,
} from 'chart.js';

import { FormsModule } from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';
import { StatsService } from '../../core/services/stats.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [
    Navbar,
    FormsModule,
  ],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.scss',
})
export class DashboardEstadisticas
  implements AfterViewInit {

  fechaDesde = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .split('T')[0];

  fechaHasta = new Date()
    .toISOString()
    .split('T')[0];

  private statsService =
    inject(StatsService);

  ngAfterViewInit(): void {

    this.loadPostsChart();

    this.loadCommentsChart();

    this.loadPieChart();

  }

  filtrar() {

    Chart.getChart('postsChart')?.destroy();

    Chart.getChart('commentsChart')?.destroy();

    Chart.getChart('pieChart')?.destroy();

    this.loadPostsChart();

    this.loadCommentsChart();

    this.loadPieChart();

  }

  private loadPostsChart() {

    this.statsService.getPostsByUser(
      this.fechaDesde,
      this.fechaHasta,
    ).subscribe({

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

    this.statsService.getCommentsByDate(
      this.fechaDesde,
      this.fechaHasta,
    ).subscribe({

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

    this.statsService.getCommentsByPost(
      this.fechaDesde,
      this.fechaHasta,
    ).subscribe({

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