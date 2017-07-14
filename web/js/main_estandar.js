var handlebars = require('handlebars')

//Plantilla para un item (usuario)
var templateItem = `
   <div id="usuario_{{_id}}">
      <span id="datos_usuario_{{_id}}">
         <strong>{{name}}</strong>
      </span>
      <a id="enlace_{{_id}}" href="javascript:verDetalles('{{_id}}')">Detalles</a>
      <a href="javascript:modalEditar('{{_id}}')" title="Editar"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
      <a href="javascript:borrar('{{_id}}')" title="Borrar"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
   </div>
`

//Plantilla para la lista de usuarios
var templateLista = `
  <div class="panel panel-default">
    <div class="panel-body">
       <h2>Lista de usuarios</h2>
       <hr>
       <br/>
       {{#.}}
         ${templateItem}
       {{/.}}
   </div>
   <div class="panel-footer">
      <a href="http://localhost:3000/web" title="Home">Ir atrás</a>
   </div>
 </div>
`

//Plantilla para los detalles de un usuario
var templateDetalles = `
  <span id="detalles_{{_id}}">
    Id: {{_id}}, Login: {{email}}
  </span>
`

//Plantilla para un modal de editar un usuario
var templateEditar = `
  <div class="modal fade" id="modalEditar">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
          </button>
          <h4>Edita el usuario</h4>
        </div>
        <form>
          <div class="modal-body">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" class="form-control" id="nombre" value="" required>
            </div>
          <!--  <div class="form-group">
              <label for="pwd">Contraseña nueva:</label>
              <input type="password" placeholder="Dejar en blanco para mantener la actual" class="form-control" id="pwd">
            </div> -->
          </div>
          <div class="modal-footer">
            <a role="button" id="button_editar" class="btn btn-success" href="">Editar</a>
            <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
`

//Plantilla para un modal que muestra un mensaje
var templateMensaje = `
    <div class="modal fade" id="modalMensaje">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <h4 id="mensaje"></h4>
          </div>
        </div>
      </div>
    </div>

`
//Compilamos las plantillas handlebars. Esto genera funciones a las que llamaremos luego
var tmpl_lista_compilada = handlebars.compile(templateLista)
var tmpl_item_compilada = handlebars.compile(templateItem)
var tmpl_detalles_compilada = handlebars.compile(templateDetalles)
var tmpl_editar_compilada = handlebars.compile(templateEditar)
var tmpl_mensaje_compilada = handlebars.compile(templateMensaje)

document.addEventListener('DOMContentLoaded', function(){
  //Si no se ha iniciado sesion muestra un mensaje de error
  if(localStorage.getItem('token') == undefined) {
    document.getElementById('usuarios').innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> Debe iniciar sesión primero. <a href="http://localhost:3000/web">Login</a></div>';
  } else {
    	console.log("Página cargada!: " +  new Date().toLocaleString())
    	//Obtenemos la lista de usuarios mediante AJAX
      $.ajax
              ({
                type: "GET",
                url: 'http://localhost:3000/api/users?limit=5',
                headers: {
                  'Content-Type': 'application/json'
                },
                dataType: "json",
                beforeSend: function (xhr) {
                  xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
                },
                success: function (respuesta){
                  //Introducimos la lista de usuarios obtenida en el div 'usuarios'
                  var divItem = document.getElementById('usuarios')
                	var listaHTML = tmpl_lista_compilada(respuesta.data)
                	divItem.innerHTML = listaHTML
                  //Introducimos los modals (incialmente no visibles)
                  var modalHTML = tmpl_editar_compilada()
                  var modalMensajeHTML = tmpl_mensaje_compilada()
                  divItem.insertAdjacentHTML('beforeend', modalHTML)
                  divItem.insertAdjacentHTML('beforeend', modalMensajeHTML)
                },
                error: function (respuesta){
                  	mensaje('Ha ocurrido un error');
                }
              });
    }
})

