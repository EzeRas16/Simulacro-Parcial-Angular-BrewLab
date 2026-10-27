import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../services/producto-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { firstValueFrom } from 'rxjs';
import { Form } from '../form/form';

@Component({
  imports: [Form],
  selector: 'app-detalles',
  styleUrl: './detalles.css',
  templateUrl: './detalles.html',
})
export class Detalles implements OnInit {

  private readonly route = inject(ActivatedRoute);                      // lee la URL
  private readonly servicio = inject(ProductoService);                  // el servicio HTTP
  private readonly router = inject(Router);                           // protected: el HTML lo usa para "Volver"

  private readonly id = this.route.snapshot.paramMap.get('id');         // el :id de /detalle/:id

  protected readonly producto = signal<Producto | null>(null);          // el producto; arranca vacío hasta que llegue
  protected readonly editando = signal(false);                          // ¿el formulario está desplegado?
  protected readonly panel = signal<'notes' | 'cupProfile'>('notes');   // pestaña activa

  async ngOnInit() {                                                    // corre una vez, al crearse
    if (this.id) {
      this.producto.set(await firstValueFrom(this.servicio.obtenerPorId(this.id)));   // espera el GET y guarda el resultado
    } else {
      alert('id no encontrado');
      this.router.navigate(['/catalogo']);
    }
  }

  async eliminar() {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto? BrewLab-731') || !this.id) return;  // texto exacto del enunciado
    await firstValueFrom(this.servicio.eliminar(this.id));              // DELETE, y espera que termine
    this.router.navigate(['/catalogo']);                                // vuelve al catálogo, ya sin ese producto
  }

  alEditar(p: Producto) {                                               // corre cuando el formulario emite el producto editado
    this.producto.set(p);                                               // reemplaza los datos: la vista se refresca sola
    this.editando.set(false);                                           // cierra el formulario
  }

}