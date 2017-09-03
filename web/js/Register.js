var React = require('react')
var Modal = require('react-bootstrap/lib/Modal')
var Button = require('react-bootstrap/lib/Button')
var FormGroup = require('react-bootstrap/lib/FormGroup')
var FormControl = require('react-bootstrap/lib/FormControl')
var ControlLabel = require('react-bootstrap/lib/ControlLabel')
var InputGroup = require('react-bootstrap/lib/InputGroup')
var Radio = require('react-bootstrap/lib/Radio')
var Checkbox = require('react-bootstrap/lib/Checkbox')

var Register = React.createClass({
  getInitialState () {
    return { showModal:true,
      email: this.props.email,
      validado_email:null,
      name: this.props.name,
      validado_name: null,
      password: this.props.password,
      validado_password: null,
      gender: this.props.gender,
      validado_gender: null,
      birthdate: this.props.birthdate,
      validado_birthdate: null,
      location: this.props.location,
      validado_location: null,
      terms: this.props.terms,
      validado_terms: null
    };
  },

  close() {
    this.setState({ showModal: false});
    this.props.cerrar();
  },

  //Manejador de entrada campo: Email
  handleEmailInput: function(evento) {
    //Se actualiza estado una vez cambia texto de la vista y pasa validacion
    this.setState({email: evento.target.value, validado_email: this.getValidationStateEmail(evento.target.value)})
  },

  //Manejador de entrada campo: Name
  handleNameInput: function(evento) {
    this.setState({name: evento.target.value, validado_name: this.getValidationStateName(evento.target.value)})
  },

  //Manejador de entrada campo: Password
  handlePasswordInput: function(evento){
    this.setState({password: evento.target.value, validado_password: this.getValidationStatePassword(evento.target.value)})
  },

  /*
  //Manejador de entrada campo: UserImg
  handleUserImgInput: function(evento){
    this.setState({userimg: evento.target.value, validado_userimg: this.getValidationStateUserImg(evento.target.value)})
  },
  */

  handleGenderSelect: function(evento){
    this.setState({gender: evento.target.value, validado_gender: this.getValidationStateGender(evento.target.value)})
  },

  handleTermsSelect: function(evento){
    this.setState({terms: evento.target.value , validado_terms: this.getValidationStateTerms(evento.target.value)})
  },

  handleBirthadateSelect: function(evento, formattedValue){
    this.setState({birthdate: evento.target.value, formattedValue: formattedValue, validado_birthdate: this.getValidationStateBirthdate(evento.target.value)})
  },

  handleLocationInput: function(evento){
    this.setState({location: evento.target.value, validado_location: this.getValidationStateLocation(evento.target.value)})
  },

  //Manejador del botón editar/crear
  handleClick : function(evento) {
    //Petición AJAX para crear un usuario nuevo
    if(this.props.email === '') {
      $.ajax
            ({
              type: "POST",
              url: 'http://localhost:3000/api/signup',
              headers: {
                'Content-Type': 'application/json'
              },
              dataType: "json",
              data: '{"email":"'+this.state.email+'","name":"'+this.state.name+'","password":"'+this.state.password+'","gender":"'+this.state.gender+'","birthdate":"'+this.state.birthdate+'","location":"'+this.state.location+'"}',
              success: function (res){
                localStorage.setItem('usuario', this.state.email);
                localStorage.setItem('id', res.user_id);
                localStorage.setItem('token', res.token);

                this.props.creado();
                this.props.login();
              }.bind(this),
              error: function (res){
                this.props.mensaje('Registro Incorrecto');
              }.bind(this)
            })
    } else {
      //Petición AJAX para modificar el perfil de un usuario
      $.ajax
            ({
              type: "PUT",
              url: 'http://localhost:3000/api'+this.props.id,
              headers: {
                'Content-Type': 'application/json'
              },
              dataType: "json",
              data: '{"name":"'+this.state.name+'","password":"'+this.state.password+'","gender":"'+this.state.gender+'","birthdate":"'+this.state.birthdate+'","location":"'+this.state.location+'"}',
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: function (res){
                this.props.editado(this.state.name, this.state.password, this.state.gender, this.state.birthdate, this.state.location);
                this.props.mensaje('Información editada correctamente')
              }.bind(this),
              error: function (res){
                this.props.mensaje('Ha ocurrido un error');
              }.bind(this)
            });
    }
  },
  //Validacion (minimo 1 caracter)
  getValidationStateEmail(email) {
    //Comprobará que dentro del email introducido exista el caracter @ característico de un correo
    const length = email.length;
    if(email.indexOf('@') > -1 && length > 2){
      return 'success'
    }
    else return 'error';
  },

  getValidationStateName(name) {
    const length = name.length;
    if(length > 2) {
      return 'success';
    }
    else return 'error'
  },

  getValidationStatePassword(password) {
    const length = password.length;
    if(length > 3) {
      return 'success';
    }
    else return 'error'
  },

  /*
  getValidationStateUserImg(userimg) {
    const length = userimg.length;
    if(length > 5) {
      return 'success'
    }
    else return 'error'
  },
  */

  getValidationStateGender(gender) {
    if (gender != null) {
          return 'success';
    }
    else return 'error';
  },

  //FALTA: Implementar validación de fecha
  getValidationStateBirthdate(birthdate) {
    const expRegular = /^([0][1-9]|[12][0-9]|3[01])(\/|-)([0][1-9]|[1][0-2])\2(\d{4})$/;

    if (expRegular.test(birthdate)){
        return 'success';
    }
    else return 'error';
  },

  //FALTA: Implementar validación de localización
  getValidationStateLocation(location) {
      return 'success';
  },

  getValidationStateTerms(terms) {
    if (terms) {
      return 'success';
    }
    else return 'error';
  },

  getValidation(){
    return (this.state.validado_name === 'error' || this.state.validado_name === null) && (this.state.validado_password === 'error' || this.state.validado_password === null) && (this.state.validado_gender === 'error' || this.state.validado_gender === null) && (this.state.validado_birthdate === 'error' || this.state.validado_birthdate === null) && (this.state.validado_location === 'error' || this.state.validado_location === null) && (this.state.validado_terms === 'error' || this.state.validado_terms === null);
  },

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(`Amigo, tus coordenadas son: ${position.coords.latitude}, ${position.coords.longitude}`);
        this.setState({location: {type: "Point", coordinates: [position.coords.latitude, position.coords.longitude]}})
        //this.setState({location: "599569120e755b9be1442ee1"})
      },
      (error) => {
        alert(error.message)
        //this.setState({location: "599569120e755b9be1442ee1"})
      },
      {enableHighAccuracy: true, timeout:20000, maximumAge:1000}
    );

    /*this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        console.log(position);
        this.setState({location: {
          type: "Point",
          coordinates: [position.coords.latitude, position.coords.longitude]
        }})
      }
    )*/
  },

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <h4>{this.props.email === '' ? 'Registro' : 'Edita tu perfil'}</h4>
          </Modal.Header>

          <form>
            <Modal.Body>
              <FormGroup validationState={this.state.validado_email}>
              <ControlLabel>Email</ControlLabel>
              <InputGroup>
                <FormControl type="text" value={this.state.email} placeholder="ejemplo@ejemplo.com" onChange={this.handleEmailInput} id="email" />
              </InputGroup>
              <ControlLabel>
                {this.state.validado_email == 'error' ? 'Introduce un email válido' : ''}
              </ControlLabel>
              <FormControl.Feedback />
              </FormGroup>

              <FormGroup validationState={this.state.validado_name}>
                <ControlLabel>Nombre</ControlLabel>
                <InputGroup>
                  <FormControl type="text" value={this.state.name} placeholder="Introduce tu nombre" onChange={this.handleNameInput} id="name" />
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_name == 'error' ? 'Introduce un nombre válido' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>

              <FormGroup validationState={this.state.validado_password}>
                <ControlLabel>Contraseña</ControlLabel>
                <InputGroup>
                  <FormControl type="password" value={this.state.password} placeholder="Introduce la contraseña" onChange={this.handlePasswordInput} id="contrasenya" />
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_password == 'error' ? 'La contraseña debe tener como mínimo 4 carácteres' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>

              <FormGroup validationState={this.state.validado_gender}>
                <ControlLabel>Sexo</ControlLabel>
                <InputGroup>
                  <Radio name="radio" value={true} onChange={this.handleGenderSelect} inline>Hombre</Radio>
                  <Radio name="radio" value={false} onChange={this.handleGenderSelect} inline>Mujer</Radio>
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_gender == 'error' ? 'Añade tu sexo' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>

              <FormGroup validationState = {this.state.validado_birthdate}>
                <ControlLabel>Fecha de nacimiento</ControlLabel>
                <InputGroup>
                  <FormControl type="text" value={this.state.birthdate} placeholder="dd/MM/yyyy" onChange={this.handleBirthadateSelect} id="birthdate" />
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_birthdate == 'error' ? 'Introduzca una fecha correcta' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>

              <FormGroup validationState = {this.state.validado_terms}>
                <InputGroup>
                  <Checkbox name="terms" value={!this.props.terms} onChange={this.handleTermsSelect}>He leído las condiciones y acepto los términos de uso </Checkbox>
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_terms == 'error' ? 'Debes aceptar los términos para poder continuar' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>

            </Modal.Body>

            <Modal.Footer>
              <Button bsStyle="success" disabled={this.getValidation()} onClick={this.handleClick} style={{paddingRight: 30}}>{this.props.email === '' ? 'Registrar' : 'Aceptar'}</Button>
            </Modal.Footer>

          </form>
        </Modal>
      </div>
    );
  }
});

module.exports = Register
