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
        // Obtener valores iniciales y crear arreglo de datos
        let cn = indicadores.poblacionInicial;
        let ca = indicadores.poblacionInicial;
        let chartDatos = [];
        // Insertar caso base en el arreglo
        chartDatos.push({
          date: (new Date().getFullYear()).toString(),
          crecimientoNatural: cn,
          crecimientoAbsoluto: ca
        });
        // Calcular años subsiguientes y guardarlos en el arreglo
        for (let i = 1; i <= indicadores.anios; i++) {
          cn = parseFloat(( cn * (1+(indicadores.tasaNatalidad/100)-(indicadores.tasaMortalidad/100)) ).toFixed(0));
          ca = parseFloat(( ca * (1+(indicadores.tasaNatalidad/100)-(indicadores.tasaMortalidad/100)+(indicadores.tasaInmigracion/100)-(indicadores.tasaEmigracion/100)) ).toFixed(0));
          chartDatos.push({
            date: (new Date().getFullYear() + i).toString(),
            crecimientoNatural: cn,
            crecimientoAbsoluto: ca
          });
        }
        // Actualizar chartdiv
        console.log(chartDatos);
        chart.data = chartDatos;
        // Mostrar o volver visibles las series (lineas del grafico)
        chart.series.values[0].show();
        chart.series.values[1].show();
        // Actualizar porcentaje de crecimiento poblacional (final / inicial)
        line.data = [
            {poblacion: 'Inicial',personas: (indicadores.poblacionInicial/indicadores.poblacionInicial)*100},
            {poblacion: 'Natural',personas: (chart.data[chart.data.length-1].crecimientoNatural/indicadores.poblacionInicial)*100},
            {poblacion: 'Absoluto',personas: (chart.data[chart.data.length-1].crecimientoAbsoluto/indicadores.poblacionInicial)*100}
        ];
    }
    else {
        console.log('Formulario inválido');
    }
}

/**
 * Reiniciar indicadores para el cálculo de crecimiento poblacional.
 */
function restablecer(){
    // Limpiar campos de enetrada
    $('input').trigger('reset');
    // Establecer valores vacios a los campos
    $('input').val('');
    // Estabelcer en cero los indicadores de tasas de emigracion e inmigracion
    $('#txt-em').val(0);
    $('#txt-in').val(0);
    // Remover las clases de validacion
    $('input').removeClass("is-valid");
    $('input').removeClass("is-invalid");
    // Ocultar las series (lineas del grafico) de CP a traves del tiempo
    chart.series.values[0].hide();
    chart.series.values[1].hide();
    // Nuevo conjunto de valores al grafico de porcentaje de CP
    // Establecer en cero los porcentajes de crecimiento natural y absoluto
    line.data = [{poblacion: "Inicial", personas: 1},
    {poblacion: "Natural", personas: 0},
    {poblacion: "Absoluto", personas: 0}];
}

/**
 * Validar si un campo requerido en un formulario está vacío.
 * @param {string} id Identificador de un campo
 * @return {boolean} true || false
 */
function validarCampoVacio(id){
    if(document.getElementById(id).value == ''){
        document.getElementById(id).classList.remove('is-valid');
        document.getElementById(id).classList.add('is-invalid');
        return false;
    } else {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(id).classList.add('is-valid');
        return true;
    }
}