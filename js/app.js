const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody');  

eventListeners();

function eventListeners() {
    //Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);
    //listener para eliminar el boton
    listadoContactos.addEventListener('click', eliminarContacto);
}
function leerFormulario(e){
    e.preventDefault();
    //leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono == '') {
        //se agrega 2 parametros: mensaje y clase
        mostrarNotificacion('Todos los Campos son Obligatorios', 'error');
    } else{
        //Pasa la validacion, crear llamado a ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        //console.log(...infoContacto);

        if (accion === 'crear') {
            //crearemos un nuevo elemento
            insertarBD(infoContacto);
        } else{
            //editar el contacto
        }
    }
}
//Inserta en la base de datos via Ajax
function insertarBD(datos) {
    // llamado a ajax

    // crear el objeto
    const xhr = new XMLHttpRequest();

    // abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // pasar los datos
    xhr.onload = function() {
         if(this.status === 200) {
              //console.log(JSON.parse( xhr.responseText) ); 
              // leemos la respuesta de PHP
              const respuesta = JSON.parse(xhr.responseText);

              // Inserta un nuevo elemento a la tabla
              const nuevoContacto = document.createElement('tr');

              nuevoContacto.innerHTML = `
                   <td>${respuesta.datos.nombre}</td>
                   <td>${respuesta.datos.empresa}</td>
                   <td>${respuesta.datos.telefono}</td>
              `;

              // crear contenedor para los botones
              const contenedorAcciones = document.createElement('td');

              // crear el icono de Editar
              const iconoEditar = document.createElement('i');
              iconoEditar.classList.add('fas', 'fa-pen-square');

              // crea el enlace para editar
              const btnEditar = document.createElement('a');
              btnEditar.appendChild(iconoEditar);
              btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
              btnEditar.classList.add('btn', 'btn-editar');

              // agregarlo al padre
              contenedorAcciones.appendChild(btnEditar);

              // crear el icono de eliminar
              const iconoEliminar = document.createElement('i');
              iconoEliminar.classList.add('fas', 'fa-trash-alt');

              // crear el boton de eliminar
              const btnEliminar = document.createElement('button');
              btnEliminar.appendChild(iconoEliminar);
              btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
              btnEliminar.classList.add('btn', 'btn-borrar');

              // agregarlo al padre
              contenedorAcciones.appendChild(btnEliminar);

              // Agregarlo al tr
              nuevoContacto.appendChild(contenedorAcciones);

              // agregarlo con los contactos
              listadoContactos.appendChild(nuevoContacto);

              //resetear los formularios
              document.querySelector('form').reset();
              //mostrar la notificacion
              mostrarNotificacion('Contacto Creado Correctamente', 'correcto');
        }
    }
    //enviar los datos
    xhr.send(datos)
}

//Eliminar el contacto
function eliminarContacto(e){
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        //tomar el ID del elemento
        const id = e.target.parentElement.getAttribute('data-id');
        //pregunta al usuario
        const respuesta = confirm('¿Estás Segur@?');

        if (respuesta) {
            //llamado a AJAX crear el objeto
            const xhr = new XMLHttpRequest();
            //abrir la conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
            //leer la respuesta
            xhr.onload = function(){
                if (this.status === 200) {
                    
                    const resultado = JSON.parse( xhr.responseText );
                    
                    if (resultado.respuesta == 'correcto') {
                        //eliminar el registro del DOM
                        e.target.parentElement.parentElement.parentElement.remove();
                        //mostrar notificacion
                        mostrarNotificacion('El Contacto Fue Eliminado Correctamente...', 'correcto');
                    } else{
                        //mostramos una notificacion
                        mostrarNotificacion('Hubo un error...', 'error');
                    }
                }
            }
            //enviar la peticion
            xhr.send();
        }
    }
}

//notificacion en pantalla
function mostrarNotificacion(mensaje, clase){
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;
    //Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    //Ocultar y Mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}