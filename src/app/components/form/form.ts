import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { form, FormField, FormRoot, min, required } from '@angular/forms/signals';
import { ProductoService } from '../../services/producto-service';
import { CATEGORIES, Producto, ProductoFormulario } from '../../models/producto.model';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-form',
  styleUrl: './form.css',
  templateUrl: './form.html',
})
export class Form implements OnInit{
  private readonly servicio = inject (ProductoService);
  private readonly vacio : ProductoFormulario = {
    modelName: '',
    category: '',
    salePrice: Number.NaN,
    brand: '',
    material: '',
    isInStore: false,
    notes: '',
    cupProfile: ''
  };

  private readonly modelo = signal<ProductoFormulario>({...this.vacio})

  readonly producto = input<Producto>();
  readonly editado = output<Producto>();
  protected readonly editando = computed(() => this.producto() !== undefined);  // true si hay producto. protected: el HTML puede leerlo

  ngOnInit() { 
  const p = this.producto();
    if (p) this.modelo.set(p);
   }

   protected readonly categorias = CATEGORIES;

  readonly formulario = form(this.modelo , (p) => { // formulario es el nombre que le pondre para poder usarlo facil en el html
    required(p.modelName, {message : 'Campo requerido'});
    required(p.category, {message : 'Campo requerido'});
    required(p.salePrice, {message : 'Campo requerido'});
    min(p.salePrice, 1 ,{message : 'No puede ser negativo'});
    required (p.brand , {message : 'Campo requerido'})
    required (p.material , {message : 'Campo requerido'})
    required (p.notes , {message : 'Campo requerido'})
    required (p.cupProfile , {message : 'Campo requerido'})
  },
{submission: {                                                    // 3) qué pasa al enviar
        action: async (campo) => {                                     // async: permite usar await adentro
          const datos = campo().value();                               // objeto con lo que escribió el usuario
          const actual = this.producto();                              // el producto recibido (o undefined)
          if (actual) {                                                // MODO EDICIÓN
            const resultado = await firstValueFrom(this.servicio.editar(actual.id, datos));  // PUT, y espera la respuesta
            alert('Producto modificado');
            this.editado.emit(resultado);                              // avisa al padre
          } else {                                                     // MODO ALTA
            await firstValueFrom(this.servicio.agregar(datos));        // POST, y espera la respuesta
            alert('Producto agregado');
            this.limpiar();                                            // deja el formulario vacío
          }
        },
        onInvalid: () => alert('Revise el formulario'),                // si intentan enviar con errores, avisa (el tip de la alerta)
      },
    },
  );

  limpiar(){
    this.formulario().reset({...this.vacio});
  }
}
