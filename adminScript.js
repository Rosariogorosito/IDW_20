import { DOCTORES_INICIALES } from './doctoresData.js';

// --- LocalStorage ---

// --- Inicia ---
const inicializarLocalStorage = () => {
    if (localStorage.getItem('medicos') === null) {
        localStorage.setItem('medicos', JSON.stringify(DOCTORES_INICIALES));
    }
}

/**
 * (Listar)
 * @returns {Array} Lista de objetos de médicos.
 */
export const getMedicos = () => {
    inicializarLocalStorage(); 
    return JSON.parse(localStorage.getItem('medicos'));
};

/**
 * Guarda la lista de doctor 
 * @param {Array} medicos 
 */

const guardarMedicos = (medicos) => {
    localStorage.setItem('medicos', JSON.stringify(medicos));
};

// --- Funciones CRUD ---

/**
 * busca el doctor 
 * @param {number} id El ID del doc.
 * @returns {Object|undefined} 
 */
export const getMedicoById = (id) => {
    const medicos = getMedicos();
    return medicos.find(m => m.id === id);
};

/**
 * Agrega un nuevo doct
 * @param {Object} nuevoMedico Los datos del nuevo.
 */
export const crearMedico = (nuevoMedico) => {
    const medicos = getMedicos();
    
    // Generar un nuevo ID único
    const nuevoId = medicos.length > 0 
        ? Math.max(...medicos.map(m => m.id)) + 1 
        : 1;

    const medicoConId = { 
        id: nuevoId, 
        ...nuevoMedico,
        precio: Number(nuevoMedico.precio) // nuevo precio
    };

    medicos.push(medicoConId);
    guardarMedicos(medicos);
};

/** 
  // Modifica y o catualiza.
  @param {number} id 
  @param {Object} datosActualizados 
 */
export const modificarMedico = (id, datosActualizados) => {
    const medicos = getMedicos();
    const index = medicos.findIndex(m => m.id === id);

    if (index !== -1) {
        medicos[index] = { 
            ...medicos[index], 
            ...datosActualizados, 
            precio: Number(datosActualizados.precio) 
        };
        guardarMedicos(medicos);
        return medicos[index];
    }
    return null;
};

/**
 * para eliminar un doc con ID.
 * @param {number} id 
 * @returns {boolean} True si fue eliminado, false si no se encontro.
 */
export const eliminarMedico = (id) => {
    let medicos = getMedicos();
    const longitudInicial = medicos.length;
    
    // Filtra y crea un nuevo array sin el doctr con el ID 
    medicos = medicos.filter(m => m.id !== id);
    
    if (medicos.length < longitudInicial) {
        guardarMedicos(medicos);
        return true;
    }
    return false;
};