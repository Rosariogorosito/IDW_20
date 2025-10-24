import { getMedicos, crearMedico, modificarMedico, eliminarMedico, getMedicoById } from './adminScript.js';

const tbody = document.getElementById('listaMedicosBody');
const form = document.getElementById('medicoForm');
const modalElement = document.getElementById('medicoModal');
const modal = new bootstrap.Modal(modalElement);
const btnGuardar = document.getElementById('btnGuardar');
const modalTitle = document.getElementById('medicoModalLabel');
const btnCrearMedico = document.getElementById('btnCrearMedico');

const renderizarTabla = () => {
    tbody.innerHTML = '';
    getMedicos().forEach(medico => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${medico.id}</td>
            <td><img src="${medico.imagen_src || 'https://via.placeholder.com/50'}" alt="${medico.nombre}" class="img-fluid" style="max-width:50px;"></td>
            <td>${medico.nombre}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.matricula}</td>
            <td>$${Number(medico.precio).toLocaleString('es-AR')}</td>
            <td>
                <button class="btn btn-info btn-sm me-1 btn-ver"><i class="fas fa-eye"></i></button>
                <button class="btn btn-warning btn-sm me-1 btn-modificar"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm btn-eliminar"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);

        tr.querySelector('.btn-ver').addEventListener('click', () => cargarFormulario('visualizar', medico.id));
        tr.querySelector('.btn-modificar').addEventListener('click', () => cargarFormulario('modificar', medico.id));
        tr.querySelector('.btn-eliminar').addEventListener('click', () => confirmarEliminar(medico.id, medico.nombre));
    });
};

btnCrearMedico.addEventListener('click', () => cargarFormulario('crear'));

window.cargarFormulario = (accion, id = null) => {
    form.reset();
    const medico = id ? getMedicoById(id) : {};
    const soloLectura = accion === 'visualizar';

    document.getElementById('medicoId').value = id || '';
    modalTitle.textContent = accion === 'crear' ? 'Crear Nuevo Médico'
        : accion === 'modificar' ? `Modificar Médico: ${medico.nombre}`
        : `Detalle de Médico: ${medico.nombre}`;

    btnGuardar.textContent = accion === 'crear' ? 'Crear Médico' : 'Guardar Cambios';
    btnGuardar.classList.toggle('d-none', soloLectura);

    if (id && medico) {
        document.getElementById('nombre').value = medico.nombre;
        document.getElementById('especialidad').value = medico.especialidad;
        document.getElementById('matricula').value = medico.matricula;
        document.getElementById('precio').value = medico.precio;
        document.getElementById('obras_sociales').value = medico.obras_sociales;
        document.getElementById('descripcion_adicional').value = medico.descripcion_adicional;
        document.getElementById('imagen_file').value = '';
    }

    Array.from(form.elements).forEach(el => {
        if (el.id !== 'medicoId') el.disabled = soloLectura;
    });

    modal.show();
};

form.addEventListener('submit', e => {
    e.preventDefault();

    const id = document.getElementById('medicoId').value ? parseInt(document.getElementById('medicoId').value) : null;

    const datos = {
        nombre: document.getElementById('nombre').value.trim(),
        especialidad: document.getElementById('especialidad').value.trim(),
        matricula: document.getElementById('matricula').value.trim(),
        precio: Number(document.getElementById('precio').value),
        obras_sociales: document.getElementById('obras_sociales').value.trim(),
        descripcion_adicional: document.getElementById('descripcion_adicional').value.trim(),
        imagen_src: id ? getMedicoById(id).imagen_src : 'https://via.placeholder.com/50'
    };

    const archivo = document.getElementById('imagen_file').files[0];

    const guardar = (imagen) => {
        if (imagen) datos.imagen_src = imagen;

        if (id) {
            modificarMedico(id, datos);
            alert(`Médico ${datos.nombre} modificado correctamente.`);
        } else {
            crearMedico(datos);
            alert(`Médico ${datos.nombre} creado correctamente.`);
        }

        modal.hide();
        renderizarTabla();
    };

    if (archivo) {
        const reader = new FileReader();
        reader.onload = e => guardar(e.target.result);
        reader.readAsDataURL(archivo);
    } else {
        guardar();
    }
});

window.confirmarEliminar = (id, nombre) => {
    if (confirm(`¿Eliminar al médico ${nombre}?`)) {
        eliminarMedico(id);
        renderizarTabla();
    }
};

document.addEventListener('DOMContentLoaded', renderizarTabla);
