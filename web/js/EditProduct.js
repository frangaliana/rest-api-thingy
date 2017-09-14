var React = require('react')
var Modal = require('react-bootstrap/lib/Modal')
var Button = require('react-bootstrap/lib/Button')
var FormGroup = require('react-bootstrap/lib/FormGroup')
var FormControl = require('react-bootstrap/lib/FormControl')
var ControlLabel = require('react-bootstrap/lib/ControlLabel')
var InputGroup = require('react-bootstrap/lib/InputGroup')

var EditProduct = React.createClass({
  getInitialState() {
    return { showModal: true,
    	   title: this.props.title,
    		 validado_title: null,
         description: this.props.description,
         validado_description:null,
         price: this.props.price,
         validado_price:null,
         categoryproduct: this.props.category,
         validado_category:null

    };
  },
  //Metodo que cierra el modal
  close() {
    this.setState({ showModal: false });
    this.props.cerrar();
  },
  //Manejador de entrada del campo title
  handleTitleInput: function(evento) {
          //Actualizamos el estado cuando cambia el texto de la vista (vista->estado) y pasa la validacion
          this.setState({title:evento.target.value, validado_title: this.getValidationStateTitle(evento.target.value)})
  },

  handlePriceInput: function(evento) {
          //Actualizamos el estado cuando cambia el texto de la vista (vista->estado) y pasa la validacion
          this.setState({price:evento.target.value, validado_price: this.getValidationStatePrice(evento.target.value)})
  },

  handleDescriptionInput: function(evento) {
          //Actualizamos el estado cuando cambia el texto de la vista (vista->estado) y pasa la validacion
          this.setState({description:evento.target.value, validado_description: this.getValidationStateDescription(evento.target.value)})
  },

  handleCategorySelect: function(evento) {
          //Actualizamos el estado cuando cambia el texto de la vista (vista->estado) y pasa la validacion
          this.setState({categoryproduct:evento.target.value, validado_category: this.getValidationStateCategory(evento.target.value)})
  },

  //Manejador del botón editar/crear
  handleClick : function(evento) {
    //Peticion AJAX para crear un producto nuevo
  	if(this.props.title === '') {
  		$.ajax
	          ({
	            type: "POST",
	            url: 'http://localhost:3000/api/products',
	            headers: {
	              'Content-Type': 'application/json'
	            },
	            dataType: "json",
	            data: '{"title":"'+this.state.title+'","description":"'+this.state.description+'","price":'+this.state.price+',"categoryproduct":"'+this.state.categoryproduct+'"}',
	            beforeSend: function (xhr) {
	              xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
	            },
	            success: function (res){
	            	this.props.creado();
	            	this.props.mensaje('Producto creado con éxito');
	            }.bind(this),
	            error: function (res){
                console.log(res.data)
                this.props.mensaje('Ha ocurrido un error');
	            }.bind(this)
	          });

  	} else {
      //Peticion AJAX para editar un producto
	  	$.ajax
	          ({
	            type: "PUT",
	            url: 'http://localhost:3000/api/products/'+this.props.id,
	            headers: {
	              'Content-Type': 'application/json'
	            },
	            dataType: "json",
              data: '{"title":"'+this.state.title+'","description":"'+this.state.description+'","price":'+this.state.price+',"categoryproduct":"'+this.state.categoryproduct+'"}',
	            beforeSend: function (xhr) {
	              xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
	            },
	            success: function (res){
	            	this.props.editado(this.state.title,this.state.description, this.state.price, this.state.categoryproduct);
	            	this.props.mensaje('Producto modificado con éxito');
	            }.bind(this),
	            error: function (res){
	              this.props.mensaje('Ha ocurrido un error');
	            }.bind(this)
	          });
      }
  },
  //Validación (minimo 1 caracter)
  getValidationStateTitle(title) {
      const length = title.length;
      if (length > 0) {
        return 'success';
      }
      else return 'error';
  },

  getValidationStatePrice(price) {
      const floatPrice = parseFloat(price);
      if (floatPrice >= 0.0) {
        return 'success';
      }
      else return 'error';
  },

  getValidationStateDescription(description) {
      const length = description.length;
      if (length > 0) {
        return 'success';
      }
      else return 'error';
  },

  getValidationStateCategory(categoryproduct) {
      if (categoryproduct === 'Electrónica' ||
          categoryproduct === 'Moda y accesorios' ||
          categoryproduct === 'Motor' ||
          categoryproduct === 'Deporte' ||
          categoryproduct === 'Libros, Música y Películas' ||
          categoryproduct === 'Electrodomésticos' ||
          categoryproduct === 'Servicios' ||
          categoryproduct === 'Muebles y Decoración' ||
          categoryproduct === 'Otros') {
            return 'success';
      }
      else return 'error';
  },

  getValidation(){
    return (this.state.validado_title === 'error' || this.state.validado_title === null) && (this.state.validado_description === 'error' || this.state.validado_description === null) && (this.state.validado_price === 'error' || this.state.validado_price === null) && (this.state.validado_category === 'error' || this.state.validado_category === null);
  },

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <h4>{this.props.title === '' ? 'Crea un producto' : 'Edita el producto'}</h4>
          </Modal.Header>
          <form>
            <Modal.Body>
              <FormGroup validationState={this.state.validado_title}>
                <ControlLabel>Título</ControlLabel>
                <InputGroup>
                  <FormControl type="text" value={this.state.title} placeholder="Introduce el producto" onChange={this.handleTitleInput} id="title" />
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_title == 'error' ? 'Introduce un título válido' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>

              <FormGroup validationState={this.state.validado_price}>
                <ControlLabel>Precio (en €)</ControlLabel>
                <InputGroup>
                  <FormControl type="text" value={this.state.price} placeholder="Introduce el precio" onChange={this.handlePriceInput} id="price" />
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_price == 'error' ? 'Introduce un precio válido' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>

              <FormGroup validationState={this.state.validado_category}>
                <ControlLabel>Categoría</ControlLabel>
                <InputGroup>
                  <FormControl componentClass="select" placeholder="Elige la categoría del producto" onChange={this.handleCategorySelect} id="categoryproduct">
                    <option value=''>Selecciona la categoría</option>
                    <option value='Electrónica'>Electrónica</option>
                    <option value='Moda y accesorios'>Moda y accesorios</option>
                    <option value='Motor'>Motor y accesorios</option>
                    <option value='Deporte'>Deporte</option>
                    <option value='Libros, Música y Películas'>Libros, Música y Películas</option>
                    <option value='Electrodomésticos'>Electrodomésticos</option>
                    <option value='Servicios'>Servicios</option>
                    <option value='Muebles y Decoración'>Muebles y Decoración</option>
                    <option value='Otros'>Otros</option>
                  </FormControl>
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_category == 'error' ? 'Selecciona una categoría válida' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>

              <FormGroup validationState={this.state.validado_description}>
                <ControlLabel>Descripción</ControlLabel>
                <InputGroup>
                  <FormControl componentClass="textarea" value={this.state.description} placeholder="Introduce la descripción" onChange={this.handleDescriptionInput} id="description" />
                </InputGroup>
                <ControlLabel>
                  { this.state.validado_description == 'error' ? 'Introduce una descripción válida' : ''}
                </ControlLabel>
                <FormControl.Feedback />
              </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button id="button_editar" bsStyle="success" disabled={this.getValidation()} onClick={this.handleClick}>{this.props.title === '' ? 'Crear' : 'Editar'}</Button>
            <Button bsStyle="default" onClick={this.close}>Cerrar</Button>
          </Modal.Footer>
         </form>
        </Modal>
      </div>
    );
  }
});
module.exports = EditProduct
