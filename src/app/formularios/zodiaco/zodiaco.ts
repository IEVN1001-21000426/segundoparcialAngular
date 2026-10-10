
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-zodiaco',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './zodiaco.html'
})

export class Zodiaco {

  // Formulario reactivo
  formulario = new FormGroup({
    nombre: new FormControl(''),
    paterno: new FormControl(''),
    materno: new FormControl(''),
    dia: new FormControl(''),
    mes: new FormControl(''),
    anio: new FormControl(''),
    sexo: new FormControl('')
  });

  // Variables para mostrar los resultados
  nombreCompleto = '';
  edad = 0;
  signo = '';
  imagen = '';
  mostrarResultado = false;
  mensaje = '';

  // Animales del zodiaco chino
  animales = [
    'Mono', 'Gallo', 'Perro', 'Cerdo',
    'Rata', 'Buey', 'Tigre', 'Conejo',
    'Dragón', 'Serpiente', 'Caballo', 'Cabra'
  ];

  imprimir() {

    // Obtener los datos del formulario
    const datos = this.formulario.value;

    const dia = Number(datos.dia);
    const mes = Number(datos.mes);
    const anio = Number(datos.anio);

    // Validar que todos los campos estén llenos
    if (!datos.nombre || !datos.paterno ||
        !datos.materno || !datos.sexo ||
        !datos.dia || !datos.mes || !datos.anio) {

      this.mensaje = 'Por favor llena todos los campos';
      this.mostrarResultado = false;
      return;
    }

    // Obtener la fecha actual
    const hoy = new Date();

    // Verificar que la fecha sea válida
    const nacimiento = new Date(anio, mes - 1, dia);

    if (nacimiento.getFullYear() !== anio ||
        nacimiento.getMonth() !== mes - 1 ||
        nacimiento.getDate() !== dia ||
        nacimiento > hoy) {

      this.mensaje = 'Fecha de nacimiento inválida';
      this.mostrarResultado = false;
      return;
    }

    // Juntar nombre y apellidos
    this.nombreCompleto =
      datos.nombre + ' ' +
      datos.paterno + ' ' +
      datos.materno;

    // Calcular edad
    this.edad = hoy.getFullYear() - anio;

    if (hoy.getMonth() + 1 < mes ||
       (hoy.getMonth() + 1 === mes &&
        hoy.getDate() < dia)) {
      this.edad--;
    }

    // Calcular signo del zodiaco chino
    const posicion = anio % 12;

    this.signo = this.animales[posicion];

    // Convertir el signo a minúsculas
    let nombreImagen = this.signo.toLowerCase();

    // Corregir el nombre del dragón
    if (this.signo === 'Dragón') {
      nombreImagen = 'dragon';
    }

    // Mostrar la imagen JPG
    this.imagen = 'img/' + nombreImagen + '.jpg';

    // Mostrar resultados
    this.mensaje = '';
    this.mostrarResultado = true;
  }
}
