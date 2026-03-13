let paso = 1;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); //Muestra la seccion por defecto
    tabs(); //Cambia la seccion cuando se presiona el tab
    botonesPaginador(); //Agrega o quita el paso segun el boton que se presione
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); //Consulta la API en el backend de PHP

    idCliente(); //Agrega el id del cliente a la cita
    nombreCliente(); //Agrega el nombre del cliente a la cita
    seleccionarFecha(); //Agrega la fecha de la cita
    seleccionarHora(); //Agrega la hora de la cita

    mostrarResumen(); //Muestra el resumen de la cita creada
}

function mostrarSeccion() {
    //Ocultar la seccion que tenga mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }
    
    //Seleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Elimina el resaltado del tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');


}

function tabs() {
    //Agrega y cambia la variable de paso segun el tab seleccionado
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();

            botonesPaginador();
        });
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
        

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');

    paginaAnterior.addEventListener('click', function() {
        if(paso > 1) {
            paso--;
            mostrarSeccion();
            botonesPaginador();
        }
    });
}


function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');

    paginaSiguiente.addEventListener('click', function() {
        if(paso < 3) {
            paso++;
            mostrarSeccion();
            botonesPaginador();
        }
    });

}

async function consultarAPI() {
   
    try {
        const url = 'http://localhost:8000/api/servicios';
        const resultado = await fetch(url);

        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }

}

function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id; // Agrega el ID del servicio como un atributo de datos
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }; // Agrega el evento de clic para seleccionar el servicio

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

    });

}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;
   
    //Identificar el div del servicio que se ha seleccionado
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`); // Selecciona el div del servicio utilizando el ID

    //Comprobar si el servicio ya esta seleccionado, si es asi, eliminarlo
    if( servicios.some( seleccionado => seleccionado.id === id ) ) {
        //Eliminarlo
        cita.servicios = servicios.filter( seleccionado => seleccionado.id !== id );
        document.querySelector(`[data-id-servicio="${id}"]`).classList.remove('seleccionado');
        return;
    } else {
        //Agregarlo
        cita.servicios = [...servicios, servicio]; // Agrega el servicio seleccionado al arreglo de servicios en la cita
        divServicio.classList.add('seleccionado'); // Agrega una clase para resaltar el servicio seleccionado
    }

    console.log(servicio);

}

function idCliente() {
    cita.id = document.querySelector('#id').value;// Agrega el valor del input de id al objeto de cita
}


function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;// Agrega el valor del input de nombre al objeto de cita

}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        const dia = new Date(e.target.value).getUTCDay(); // Obtiene el día de la semana (0-6) a partir de la fecha seleccionada

        if([6, 0].includes(dia)) {
           e.target.value = ''; // Limpia el valor del input de fecha
           mostrarAlerta('Fines de semana no permitidos', 'error','.formulario'); // Muestra una alerta indicando que los fines de semana no son permitidos
        } else {
             cita.fecha = e.target.value; // Agrega el valor del input de fecha al objeto de cita
        }

    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {

        const horaCita = e.target.value; // Agrega el valor del input de hora al objeto de cita
        const hora = horaCita.split(':'); // Divide la hora en horas y minutos
        if (hora[0] < 10 || hora[0] > 18) { // Verifica si la hora está fuera del rango permitido (10:00 - 18:00)
            e.target.value = ''; // Limpia el valor del input de hora
            mostrarAlerta('Hora no permitida. Seleccione una hora entre 10:00 y 18:00', 'error','.formulario');
        } else {
            cita.hora = horaCita; // Agrega la hora seleccionada al objeto de cita
        }
    });

}

function mostrarAlerta(mensaje , tipo, elemento, desaparece = true) {
    //Previene que se generen varias alertas
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    //Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta', tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);


    if(desaparece) {
        //Eliminar la alerta despues de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    //Limpiar el resumen previo
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de Servicio, Fecha u Hora', 'error','.contenido-resumen', false)     

    return;
    }

    //Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

 

    //Heading para servicios en resumen
    const headerServicios = document.createElement('H3');
    headerServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headerServicios);



    //Iterando y mostrando los servicios seleccionados
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');


        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;


        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })


     //Heading para cita en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);


    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    //Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    //Boton para crear la cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    
    const datos = new FormData();
    const { nombre, fecha, hora, servicios, id } = cita;
    const idServicios = servicios.map(servicio => servicio.id).join(','); // Convierte el arreglo de servicios en una cadena separada por comas

    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);


    //Peticion hacia la api

    try {
    const url = 'http://localhost:8000/api/citas';

    const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
    });

    const respuestaTexto = await respuesta.text();
    let resultado;

    try {
        resultado = JSON.parse(respuestaTexto);
    } catch (parseError) {
        throw new Error(respuestaTexto || 'La respuesta del servidor no es JSON válido');
    }

    if(!respuesta.ok) {
        throw new Error(resultado.mensaje || `Error HTTP: ${respuesta.status}`);
    }

    console.log(resultado.resultado);

    if(resultado.resultado) {
        Swal.fire({
            icon: "success",
            title: "Cita Reservada",
            text: "Tu cita ha sido reservada exitosamente!",
            button: "OK"
        }).then(() => {
            setTimeout(() => {
                window.location.reload(); // Recarga la página después de cerrar la alerta
            }, 2000);
        });
    } else {
        throw new Error(resultado.mensaje || 'No se pudo guardar la cita');
    }
    } catch (error) {
        Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Hubo un error al guardar la cita"
        });
    }


}