var React = require('react')
var Button = require('react-bootstrap/lib/Button')
var FormGroup = require('react-bootstrap/lib/FormGroup')
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup')
var FormControl = require('react-bootstrap/lib/FormControl')
var ControlLabel = require('react-bootstrap/lib/ControlLabel')
var InputGroup = require('react-bootstrap/lib/InputGroup')
var Glyphicon = require('react-bootstrap/lib/Glyphicon')

/* Cuando React ve un elemento que representa un componente definido por el usuario,
/* pasa los atributos JSX a este componente como un solo objeto. Llamamos a este objeto "props".*/

/* El "State" es similar a props pero es privado y completamente controlado por el componente (Característica disponible sólo para clase)
* utilizamos this.setState() para actualizar el estado local
*  - Único lugar donde podemos inicializar un estado es en Constructor
*  - En un mismo setState puede incluirse State+Props con una función arrow
*  - Puedes añadir variables independientes dentro del estado , si se toca una el resto quedarán intactas si no se tocan
*  - Un padre puede pasar una variable de estado que luego el hijo no sabrá que es el tipo que se le ha pasado si estado, prop, mecanografiado, etc
*
*  - En cada componente es posible utilizar una variable que devolverá una cosa u otra dependiendo del resultado de esta en un condicional */

var Login = React.createClass({
        getInitialState: function() {
          return {
            usuario: '',
            contrasenya: '',
            validado_usuario: null,
            validado_contrasenya: null}
        },
        handleClick: function(){
          //Peticion AJAX para el login normal
          var auth = new Buffer(this.state.usuario + ":" + this.state.contrasenya).toString('base64')
          $.ajax
          ({
            type: "POST",
            url: "http://localhost:3000/api/signin?type=basic",
            headers: {
              'Content-Type': 'application/json'
            },
            dataType: "json",
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Basic " + auth);
            },
            success: function (res){
              //Guardamos el token en localStorage
              localStorage.setItem('usuario', this.state.usuario);
              localStorage.setItem('id', res.user_id);
              localStorage.setItem('token', res.token);
              this.props.login();
            }.bind(this),
            error: function (res){
              this.props.mensaje('Login incorrecto');
            }.bind(this)
          });
        },

        handleRegisterClick: function() {
            this.props.abrir();
        },

        handleUserInput: function(evento) {
          //con esto actualizamos el estado cuando cambia el texto de la vista (vista->estado)
          this.setState({usuario:evento.target.value, validado_usuario: this.getValidationStateUser(evento.target.value)})
        },
        handlePasswordInput: function(evento) {
          //con esto actualizamos el estado cuando cambia el texto de la vista (vista->estado)
          this.setState({contrasenya:evento.target.value, validado_contrasenya: this.getValidationStateContrasenya(evento.target.value)})
        },
        //validacion (minimo 3 caracteres)
        getValidationStateUser(cadena) {
          const length = cadena.length;
          if (length > 2) {
            return 'success';
          }
          else if (length > 0) return 'error';
        },
        //validacion (minimo 3 caracteres)
        getValidationStateContrasenya(cadena) {
          const length = cadena.length;
          if (length > 2) {
            return 'success';
          }
          else if (length > 0) return 'error';
        },
        //validacion de los dos campos
        getValidation() {
          return !(this.state.validado_usuario === 'success' && this.state.validado_contrasenya === 'success');
        },

        //La única forma de actualizar el componente Login crearlo por separado y llamar a render
        render: function() {
          return <div>
            <div className="panel panel-info" >
              <div className="panel-heading">
                <div className="panel-title">Iniciar sesión</div>
              </div>
              <div style={{paddingTop: 30}} className="panel-body" >
                <form>
                  <FormGroup validationState={this.state.validado_usuario}>
                    <ControlLabel>Email</ControlLabel>
                    <InputGroup>
                      <InputGroup.Addon>
                        <Glyphicon glyph="envelope" />
                      </InputGroup.Addon>
                      <FormControl
                        type="text"
                        id="usuario"
                        value={this.state.usuario}
                        placeholder="Introduce el email"
                        onChange={this.handleUserInput}
                      />
                    </InputGroup>
                    <ControlLabel>
                      { this.state.validado_usuario == 'error' ? 'El usuario debe tener como mínimo 3 carácteres' : ''}
                    </ControlLabel>
                    <FormControl.Feedback />
                  </FormGroup>

                  <FormGroup validationState={this.state.validado_contrasenya}>
                    <ControlLabel>Contraseña</ControlLabel>
                    <InputGroup>
                      <InputGroup.Addon>
                        <Glyphicon glyph="lock" />
                      </InputGroup.Addon>
                      <FormControl
                        type="password"
                        id="contrasenya"
                        value={this.state.contrasenya}
                        placeholder="Introduce la contraseña"
                        onChange={this.handlePasswordInput}
                      />
                    </InputGroup>
                    <ControlLabel>
                      { this.state.validado_contrasenya == 'error' ? 'La contraseña debe tener como mínimo 3 carácteres' : ''}
                    </ControlLabel>
                    <FormControl.Feedback />
                  </FormGroup>
                  <ButtonGroup vertical block>
                    <Button bsStyle="success" disabled={this.getValidation()} onClick={this.handleClick} style={{paddingRight: 30}}>Login</Button>
                    <br/>
                    <Button bsStyle="info" onClick={this.handleRegisterClick}>Register</Button>
                  </ButtonGroup>
                </form>
            </div>
            </div>
          </div>
        }
})
module.exports = Login
