import { Component, computed, inject, signal } from '@angular/core';
import { ProductoService } from '../../services/producto-service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CATEGORIES } from '../../models/producto.model';

@Component({
  imports: [],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class Catalogo {
  private readonly servicio = inject(ProductoService);                           // el servicio HTTP
  protected readonly router = inject(Router);                                    // protected: el HTML lo usa para navegar
  protected readonly categorias = CATEGORIES;                                   // lista para el desplegable

  protected readonly productos = toSignal(this.servicio.obtenerTodos(), { initialValue: [] }); // la lista; arranca vacía hasta que llegue

  protected readonly filtroCategoria = signal('');                               // '' = todas
  protected readonly orden = signal('');                                         // '' = sin orden, 'asc' o 'desc'

  protected readonly productosFiltrados = computed(() => {                      // se recalcula solo si cambia un filtro o la lista
    const categoria = this.filtroCategoria();
    const orden = this.orden();

    const filtrados = this.productos().filter((p) => categoria === '' || p.category === categoria); // filtra por categoría

    switch (orden) {                                                            // ordena según la opción elegida
      case 'asc':
        return [...filtrados].sort((a, b) => a.salePrice - b.salePrice);
      case 'desc':
        return [...filtrados].sort((a, b) => b.salePrice - a.salePrice);
      default:
        return filtrados;
    }
  });

  protected readonly cantidad = computed(() => this.productosFiltrados().length); // cantidad de ítems mostrados

  limpiarFiltros() {
    this.filtroCategoria.set('');                                                // vuelve los filtros a vacío
    this.orden.set('');
  }
}