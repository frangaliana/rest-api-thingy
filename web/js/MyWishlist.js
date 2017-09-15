var React = require('react')
var Glyphicon = require('react-bootstrap/lib/Glyphicon')
var Button = require('react-bootstrap/lib/Button')
var Table = require('react-bootstrap/lib/Table')
var ShowProduct = require('./ShowProduct')

var MyWishlist = React.createClass({
	getInitialState: function() {
        return {
            after: null,                      //corresponde a la siguiente id a obtener
            before: null,                     //corresponde a la anterior id a obtener
            button_siguiente: true,           //estado del boton siguiente (validacion)
            button_anterior: true,            //estado del boton anterior (validacion)
						showID: null,
						count: this.props.count
        }
    },
    actualizarData: function(direccion) {
      var url_ajax = "http://localhost:3000/api/wishlist"

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
								this.props.mensaje('No hay productos en la lista de deseos, ¡añádelos!');
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
						url: 'http://localhost:3000/api/wishlist/'+id,
						headers: {
							'Content-Type': 'application/json'
						},
						dataType: "json",
						beforeSend: function (xhr) {
							xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
						},
						success: function (res){
							//Se borra el producto de data
							var list = this.props.data;
							for(var i = list.length - 1; i >= 0; i--) {
								var listResult = list[i]
								for(var j = listResult.products.length - 1; j >= 0; j--){
									if(list[i].products[j]._id === id) {
										 list[i].products.splice(j, 1);
										 break;
									}
								}
							}
							this.props.setData(list);
							this.props.mensaje('Producto eliminado de la lista de deseos');
						}.bind(this),
						error: function (res){
							this.props.mensaje('Ha ocurrido un error');
						}.bind(this)
					});
		},
		//Primera carga de datos
    componentDidMount: function() {
			this.actualizarData('');
    },
		showProduct(id) {
			this.setState({showID: id})
		},
		//Cerramos la vista de sólo producto
		showCerrar() {
			this.setState({showID: null})
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
    getProducts(product) {
    	return(
        product.products.map((result, i) => (
        <tr key={i}>
           <td id={"Myproduct"+i} className="clickable" data-toggle="collapse" data-target={"#"+i}>{result.title}</td>
           <td>
					 		<Button onClick={() => this.showProduct(result._id)}><Glyphicon glyph="info-sign"/></Button>
							<Button onClick={() => this.deleteProduct(result._id)}><Glyphicon glyph="remove"/></Button>
           </td>
         </tr>
       ))
    	)
    },
		//Renderización de la vista
		render: function() {
      let result = this.props.data
			let modal;

			//Muestra el modal para mostrar dependiendo del estado
			if (this.state.showID != null) {
				var list = this.props.data
				for(var i = list.length - 1; i >= 0; i--) {
					var listResult = list[i]
					for(var j = listResult.products.length - 1; j >= 0; j--){
						if(listResult.products[j]._id === this.state.showID) {
							modal = (
								<ShowProduct id = {this.state.showID} mensaje = {this.props.mensaje} cerrar = {this.showCerrar} showButton = {false} count = {this.state.count}/>
							);
							break;
						}
					}
				}
			}


			return <div className="table-responsive">
						{modal}
						<Table striped condensed>
		            <thead>
		              <tr>
		                <th>Nombre</th>
		                <th>Acciones</th>
		              </tr>
		            </thead>
                {result.map((desiredProducts, index) => (
                  <tbody key={index}>
                    {this.getProducts(desiredProducts)}
									 </tbody>
                 ))}
			  		  </Table>
				  <div className="col-md-6 col-md-offset-5 col-sm-8 col-sm-offset-2">
				  	<Button bsStyle="primary" onClick={this.handleClickAnterior} disabled={!this.state.button_anterior}>Anterior</Button>
				  	<Button bsStyle="primary" onClick={this.handleClickSiguiente} disabled={!this.state.button_siguiente} style={{marginLeft:25}}>Siguiente</Button>
				 </div>
			 </div>
		}
	})
	module.exports = MyWishlist
