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

var indicadores;
var pointer;
var historial= [];
console.log("obteniendo historial 1",historial)
historial = JSON.parse(localStorage.getItem('registro')) || [];
console.log("obteniendo historial 2",historial)
console.log(historial)

/**
 * Calcular el crecimiento natural y absoluto de cualquier población
 * a través del tiempo. Los indicadores a considerar son: población
 * inicial, años a proyectar, tasa de natalidad, tasa de motalidad y
 * saldo migratorio (tasa de emigrantes y tasa de inmigrantes).
 */
function calcularCP(config) {
    if(config.flag){
        document.getElementById('txt-pi').value=historial[config.id].poblacionInicial;
        document.getElementById('txt-an').value=historial[config.id].anios;
        document.getElementById('txt-tn').value=historial[config.id].tasaNatalidad;
        document.getElementById('txt-tm').value=historial[config.id].tasaMortalidad;
        document.getElementById('txt-em').value=historial[config.id].tasaEmigracion;
        document.getElementById('txt-in').value=historial[config.id].tasaInmigracion;
    }
    boolPi = validarCampoVacio('txt-pi');
    boolAn = validarCampoVacio('txt-an');
    boolTn = validarCampoVacio('txt-tn');
    boolTm = validarCampoVacio('txt-tm');
    boolEm = validarCampoVacio('txt-em');
    boolIn = validarCampoVacio('txt-in');
    if (boolPi && boolAn && boolTn && boolTm && boolEm && boolIn || config.flag) {
        if(!config.flag){
            indicadores = {
                nombre:"",
                date : "",
                poblacionInicial: parseFloat(document.getElementById('txt-pi').value),
                anios: parseFloat(document.getElementById('txt-an').value),
                tasaNatalidad: parseFloat(document.getElementById('txt-tn').value),
                tasaMortalidad: parseFloat(document.getElementById('txt-tm').value),
                tasaEmigracion: parseFloat(document.getElementById('txt-em').value),
                tasaInmigracion: parseFloat(document.getElementById('txt-in').value)
            };
    
        }else{
            indicadores = {
                nombre:historial[config.id].nombre,
                date : historial[config.id].date,
                poblacionInicial:  parseFloat(historial[config.id].poblacionInicial),
                anios:  parseFloat(historial[config.id].anios),
                tasaNatalidad:  parseFloat(historial[config.id].tasaNatalidad),
                tasaMortalidad: parseFloat(historial[config.id].tasaMortalidad),
                tasaEmigracion:  parseFloat(historial[config.id].tasaEmigracion),
                tasaInmigracion: parseFloat(historial[config.id].tasaInmigracion)
            };
            
        }
       
        
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

/**
 * Generador de ventanas modales.
 * @param {string} id Identificador de ventana modal deseada
 * @param {string} data Información a mostrar
 */
function ventanaModal(id, data) {
    data=data || {};                            // si no existe data, creamos un objeto vacío para evitar posteriores errores
    id="modal-"+id;        
    if(document.getElementById(id)){

    }                   // añadimos "modal-" a la id para evitar conflictos con otros elementos
    if (document.getElementById(id)==null) {    // crear elemento si no existe
      var d=document.createElement("div");
      d.className="jmgmodal";                   // clase para estilos con CSS
      d.id=id;
      // creamos el panel interior
      var p=document.createElement("div");
      p.className="panel";
      // creamos los componentes de la cabecera: título y botón de cerrar
      var t=document.createElement("div");
      t.className="title";
      var cl=document.createElement("div");
      cl.className="close";
      cl.innerHTML='&times;';
      // cerramos y vaciamos la modal al pulsar el botón X
      cl.addEventListener('click',function(ev) {
        ev.preventDefault();
        var dTop=this.parentNode.parentNode;
        dTop.classList.remove("visible");
        dTop.querySelector(".panel .content").innerHTML='';
      });
      // creamos la caja donde se mostrará el contenido
      var ct=document.createElement("div");
      ct.className="content";
      ct.id="content-"+id;

      
      var f=document.createElement("div");
      /* finalmente, añadimos "t", "cl" y "ct" (título, botón cerrar y div contenido) a "p" (panel interior), 
      éste lo añadimos a "d" (div principal, para oscurecer el fondo), y "d" lo añadimos al body de la página */
      p.appendChild(t);p.appendChild(cl);p.appendChild(ct);d.appendChild(p);
      document.body.appendChild(d);
    }
    // guardamos cada componente en una variable
    var mod=document.getElementById(id),
    p=mod.querySelector(".panel"),
    t=mod.querySelector(".panel .title"),
    ct=mod.querySelector(".panel .content");
    // rellenamos los datos
    t.innerHTML=data.title || '';
    ct.innerHTML=data.content || '';
    // comprobamos que el número es válido antes de añadirlo
    if (!isNaN(data.width)) p.style.maxWidth=data.width+'px';
    if (!isNaN(data.height)) p.style.maxHeight=data.height+'vh';
    /* esperamos unos milisegundos para que se genere, y añadimos la clase .visible para mostrarla desde CSS */
    setTimeout(function(){
      mod.classList.add("visible");
    },50);
    console.log(data.action)
     if(data.action == 2){
        generateContent()
     }else{
         if(data.action == 3){
             generateSaveSim()
         }else{
             if(data.action == 1){
                 generateInfo()
                
             }
         }
     }
     
  }

  var controlActive=false
  function activeItem(){
      if(!controlActive){
          controlActive=true
          for(let i=0; i<historial.length;i++){
              if(i!=poin){
                document.getElementById(`item_${i}`).classList.remove('item-content-active');
              }
          }
          document.getElementById(`item_${poin}`).classList.add('item-content-active');
      }else{
        controlActive=false;
            document.getElementById(`item_${poin}`).classList.remove('item-content-active');
      }
    
  }
  function generateContent(){
    document.getElementById("content-modal-historial").innerHTML="";
    for(let i=0; i<historial.length;i++){
        document.getElementById("content-modal-historial").innerHTML+=` <div class="item-list" onclick="selectItem(${i})" id="">
        <div class="item-content item row" id="item_${i}">
            <div class="col-6 content-element1">
                <span>${historial[i].nombre}</span>
            </div>
            <div class="col-4 content-element2">
                <span>${historial[i].date}</span>
            </div>
            <div class="col-2" >
                <button class="content-button" onclick="editRecord(${i})">
                <i class="fas fa-edit"></i></button>
        </div>
        <div class="content-edit mt-2 d-none" id="edit-${i}">
            <div class="row">
                <div class="col-4 mb-3">
                    <span class="sp-form">Población inicial</span>
                   <input type="number" placeholder="" class="form-control" id="inicial-p-${i}">
                </div>
                <div class="col-4  mb-3">
                    <span class="sp-form">Años a proyectar</span>
                    <input type="number" placeholder="" class="form-control"  id="anios-p-${i}">
                 </div>
                 <div class="col-4  mb-3">
                 <span class="sp-form">Tasa natalidad</span>
                    <input type="number" placeholder="" class="form-control" id="natalidad-p-${i}">
                 </div>
            </div>
            <div class="row">
                <div class="col-4  mb-3">
                     <span class="sp-form">Tasa mortalidad</span>
                    <input type="number" placeholder="" class="form-control" id="mortalidad-p-${i}">
                 </div>
                <div class="col-4  mb-3">
                    <span class="sp-form">Tasa emigración</span>
                    <input type="number" placeholder="" class="form-control" id="emigracion-p-${i}">
                </div>
                <div class="col-4  mb-3">
                    <span class="sp-form">Tasa inmigración</span>
                    <input type="number" placeholder="" class="form-control" id="inmigracion-p-${i}">
                </div>
            </div>
            <div class="row">
            <div class="col-12">
                <span class="sp-form">Nombre del escenario</span>
                <input type="text" placeholder="" class="form-control" id="name-sim-${i}">
            </div>
            </div>
            <button class="button__main button__green button-save-2" onclick="updateSimulation(${i})">
             Modificar
            </button>
        </div>
        </div>
        `;
    }

    document.getElementById("content-modal-historial").innerHTML+=`<button class="button__main button__blue--dark  button-save-2" onclick="loadSimulation()">
    Cargar
   </button>`
    
  }

  function  generateSaveSim(){
    document.getElementById("content-modal-guardar").innerHTML="";
    document.getElementById("content-modal-guardar").innerHTML+=`
    <input type="text" class="form-control" style="margin-top:2rem" placeholder="Nombre del escenario" id="name-simulation">
    <button class="button__main button__blue--dark button-save-2" onclick="saveSimulation()">
        Guardar
    </button>
    `;
  }

  function saveSimulation(){
        indicadores.nombre=document.getElementById("name-simulation").value+" "+"| 2020-"+parseFloat(indicadores.anios+2020);
        indicadores.date=generateDate()
        console.log(indicadores)
        historial.push(indicadores)
        indicadores = {}
        localStorage.setItem('registro', JSON.stringify(historial));

        restablecer()
  }

  function generateDate(){
    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    h = n.getHours();
    ms = n.getMinutes();
    d = n.getDate();
    return  d + "/" + m + "/" + y + " "+h+ms 
  }


  
  var flag = false;
  function editRecord(id){
    if(!flag){
        flag=true;
        document.getElementById(`edit-${id}`).classList.remove("d-none");
        document.getElementById(`edit-${id}`).classList.add("d-block");
        setDataEdit(id)
    }else{
        flag=false;
        document.getElementById(`edit-${id}`).classList.remove("d-block");
        document.getElementById(`edit-${id}`).classList.add("d-none")
    }
    
  }

  function updateSimulation(id){
    indicadores_edit = {
        nombre: document.getElementById(`name-sim-${id}`).value+" "+"2020-"+2020+parseFloat(document.getElementById(`anios-p-${id}`).value),
        date : generateDate(),
        poblacionInicial: parseFloat(document.getElementById(`inicial-p-${id}`).value),
        anios: parseFloat(document.getElementById(`anios-p-${id}`).value),
        tasaNatalidad: parseFloat(document.getElementById(`natalidad-p-${id}`).value),
        tasaMortalidad: parseFloat(document.getElementById(`mortalidad-p-${id}`).value),
        tasaEmigracion: parseFloat(document.getElementById(`emigracion-p-${id}`).value),
        tasaInmigracion: parseFloat(document.getElementById(`inmigracion-p-${id}`).value)
    };
    historial[id]=indicadores_edit;
    localStorage.setItem('registro', JSON.stringify(historial));
    indicadores_edit={}
    editRecord(id);

  }


  function  setDataEdit(id){
    document.getElementById(`name-sim-${id}`).value=historial[id].nombre;
    document.getElementById(`inicial-p-${id}`).value=historial[id].poblacionInicial;
    document.getElementById(`natalidad-p-${id}`).value=historial[id].tasaNatalidad;
    document.getElementById(`anios-p-${id}`).value=historial[id].anios;
    document.getElementById(`mortalidad-p-${id}`).value=historial[id].tasaMortalidad;
    document.getElementById(`emigracion-p-${id}`).value=historial[id].tasaEmigracion;
    document.getElementById(`inmigracion-p-${id}`).value=historial[id].tasaInmigracion;
    
  }

  function selectItem(id){
    poin=id;
    activeItem()
  }

  function loadSimulation(){
      console.log(poin)
      let config={
          flag:true,
          id:poin
      }
    calcularCP(config)
  }

  function  generateInfo(){
    document.getElementById("content-modal-ayuda").innerHTML+=`
    <p class="text_info ">
    El siguiente modelo de crecimiento poblacional proyecta la cantidad de habitantes en base al crecimiento poblacional y el crecimiento poblacional absoluto utilizando un algoritmo recursivo que permitirá realizar la proyección en años en base al resultado del crecimiento del año anterior y siguiendo la misma tasa de natalidad, mortalidad, emigración e inmigración.
    </p>
    <p>
    <strong>Modelo Empleado</strong>
    <img class="img_model" src="img/model.JPG">  </p>`
  }

  
