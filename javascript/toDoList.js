// Array principal donde se guardan todos los pendientes
let pendientes = [];

// Carga los pendientes guardados en localStorage cuando inicia la app
function cargarPendientes() {
    const pendientesGuardados = localStorage.getItem('pendientes');

    // Si existen pendientes guardados, los convertimos de JSON a objeto
    if (pendientesGuardados) {
        pendientes = JSON.parse(pendientesGuardados);
    }
}

// Guarda el array de pendientes en localStorage
function guardarPendientes() {
    localStorage.setItem('pendientes', JSON.stringify(pendientes));
}

//Renderizar la lista

// Muestra los pendientes en pantalla
function renderizarPendientes() {
    const todoLista = document.querySelector('.todo-lista');

    // Si no existe el contenedor, salir de la función
    if (!todoLista) return;

    // Limpiar la lista antes de volver a dibujar
    todoLista.innerHTML = '';

    // Si no hay pendientes, mostrar mensaje
    if (pendientes.length === 0) {
        todoLista.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.5);">
                <p style="font-size: 1.2rem;">No tienes pendientes aún</p>
                <p style="font-size: 0.9rem; margin-top: 8px;">¡Agrega uno para comenzar!</p>
            </div>
        `;
        return;
    }

    // Recorrer todos los pendientes y crear el HTML
    pendientes.forEach((pendiente, index) => {
        const todoDiv = document.createElement('div');

        // Asignar clase segun la prioridad
        todoDiv.className = `todo ${pendiente.prioridad}`;
        
        // Contenido del pendiente
        todoDiv.innerHTML = `
            <div class="todo-check" onclick="toggleCompletado(${index})"></div>
            
            <div class="todo-info">
                <div class="todo-titulo">${pendiente.titulo}</div>
                <div class="todo-descripcion">${pendiente.descripcion}</div>
            </div>
            
            <div class="todo-acciones">
                <button class="todo-btn editar" onclick="irEditarPendiente(${index})">Editar</button>
                <button class="todo-btn eliminar" onclick="eliminarPendiente(${index})">Eliminar</button>
            </div>
        `;
        
        // Agregar el pendiente a la lista
        todoLista.appendChild(todoDiv);
    });
}

//Marcar como completado

// Cambia el estado de un pendiente
function toggleCompletado(index) {
    if (pendientes[index].prioridad === 'completado') {
        // Si ya estaba completado, regresar a la prioridad anterior
        pendientes[index].prioridad = pendientes[index].prioridadAnterior || 'pendiente';
    } else {
        // Guardar la prioridad anterior y marcar como completado
        pendientes[index].prioridadAnterior = pendientes[index].prioridad;
        pendientes[index].prioridad = 'completado';
    }

    guardarPendientes();
    renderizarPendientes();
}

//Eliminar Pendiente
function eliminarPendiente(index) {
    // Confirmar antes de eliminar
    if (confirm('¿Estás seguro de eliminar este pendiente?')) {
        pendientes.splice(index, 1);
        guardarPendientes();
        renderizarPendientes();
    }
}

//Inicializar la pagina de la lista
if (window.location.pathname.includes('toDoList.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        cargarPendientes();
        renderizarPendientes();
    });
}

//Variables del formulario
let prioridadSeleccionada = 'pendiente'; // Prioridad por defecto
let pendienteEditando = null;            // Indice del pendiente a editar

//Nuevo Pendiente
if (window.location.pathname.includes('nuevoPendiente.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        inicializarFormulario();
    });
}

//Editar Pendiente
if (window.location.pathname.includes('editarPendiente.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        inicializarFormulario();

        // Obtener el indice desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const editIndex = urlParams.get('index');

        if (editIndex !== null) {
            cargarPendientes();
            cargarPendienteParaEditar(parseInt(editIndex));
        } else {
            toDoList();
        }
    });
}

//Inicializar el formulario
function inicializarFormulario() {
    const prioridades = document.querySelectorAll('.prioridad');
    const btnCancelar = document.querySelector('.form-btn.cancelar');
    const btnGuardar = document.querySelector('.form-btn.guardar');
    const formulario = document.querySelector('.form-card');

    // Marcar prioridad por defecto
    prioridades.forEach(p => {
        if (p.classList.contains('pendiente')) {
            p.style.opacity = '1';
            p.style.transform = 'scale(1.05)';
        } else {
            p.style.opacity = '0.6';
        }
    });

    // Seleccion de prioridad
    prioridades.forEach(prioridad => {
        prioridad.addEventListener('click', () => {
            prioridades.forEach(p => {
                p.style.opacity = '0.6';
                p.style.transform = 'scale(1)';
            });

            prioridad.style.opacity = '1';
            prioridad.style.transform = 'scale(1.05)';

            if (prioridad.classList.contains('pendiente')) {
                prioridadSeleccionada = 'pendiente';
            } else if (prioridad.classList.contains('urgente')) {
                prioridadSeleccionada = 'urgente';
            }
        });
    });

    //Boton de cancelar
    btnCancelar.addEventListener('click', (e) => {
        e.preventDefault();
        toDoList();
    });

    //Boton de guardar
    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        guardarNuevoPendiente();
    });

    //Enviar del formulario
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarNuevoPendiente();
    });
}

//Cargar pendiente a editar
function cargarPendienteParaEditar(index) {
    const pendiente = pendientes[index];

    if (!pendiente) {
        alert('Pendiente no encontrado');
        toDoList();
        return;
    }

    pendienteEditando = index;

    // Llenar campos
    document.querySelector('.form-grupo input').value = pendiente.titulo;
    document.querySelector('.form-grupo textarea').value = pendiente.descripcion;

    // Detectar prioridad correcta
    const prioridad = pendiente.prioridadAnterior || pendiente.prioridad;
    prioridadSeleccionada = prioridad === 'completado' ? 'pendiente' : prioridad;
}

// Guardar pendiente
function guardarNuevoPendiente() {
    const titulo = document.querySelector('.form-grupo input').value.trim();
    const descripcion = document.querySelector('.form-grupo textarea').value.trim();

    if (!titulo) {
        alert('Por favor ingresa un título');
        return;
    }

    cargarPendientes();

    if (pendienteEditando !== null) {
        // Editar pendiente existente
        pendientes[pendienteEditando].titulo = titulo;
        pendientes[pendienteEditando].descripcion = descripcion || 'Sin descripción';
    } else {
        // Crear nuevo pendiente
        pendientes.push({
            titulo,
            descripcion: descripcion || 'Sin descripción',
            prioridad: prioridadSeleccionada
        });
    }

    guardarPendientes();
    toDoList();
}

//Ir editarPendiente
function irEditarPendiente(index) {
    if (window.location.pathname.includes('/html/')) {
        window.location.href = `editarPendiente.html?index=${index}`;
    } else {
        window.location.href = `html/editarPendiente.html?index=${index}`;
    }
}
