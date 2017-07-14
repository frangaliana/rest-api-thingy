var React = require('react')
var Navbar = require('react-bootstrap/lib/Navbar')
var Nav = require('react-bootstrap/lib/Nav')
var NavItem = require('react-bootstrap/lib/NavItem')
var NavItem = require('react-bootstrap/lib/NavItem')
var Button = require('react-bootstrap/lib/Button')

var NavBar = React.createClass({
	handleClickLogout: function(){
		localStorage.clear()
		this.props.logout()
	},
	elementosBarra() {
		if (this.props.logueado) {
			return(
				<Navbar.Collapse>
      				 <Nav>
      				 	<NavItem eventKey={1} href="http://localhost:3000/web/users.html">Vendedores</NavItem>
      				 </Nav>
					 <Nav pullRight>
						<NavItem eventKey={1}>Bienvenido {localStorage.getItem('usuario')}</NavItem>
	       	 			<NavItem eventKey={2} onClick={this.handleClickLogout}>Logout</NavItem>
	       	 		</Nav>
	       	 	</Navbar.Collapse>
       	 	);
		}
	},
	render: function() {
		return <Navbar >
		    <Navbar.Header>
		      <Navbar.Brand>
		        <a href="http://localhost:3000/web">Prueba de React+API Express</a>
		      </Navbar.Brand>
		    </Navbar.Header>
	    	{this.elementosBarra()}
	  </Navbar>
	}
})
module.exports = NavBar
