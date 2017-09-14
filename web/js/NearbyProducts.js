var React = require('react')
var Glyphicon = require('react-bootstrap/lib/Glyphicon')
var Button = require('react-bootstrap/lib/Button')
var Table = require('react-bootstrap/lib/Table')
var ShowProduct = require('./ShowProduct')

var NearbyProducts = React.createClass({
	getInitialState: function() {
        return {
            after: null,                      //corresponde a la siguiente id a obtener
            before: null,                     //corresponde a la anterior id a obtener
            button_siguiente: true,           //estado del boton siguiente (validacion)
            button_anterior: true,            //estado del boton anterior (validacion)
            showID: null,                   	//id del producto a mostrar (estado de visibilidad del modal)
        }
    },
    actualizarData: function(direccion) {
      var url_ajax = "http://localhost:3000/api/nearbys";

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
								this.props.mensaje('No hay productos por ahora');
							} else {
								this.props.mensaje('Ha ocurrido un error');
							}
            }.bind(this)
          });
    },
		//Mostramos el producto de forma detallada
		showProduct(id) {
      this.setState({showID: id})
    },
		//Cerramos la vista de sólo producto
		showCerrar() {
			this.setState({showID: null})
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

		render: function() {
	    let modal;
	      //Muestra el modal para mostrar dependiendo del estado
	      if (this.state.showID != null) {
	        for(var i = this.props.data.length - 1; i >= 0; i--) {
	            if(this.props.data[i]._id === this.state.showID) {
								modal = (
	                <ShowProduct id = {this.state.showID} mensaje = {this.props.mensaje} cerrar = {this.showCerrar} showButton = {true}/>
	              );
	              break;
	            }
	        }
				}

			return <div className="table-responsive">
	          {modal}
	          <Table striped condensed>
	            <thead>
	              <tr>
	                <th>Producto</th>
	                <th>Información detallada</th>
	              </tr>
	            </thead>
	            {this.props.data.map((product, index) => (
			            <tbody key={index}>
			            <tr>
			              <td id={"product"+product._id} className="clickable" data-toggle="collapse" data-target={"#"+index}>
											{product.title}
										</td>

										<td>
										 	<Button onClick={() => this.showProduct(product._id)}><Glyphicon glyph="info-sign"/></Button>
										</td>
			            </tr>
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
	module.exports = NearbyProducts
