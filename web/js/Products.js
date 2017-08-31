var React = require('react')
var Glyphicon = require('react-bootstrap/lib/Glyphicon')
var Button = require('react-bootstrap/lib/Button')
var Table = require('react-bootstrap/lib/Table')
var EditProduct = require('./EditProduct')

var Products = React.createClass({
	getInitialState: function() {
        return {
            after: null,                      //corresponde a la siguiente id a obtener
            before: null,                     //corresponde a la anterior id a obtener
            button_siguiente: true,           //estado del boton siguiente (validacion)
            button_anterior: true,            //estado del boton anterior (validacion)
            editarID: null,                   //id del usuario a editar (estado de visibilidad del modal)
            crear: false,                     //estado de visibilidad del modal de crear
        }
    },
    actualizarData: function(direccion) {
      var url_ajax = "http://localhost:3000/api/users/"+localStorage.getItem('id')+"/products?limit="+this.props.limit;

			//Si se ha apretado en el boton siguiente y existe una id siguiente a obtener
      if(direccion === 'after' && this.state.after != null) {
    		url_ajax += "&after=" + this.state.after;
      //Si se ha apretado en el boton anterior y existe una id anterior a obtener
			} else if(direccion === 'before' && this.state.before != null) {
    		url_ajax += "&before=" + this.state.before;
      //Para el caso de crear un entrenamiento nuevo, se obtiene la ultima pagina de resultados para ver el nuevo
    	} else if(direccion === 'last') {
        url_ajax += "&before=last";
      }
			$.ajax
          ({
            type: "GET",
            url: url_ajax,
            headers: {
              'Content-Type': 'application/json'
            },
            dataType: "json",
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            success: function (res){
              //Si no se han obtenido resultados se desactiva el boton (anterior o siguiente)
            	if(res.paging === undefined) {
            		if(direccion === 'after') {
            			this.setState({button_siguiente: false})
            		}
            		if(direccion === 'before') {
            			this.setState({button_anterior: false})
            		}
                //Si es la primera carga de resultados y no devuelve resultados (si no se quedan los datos anteriores)
                if(direccion === '') {
                  this.props.setData(res);
                }
            	} else {
                //Se actualizan los estados
                this.props.setData(res.data);
									this.setState({
										before: res.paging.cursors.before,
										after: res.paging.cursors.after,
										button_anterior: !(res.data.length != this.props.limit && direccion === 'before') && direccion !== '',
										button_siguiente: !(res.data.length != this.props.limit && direccion === 'after')
									});
								}
            }.bind(this),
            error: function (res){
							if(this.res.data.length === 0){
								this.props.mensaje('No hay productos por ahora, ¡añádelos!');
							} else {
								this.props.mensaje('Ha ocurrido un error');
							}
            }.bind(this)
          });
    },
		deleteProduct(id) {
			//Peticion AJAX para el borrado
			$.ajax
					({
						type: "DELETE",
						url: 'http://localhost:3000/api/products/'+id,
						headers: {
							'Content-Type': 'application/json'
						},
						dataType: "json",
						beforeSend: function (xhr) {
							xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
						},
						success: function (res){
							//Se borra el entrenamiento de data
							var list = this.props.data;
							for(var i = list.length - 1; i >= 0; i--) {
								if(list[i]._id === id) {
									 list.splice(i, 1);
									 break;
								}
							}
							this.props.setData(list);
							this.props.mensaje('Producto borrado');
						}.bind(this),
						error: function (res){
							this.props.mensaje('Ha ocurrido un error');
						}.bind(this)
					});
		},
		//Metodos para abrir el modal (editar o crear)
    editProduct(id) {
      this.setState({editarID: id})
    },
		createProduct() {
			this.setState({crear: true})
		},
		editProductSuccess(title,description, price, categoryproduct) {
      var list = this.props.data;
      for(var i = list.length - 1; i >= 0; i--) {
            if(list[i]._id === this.state.editarID) {
              list[i].title = title;
							list[i].description = description;
							list[i].price = price;
							list[i].categoryproduct = categoryproduct;
              break;
            }
      }
      this.props.setData(list);
      this.setState({editarID: null})
    },
		//Despues de la peticion AJAX se carga la ultima pagina de resultados
    createProductSuccess() {
      this.crearCerrar()
      this.actualizarData('') //Iba last
    },
		editarCerrar() {
			this.setState({editarID: null})
		},
		crearCerrar() {
			this.setState({crear: false})
		},
		//Primera carga de datos
    componentDidMount: function() {
			this.actualizarData('');
    },
    //Carga de datos anteriores
    handleClickAnterior: function() {
    	this.actualizarData('before');
    },
    //Carga de datos siguientes
    handleClickSiguiente: function() {
    	this.actualizarData('after');
    },
		//Devuelve una tabla con los ejercicios del entrenamiento
    getProduct(product, index) {
    	return(
                 <td colSpan="2">
                    <div id={index} className="collapse">
                    	<Table>
                      		<thead>
                        		<th>Producto</th>
                        		<th>Precio</th>
														<th>Usuario</th>
														<th>Categoría</th>
														<th>Descripción</th>
														<th>Visitas</th>
														<th>Estado</th>
														<th>Fecha de publicación</th>
														<th>Calificación de venta</th>
														<th>Comentario de venta</th>
                      		</thead>
                      		<tbody>
	                      		<tr key="i" >
					                  <td id={"product"+product._id}>{product.title}</td>
					                  <td>{product.price} €</td>
														<td>{product.user}</td>
														<td>{product.categoryproduct}</td>
														<td>{product.description}</td>
														<td>{product.visits}</td>
														<td>Disponible</td>
														<td>{product.publicationdate}</td>
														<td>{product.salesrating}</td>
														<td>{product.salescomment}</td>
					                	</tr>
				            			</tbody>
				        </Table>
				    </div>
				</td>
    	)
    },
		render: function() {
	    let modal;
	      //Muestra el modal para editar dependiendo del estado
	      if (this.state.editarID != null) {
	        for(var i = this.props.data.length - 1; i >= 0; i--) {
	            if(this.props.data[i]._id === this.state.editarID) {
								modal = (
	                <EditProduct id = {this.state.editarID} title = {this.props.data[i].title} description = {this.props.data[i].description} price = {this.props.data[i].price} categoryproduct = {this.props.data[i].categoryproduct} editado = {this.editProductSuccess} mensaje = {this.props.mensaje} cerrar = {this.editarCerrar}/>
	              );
	              break;
	            }
	        }
	      //Muestra el modal para crear dependiendo del estado
	      } else if(this.state.crear) {
	          modal = (
	               <EditProduct title = {''} description = {''} price = {0} categoryproduct = {''} creado = {this.createProductSuccess} mensaje = {this.props.mensaje} cerrar = {this.crearCerrar}/>
	          );
	      }

			return <div className="table-responsive">
	          {modal}
	          <Table striped bordered condensed hover>
	            <thead>
	              <tr>
	                <th>Nombre</th>
	                <th>Acciones</th>
	              </tr>
	            </thead>
	            {this.props.data.map((product, index) => (
		            <tbody key={index}>
		            <tr>
		               <td id={"product"+product._id} className="clickable" data-toggle="collapse" data-target={"#"+index}>{product.title}</td>
		               <td>
									 	<Button onClick={() => this.editProduct(product._id)}><Glyphicon glyph="pencil"/></Button>
									 	<Button onClick={() => this.deleteProduct(product._id)}><Glyphicon glyph="trash"/></Button>
									 </td>
		             </tr>
		             <tr>
		             {this.getProduct(product, index)}
		             </tr>
		             </tbody>
	             ))}
	            <td colSpan="100%"><Button onClick={this.createProduct}><Glyphicon glyph="plus"/></Button></td>
			  		  </Table>
			  <div className="col-md-6 col-md-offset-5 col-sm-8 col-sm-offset-2">
			  <Button bsStyle="primary" onClick={this.handleClickAnterior} disabled={!this.state.button_anterior}>Anterior</Button>
			  <Button bsStyle="primary" onClick={this.handleClickSiguiente} disabled={!this.state.button_siguiente} style={{marginLeft:25}}>Siguiente</Button>
			 </div>
			 </div>
		}
	})
	module.exports = Products
