
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

// Estructura de los datos que guardaremos
interface RegistroZodiaco {
  nombre: string;
  paterno: string;
  materno: string;
  sexo: string;
  edad: number;
  signo: string;
  dia: string;
  mes: string;
  anio: string;
}


@Component({
  selector: 'app-zodiaco',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './zodiaco.html'
})

export class Zodiaco implements OnInit {

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

  // Variables de los resultados
  nombreCompleto = '';
  edad = 0;
  signo = '';
  imagen = '';
  mostrarResultado = false;
  mensaje = '';

  // Variables del registro
  registros: RegistroZodiaco[] = [];
  indiceEdicion = -1;
  mensajeRegistro = '';

  // Controlar qué vista se muestra
  vistaActual = 'formulario';

  // Animales del zodiaco chino
  animales = [
    'Mono', 'Gallo', 'Perro', 'Cerdo',
    'Rata', 'Buey', 'Tigre', 'Conejo',
    'Dragón', 'Serpiente', 'Caballo', 'Cabra'
  ];


  // 1. Cargar los registros al iniciar
  ngOnInit(): void {
    this.cargarRegistros();
  }


  // 2. Calcular edad y signo zodiacal
  imprimir(): void {

    const datos = this.formulario.value;

    const dia = Number(datos.dia);
    const mes = Number(datos.mes);
    const anio = Number(datos.anio);

    // Validar los campos
    if (
      !datos.nombre?.trim() ||
      !datos.paterno?.trim() ||
      !datos.materno?.trim() ||
      !datos.sexo ||
      !datos.dia ||
      !datos.mes ||
      !datos.anio
    ) {

      this.mensaje = 'Por favor llena todos los campos';
      this.mostrarResultado = false;
      return;
    }

    // Obtener la fecha actual
    const hoy = new Date();

    // Comprobar la fecha de nacimiento
    const nacimiento = new Date(anio, mes - 1, dia);

    if (
      anio <= 0 ||
      nacimiento.getFullYear() !== anio ||
      nacimiento.getMonth() !== mes - 1 ||
      nacimiento.getDate() !== dia ||
      nacimiento > hoy
    ) {

      this.mensaje = 'Fecha de nacimiento inválida';
      this.mostrarResultado = false;
      return;
    }

    // Juntar nombre y apellidos
    this.nombreCompleto =
      datos.nombre.trim() + ' ' +
      datos.paterno.trim() + ' ' +
      datos.materno.trim();

    // Calcular la edad
    this.edad = hoy.getFullYear() - anio;

    if (
      hoy.getMonth() + 1 < mes ||
      (hoy.getMonth() + 1 === mes &&
      hoy.getDate() < dia)
    ) {
      this.edad--;
    }

    // Calcular signo chino
    const posicion = anio % 12;

    this.signo = this.animales[posicion];

    // Preparar imagen
    let nombreImagen = this.signo.toLowerCase();

    if (this.signo === 'Dragón') {
      nombreImagen = 'dragon';
    }

    this.imagen = 'img/' + nombreImagen + '.jpg';

    // Mostrar resultado
    this.mensaje = '';
    this.mostrarResultado = true;

  }


  // 3. Guardar o actualizar registros
  guardarRegistro(): void {

    // Calcular la edad y validar primero
    this.imprimir();

    if (!this.mostrarResultado) {
      return;
    }

    const datos = this.formulario.getRawValue();

    // Crear registro
    
const persona: RegistroZodiaco = {
  nombre: (datos.nombre ?? '').trim(),
  paterno: (datos.paterno ?? '').trim(),
  materno: (datos.materno ?? '').trim(),
  sexo: datos.sexo ?? '',
  edad: this.edad,
  signo: this.signo,
  dia: datos.dia ?? '',
  mes: datos.mes ?? '',
  anio: datos.anio ?? ''
};


    if (this.indiceEdicion !== -1) {

      // Actualizar el registro seleccionado
      this.registros[this.indiceEdicion] = persona;

      this.mensajeRegistro =
        'Registro actualizado correctamente';

    } else {

      // Agregar una persona nueva
      this.registros.push(persona);

      this.mensajeRegistro =
        'Persona registrada correctamente';

    }

    // Guardar información
    localStorage.setItem(
      'registrosZodiaco',
      JSON.stringify(this.registros)
    );

    // Limpiar formulario
    this.limpiarCampos();

    // Abrir la vista de registros
    this.vistaActual = 'registros';

  }


  // 4. Editar una persona
  editarRegistro(index: number): void {

    const persona = this.registros[index];

    // Colocar los datos en el formulario
    this.formulario.patchValue({
      nombre: persona.nombre,
      paterno: persona.paterno,
      materno: persona.materno,
      dia: persona.dia,
      mes: persona.mes,
      anio: persona.anio,
      sexo: persona.sexo
    });

    this.indiceEdicion = index;

    // Ocultar el resultado anterior
    this.mostrarResultado = false;
    this.mensaje = '';

    // Regresar al formulario para editar
    this.vistaActual = 'formulario';

  }


  // 5. Recuperar registros guardados
  cargarRegistros(): void {

    const datos = localStorage.getItem('registrosZodiaco');

    if (datos) {

      try {
        const guardados = JSON.parse(datos);

        this.registros = Array.isArray(guardados)
          ? guardados
          : [];

      } catch {
        this.registros = [];
      }

    } else {
      this.registros = [];
    }

  }


  // 6. Eliminar una persona
  eliminarRegistro(index: number): void {

    const confirmar = confirm(
      '¿Deseas eliminar este registro?'
    );

    if (confirmar) {

      this.registros.splice(index, 1);

      localStorage.setItem(
        'registrosZodiaco',
        JSON.stringify(this.registros)
      );

      this.limpiarCampos();

      this.mensajeRegistro =
        'Registro eliminado correctamente';

    }

  }


  // 7. Limpiar el formulario
  limpiarCampos(): void {

    this.formulario.reset({
      nombre: '',
      paterno: '',
      materno: '',
      dia: '',
      mes: '',
      anio: '',
      sexo: ''
    });

    this.nombreCompleto = '';
    this.edad = 0;
    this.signo = '';
    this.imagen = '';

    this.mostrarResultado = false;
    this.mensaje = '';

    this.indiceEdicion = -1;

  }


  // 8. Abrir vista de registros
  verRegistros(): void {

    this.cargarRegistros();

    this.vistaActual = 'registros';

  }


  // 9. Regresar al formulario
  volverFormulario(): void {

    this.vistaActual = 'formulario';

  }

}
