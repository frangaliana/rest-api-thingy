var React = require('react')
var NavBar = require('./NavBar')
var Login = require('./Login')
var Register = require('./Register')
var Modal = require('./Modal')
var Products = require('./Products')

var App = React.createClass({
	getInitialState: function() {
        return {
            logueado: (localStorage.getItem('token') != undefined),
						myProducts: false,
						allProducts: true,
						registered: false,
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
	 OnMyProducts() {
		 this.setState({myProducts: true, allProducts: false})
	 },
	 OnAllProducts() {
		 this.setState({allProducts: true, myProducts: false})
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

	 registerUser() {
		 this.setState({registered: true})
	 },

	 createUserSuccess() {
		 this.registerCerrar();
	 },

	 registerCerrar() {
		 this.setState({registered: false})
	 },

   render: function() {
   	 let container;
   	 let modal;
		 let registerModal;

		 //Si el usuario está logueado muestran los productos
	   	if (this.state.logueado && this.state.myProducts && !this.state.allProducts) {
  			container = (
  				<div style={{paddingLeft:100, paddingRight:100}}>
            <h2>Mis Productos</h2>
  				  <Products limit="5" mensaje = {this.setMensaje} data = {this.state.data} setData = {this.setData}/>
  				</div>
  			);
      //Si no está logueado muestra el formulario de login
		} else if(this.state.logueado && this.state.allProducts && !this.state.myProducts) {
				container = (
					<div style={{paddingLeft:100, paddingRight:100}}>
						<h2>Productos</h2>
						<Products limit="5" mensaje = {this.setMensaje} data = {this.state.data} setData = {this.setData}/>
					</div>
				);
			} else {
	   		container = (
	   			<div className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
	        	<Login login = {this.login} mensaje = {this.setMensaje} abrir = {this.registerUser}></Login>
	        </div>
	   		);
	   	}

			//Si se pulsa el botón de registro
			if (this.state.registered) {
				registerModal = (
					<Register login = {this.login} email= '' name= '' password='' gender='' birthdate='' location='' terms='' mensaje = {this.setMensaje} creado = {this.createUserSuccess} cerrar = {this.registerCerrar} />
				);
			}
      // Si hay un mensaje pendiente muestra un modal con el mensaje
	   	if (this.state.mensaje != '') {
	   		modal = (
					<Modal mensaje = {this.state.mensaje} mensajeLeido = {this.mensajeLeido} />
				);
	   	}

		 return <div>
	            <NavBar logueado = {this.state.logueado} OnAllProducts = {this.OnAllProducts} OnMyProducts = {this.OnMyProducts} logout = {this.logout}></NavBar>
			  			{container}
			  			{modal}
							{registerModal}
         		</div>
   }
})
module.exports = App
