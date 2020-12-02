/**
 * @fileoverview    Funciones principales para calcular crecimiento poblacional
 *                  y validar si los campos están correctos.
 * @version         1.0
 * @author          Gabriela Yaneth Cabrera, Walter Rivera H, Víctor Josué Bueso
 * @copyright       Derechos reservados © 2020
 */

$(document).ready(()=>{
    // Validar campos cuando su valor cambie, eventos keypress/change
    $('input').on('input', (e) => {
        validarCampoVacio(e.target.id);
    });
    // Validar campos si han sido enfocados
    $('input').focusout( (e) => {
        validarCampoVacio(e.target.id);
    });
});

/**
 * Calcular el crecimiento natural y absoluto de cualquier población
 * a través del tiempo. Los indicadores a considerar son: población
 * inicial, años a proyectar, tasa de natalidad, tasa de motalidad y
 * saldo migratorio (tasa de emigrantes y tasa de inmigrantes).
 * @return {array} Arreglo de JSONs con proyecciones anuales
 */
function calcularCP() {
    boolPi = validarCampoVacio('txt-pi');
    boolAn = validarCampoVacio('txt-an');
    boolTn = validarCampoVacio('txt-tn');
    boolTm = validarCampoVacio('txt-tm');
    boolEm = validarCampoVacio('txt-em');
    boolIn = validarCampoVacio('txt-in');
    if (boolPi && boolAn && boolTn && boolTm && boolEm && boolIn) {
        let indicadores = {
            poblacionInicial: parseFloat(document.getElementById('txt-pi').value),
            anios: parseFloat(document.getElementById('txt-an').value),
            tasaNatalidad: parseFloat(document.getElementById('txt-tn').value),
            tasaMortalidad: parseFloat(document.getElementById('txt-tm').value),
            tasaEmigracion: parseFloat(document.getElementById('txt-em').value),
            tasaInmigracion: parseFloat(document.getElementById('txt-in').value)
        };
        console.log(indicadores);
    } else {
        console.log('Inválido');
    }
    return null;
}

/**
 * Validar si un campo requerido en un formulario está vacío.
 * @param {string} id Identificador de un campo
 * @return {boolean} true || false
 */
function validarCampoVacio(id){
    if(document.getElementById(id).value == ""){
        document.getElementById(id).classList.remove("is-valid");
        document.getElementById(id).classList.add("is-invalid");
        return false;
    } else {
        document.getElementById(id).classList.remove("is-invalid");
        document.getElementById(id).classList.add("is-valid");
        return true;
    }
}