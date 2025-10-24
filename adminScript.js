import { DOCTORES_INICIALES } from './doctoresData.js';

const inicializarLocalStorage = () => {
    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(DOCTORES_INICIALES));
    }
};
inicializarLocalStorage();

const guardarMedicos = (medicos) => {
    localStorage.setItem('medicos', JSON.stringify(medicos));
};

export const getMedicos = () => JSON.parse(localStorage.getItem('medicos')) || [];

export const getMedicoById = (id) => getMedicos().find(m => m.id === id);

export const crearMedico = (nuevoMedico) => {
    const medicos = getMedicos();
    const nuevoId = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;
    medicos.push({ id: nuevoId, ...nuevoMedico, precio: Number(nuevoMedico.precio) });
    guardarMedicos(medicos);
};

export const modificarMedico = (id, datosActualizados) => {
    const medicos = getMedicos();
    const index = medicos.findIndex(m => m.id === id);
    if (index !== -1) {
        medicos[index] = { ...medicos[index], ...datosActualizados, precio: Number(datosActualizados.precio) };
        guardarMedicos(medicos);
        return medicos[index];
    }
    return null;
};

export const eliminarMedico = (id) => {
    let medicos = getMedicos();
    const longitudInicial = medicos.length;
    medicos = medicos.filter(m => m.id !== id);
    if (medicos.length < longitudInicial) {
        guardarMedicos(medicos);
        return true;
    }
    return false;
};
