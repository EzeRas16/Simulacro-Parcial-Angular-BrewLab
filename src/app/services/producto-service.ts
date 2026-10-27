import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Producto, ProductoFormulario } from "../models/producto.model";

@Injectable({providedIn: 'root'}) // singleton, service global.
export class ProductoService {
    private readonly http = inject(HttpClient);
    private readonly url = 'http://localhost:3000/brewingDevices'


    obtenerTodos(){ return this.http.get<Producto[]>(this.url);}

    obtenerPorId(id : string | number){ return this.http.get<Producto>(`${this.url}/${id}`)}

    agregar (producto : ProductoFormulario){
        return this.http.post<Producto>(this.url, producto);
    }

    eliminar (id : string | number){
        return this.http.delete<Producto>(`${this.url}/${id}`);

    }

    editar (id : string | number, editado : ProductoFormulario){
        return this.http.put <Producto>(`${this.url}/${id}`, editado);
    }
    
}
