// Array principal donde se guardan todos los pendientes
let pendientes = [];
// Guarda el filtro actualmente seleccionado
let filtroActual = 'todas';

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

// Inicializa el selector de filtros
function inicializarFiltro() {
    const filtroSelect = document.querySelector('.filtro-select');

    // Si no existe el select, salir
    if (!filtroSelect) return;

    // Detecta cuando el usuario cambia el filtro
    filtroSelect.addEventListener('change', (e) => {
        filtroActual = e.target.value;
        renderizarPendientes();
    });
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

    // Crear una copia del array agregando el índice original
    let pendientesFiltrados = pendientes.map((p, index) => ({
        ...p,
        index
    }));

    // Aplicar filtros segun la seleccion
    if (filtroActual === 'pendientes') {
        pendientesFiltrados = pendientesFiltrados.filter(p => p.prioridad === 'pendiente');
    } else if (filtroActual === 'urgentes') {
        pendientesFiltrados = pendientesFiltrados.filter(p => p.prioridad === 'urgente');
    } else if (filtroActual === 'finalizadas') {
        pendientesFiltrados = pendientesFiltrados.filter(p => p.prioridad === 'completado');
    }

    // Si no hay resultados despues del filtro
    if (pendientesFiltrados.length === 0) {
        todoLista.innerHTML = `
            <div style="text-align:center;padding:40px;color:rgba(255,255,255,0.5);">
                <p style="font-size:1.2rem;">No hay tareas para este filtro</p>
            </div>
        `;
        return;
    }

    // Recorrer los pendientes filtrados y crear su HTML
    pendientesFiltrados.forEach((pendiente) => {
        const todoDiv = document.createElement('div');

        // Asignar clase segun la prioridad
        todoDiv.className = `todo ${pendiente.prioridad}`;
        
        // Contenido del pendiente
        todoDiv.innerHTML = `
            <div class="todo-check" onclick="toggleCompletado(${pendiente.index})"></div>
            
            <div class="todo-info">
                <div class="todo-titulo">${pendiente.titulo}</div>
                <div class="todo-descripcion">${pendiente.descripcion}</div>
            </div>
            
            <div class="todo-acciones">
                <button class="todo-btn editar" onclick="irEditarPendiente(${pendiente.index})">Editar</button>
                <button class="todo-btn eliminar" onclick="eliminarPendiente(${pendiente.index})">Eliminar</button>
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

// Inicializar la pagina de la pagina
document.addEventListener('DOMContentLoaded', () => {
    cargarPendientes();
    inicializarFiltro();
    renderizarPendientes();
});


// Variables del formulario
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

    // Boton de cancelar
    btnCancelar.addEventListener('click', (e) => {
        e.preventDefault();
        toDoList();
    });

    // Boton de guardar
    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        guardarNuevoPendiente();
    });

    // Enviar del formulario
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarNuevoPendiente();
    });
}

// Cargar pendiente a editar
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

// Ir editarPendiente
function irEditarPendiente(index) {
    if (window.location.pathname.includes('/html/')) {
        window.location.href = `editarPendiente.html?index=${index}`;
    } else {
        window.location.href = `html/editarPendiente.html?index=${index}`;
    }
}
