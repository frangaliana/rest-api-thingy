var React = require('react')
var Navbar = require('react-bootstrap/lib/Navbar')
var Nav = require('react-bootstrap/lib/Nav')
var NavItem = require('react-bootstrap/lib/NavItem')
var NavItem = require('react-bootstrap/lib/NavItem')
var Button = require('react-bootstrap/lib/Button')

var NavBar = React.createClass({
	handleClickLogout: function(){
		localStorage.clear();
		this.props.logout();
	},

	handleClickMyProducts: function(){
		this.props.OnMyProducts();
	},

	handleClickAllProducts: function(){
		this.props.OnAllProducts();
	},

	handleClickNearbyProducts: function(){
		this.props.OnNearbyProducts();
	},

	handleClickMyWishlist: function(){
		this.props.OnWishlist();
	},

	elementosBarra() {
		if (this.props.logueado) {
			return(
				<Navbar.Collapse>
      		 <Nav>
					 	<NavItem eventKey={4} onClick={this.handleClickAllProducts}>Productos</NavItem>
						<NavItem eventKey={6} onClick={this.handleClickNearbyProducts}>En mi zona</NavItem>
					 	<NavItem eventKey={5} onClick={this.handleClickMyProducts}>Mis productos</NavItem>
      		 </Nav>
					 <Nav pullRight>
						<NavItem eventKey={1}>Bienvenido {localStorage.getItem('usuario')}</NavItem>
						<NavItem eventKey={7} onClick={this.handleClickMyWishlist}>Mi WishList</NavItem>
						<NavItem eventKey={3} href="http://localhost:3000/web/users.html">Mi Perfil</NavItem>
	       	 	<NavItem eventKey={2} onClick={this.handleClickLogout}>Logout</NavItem>
	       	 </Nav>
	      </Navbar.Collapse>
    	);
		}
	},

	render: function() {

		return <Navbar >
		    <Navbar.Header>
		        <a href="http://localhost:3000/web"><img src="/web/public/images/logo-thingy.png" height="52" width="84" alt="thingy" /></a>
		    </Navbar.Header>
	    	{this.elementosBarra()}
	  </Navbar>
	}
})
module.exports = NavBar