//Metodo para obtener los detalles de un usuario (id y login)
function verDetalles(id) {
	$.ajax
          ({
            type: "GET",
            url: 'http://localhost:3000/api/users/'+id,
            headers: {
              'Content-Type': 'application/json'
            },
            dataType: "json",
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            success: function (respuesta){
            	//creamos un objeto JS con los datos de los detalles a mostrar
      				var datos = {_id: respuesta.user._id, email: respuesta.user.name}
      				var datosHTML = tmpl_detalles_compilada(datos)
              //Obtenemos el div correspondiente al usuario y introducimos los detalles en el
      				var divItem = document.getElementById('datos_usuario_'+id)
      				divItem.insertAdjacentHTML('beforeend', datosHTML)
      				//TEDIOSO: ahora hay que cambiar el enlace "ver detalles" por uno "ocultar"
      				//hemos hecho que el HTML del enlace tenga un id con "enlace_" y el id del item
      				var enlaceDetalles = document.getElementById('enlace_'+id)
      				//Cambiamos a dónde apunta el enlace
      				enlaceDetalles.href = 'javascript:ocultarDetalles(\"'+id+'\")'
      				//cambiamos el texto del enlace
      				enlaceDetalles.innerHTML = 'Ocultar detalles'
            },
            error: function (respuesta){
              	mensaje('Ha ocurrido un error');
            }
          });
}

//Metodo para borrar un usuario
function borrar(id) {
  $.ajax
          ({
            type: "DELETE",
            url: 'http://localhost:3000/api/users/'+id,
            headers: {
              'Content-Type': 'application/json'
            },
            dataType: "json",
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            success: function (respuesta){
              //Borramos el usuario de la vista
				      $('#usuario_'+id).remove();
              //Si se ha borrado al propio usuario hay que hacer logout tambien
              if(id == localStorage.getItem('id')) {
                localStorage.clear()
                mensaje('Has borrado tu cuenta');
                //Redirreciona a la pagina principal
                setTimeout(function(){ window.location = 'http://localhost:3000/web'; }, 2000);
              } else {
                mensaje('Usuario borrado');
              }
            },
            error: function (xhr){
              	if(xhr.status == 403) {
                  mensaje('No tienes permisos para la acción');
                } else {
                  mensaje('Ha ocurrido un error');
                }
            }
          });
}

//Metodo para editar un usuario
function editar(id) {
  //Se crea un objeto con los datos introducidos (contraseña opcional)
  var datos = new Object();
  datos.name = document.getElementById('nombre').value;
  if(datos.name == '') {
    mensaje('Introduce un nombre válido');
  } else {
    /*var contrasenya = document.getElementById('pwd').value;
    if(contrasenya != '') {
      datos.password = contrasenya
    }*/
    $.ajax
            ({
              type: "PUT",
              url: 'http://localhost:3000/api/users/'+id,
              headers: {
                'Content-Type': 'application/json'
              },
              dataType: "json",
              data: JSON.stringify(datos),
              beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: function (respuesta){
                //Se actualiza la vista
                document.getElementById('datos_usuario_'+id).innerHTML = '<strong>'+datos.name+'</strong>';
                //Se cierra el modal y se muestra un mensaje de exito
                $('#modalEditar').modal('hide');
                mensaje('Usuario editado');
              },
              error: function (xhr){
                  $('#modalEditar').modal('hide');
                  if(xhr.status == 403) {
                    mensaje('No tienes permisos para la acción');
                  } else {
                    mensaje('Ha ocurrido un error');
                  }
              }
            });
  }
}

//Metodo que hace visible el modal de editar y obtiene el nombre del usuario
function modalEditar(id) {
  $.ajax
          ({
            type: "GET",
            url: 'http://localhost:3000/api/users/'+id,
            headers: {
              'Content-Type': 'application/json'
            },
            dataType: "json",
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            success: function (respuesta){
              //Asignamos el valor del nombre al campo de entrada y el href del boton
              document.getElementById('nombre').value = respuesta.user.name;
              document.getElementById('button_editar').href = 'javascript:editar(\"'+id+'\")';
              $('#modalEditar').modal('show');
            },
            error: function (respuesta){
                mensaje('Ha ocurrido un error');
            }
          });
}

//Metodo que hace visible el modal con un mensaje
function mensaje(m) {
  document.getElementById('mensaje').innerHTML = m;
  $('#modalMensaje').modal('show');
}

//llamada cuando pulsamos en un enlace "Ocultar Detalles"
function ocultarDetalles(id) {
  //forma sencilla de eliminar un fragmento HTML, asignarle la cadena vacía
  //usamos outerHTML porque incluye la propia etiqueta, innerHTML sería solo el contenido
  document.getElementById('detalles_'+id).outerHTML = ''
  //TEDIOSO: volvemos a poner el enlace en modo "mostrar detalles"
  document.getElementById('enlace_'+id).href = 'javascript:verDetalles(\"'+id+'\")'
  document.getElementById('enlace_'+id).innerHTML = 'Detalles'
}

window.editar = editar
window.modalEditar = modalEditar
window.verDetalles = verDetalles
window.ocultarDetalles = ocultarDetalles
window.borrar = borrar
