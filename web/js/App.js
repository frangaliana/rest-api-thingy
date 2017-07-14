var React = require('react')
var NavBar = require('./NavBar')
var Login = require('./Login')
var Modal = require('./Modal')
var Products = require('./Products')

var App = React.createClass({
	getInitialState: function() {
        return {
            logueado: (localStorage.getItem('token') != undefined),
            mensaje: '',
            data: [],
        }
   },
   //Metodos para que otros componentes puedan cambiar el estado del principal
   login() {
      this.setState({logueado: true, mensaje: ''});
   },
   logout() {
      this.setState({logueado: false, mensaje: 'Has cerrado la sesión'});
   },
   setMensaje(m) {
   	  this.setState({mensaje: m});
   },
   mensajeLeido() {
   	  this.setState({mensaje: ''});
   },
   setData(data) {
      this.setState({data: data});
   },
   render: function() {
   	 let container;
   	 let modal;
     //Si el usuario está logueado muestran los productos
	   	if (this.state.logueado) {
  			container = (
  				<div style={{paddingLeft:100, paddingRight:100}}>
            <h2>Productos</h2>
  				  <Products limit="5" mensaje = {this.setMensaje} data = {this.state.data} setData = {this.setData}/>
  				</div>
  			);
      //Si no está logueado muestra el formulario de login
	   	} else {
	   		container = (
	   			<div className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
	        	<Login login = {this.login} mensaje = {this.setMensaje}></Login>
	        </div>
	   		);
	   	}
      // Si hay un mensaje pendiente muestra un modal con el mensaje
	   	if (this.state.mensaje != '') {
	   		modal = (<Modal mensaje = {this.state.mensaje} mensajeLeido = {this.mensajeLeido}/>);
	   	}

		 return <div>
	            <NavBar logueado = {this.state.logueado} logout = {this.logout}></NavBar>
			  			{container}
			  			{modal}
         		</div>
   }
})
module.exports = App
