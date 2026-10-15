
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAlumno } from './alumnos';

@Component({

  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.html',

})

export class ListaAlumnos implements OnInit {

  formulario!: FormGroup;

  alumnos: IAlumno[] = [];

  nuevoAlumno: IAlumno = {
    matricula: '',
    nombre: '',
    correo: '',
    materia: '',
  };

  indiceEdicion: number = -1;


  // 1. Inicializar el formulario
  ngOnInit(): void {

    this.cargarAlumnos();

    this.formulario = new FormGroup({
      matricula: new FormControl(''),
      nombre: new FormControl(''),
      correo: new FormControl(''),
      materia: new FormControl('')
    });

  }


  // 2. Agregar o actualizar alumnos
  agregarAlumno(): void {

    if (
      this.nuevoAlumno.matricula === '' ||
      this.nuevoAlumno.nombre === '' ||
      this.nuevoAlumno.correo === '' ||
      this.nuevoAlumno.materia === ''
    ) {

      alert('Todos los campos son obligatorios');
      return;

    }

    if (this.indiceEdicion !== -1) {

      this.alumnos[this.indiceEdicion] = {
        ...this.nuevoAlumno
      };

    } else {

      this.alumnos.push({ ...this.nuevoAlumno });

    }

    localStorage.setItem(
      'alumnos',
      JSON.stringify(this.alumnos)
    );

    this.limpiarCampos();

  }


  // 3. Obtener los datos del formulario
  muestraAlumnos(): void {

    this.nuevoAlumno.matricula = this.formulario.value.matricula;
    this.nuevoAlumno.nombre = this.formulario.value.nombre;
    this.nuevoAlumno.correo = this.formulario.value.correo;
    this.nuevoAlumno.materia = this.formulario.value.materia;

    this.agregarAlumno();

  }


  // 4. Editar los datos de un alumno
  editarAlumno(index: number): void {

    this.nuevoAlumno = {
      ...this.alumnos[index]
    };

    const alumno = this.alumnos[index];

    this.formulario.patchValue({
      matricula: alumno.matricula,
      nombre: alumno.nombre,
      correo: alumno.correo,
      materia: alumno.materia
    });

    this.indiceEdicion = index;

  }


  // 5. Cargar alumnos guardados
  cargarAlumnos(): void {

    const datos = localStorage.getItem('alumnos');

    if (datos) {
      this.alumnos = JSON.parse(datos);
    }

  }


  // 6. Eliminar un alumno
  eliminarAlumno(index: number): void {

    this.alumnos.splice(index, 1);

    localStorage.setItem(
      'alumnos',
      JSON.stringify(this.alumnos)
    );

    this.limpiarCampos();

  }


  // 7. Limpiar los campos del formulario
  limpiarCampos(): void {

    this.nuevoAlumno = {
      matricula: '',
      nombre: '',
      correo: '',
      materia: ''
    };

    this.indiceEdicion = -1;

    this.formulario.reset({
      matricula: '',
      nombre: '',
      correo: '',
      materia: ''
    });

  }

}
