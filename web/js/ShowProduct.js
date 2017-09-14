var React = require('react')


var Modal = require('react-bootstrap/lib/Modal')
var Table = require('react-bootstrap/lib/Table')
var Glyphicon = require('react-bootstrap/lib/Glyphicon')
var Button = require('react-bootstrap/lib/Button')
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup')
var Grid = require('react-bootstrap/lib/Grid')
var Row = require('react-bootstrap/lib/Row')
var Col = require('react-bootstrap/lib/Col')
var Image = require('react-bootstrap/lib/Image')
const moment = require('moment');


var ShowProduct = React.createClass({
  getInitialState: function() {
    return {
      showModal: true,
      data: {},
      user: {},
      preferred: false
    }
  },
  setData(data) {
    this.setState({data: data, user: data.user})
  },
  //Método que cierra el modal
  close() {
    this.setState({showModal: false})
    this.props.cerrar();
  },
  //Método que añade a Wishlist
  handleClickPreferred: function(){
    if(!this.state.preferred) {
      $.ajax
            ({
              type: "POST",
              url: 'http://localhost:3000/api/wishlist',
              headers: {
                'Content-Type': 'application/json'
              },
              dataType: "json",
              data: '{"products":"'+this.props.id+'"}',
              beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: function (res){
                this.handlePreferred();
                this.props.mensaje('¡Producto enviado a Wishlist!');
              }.bind(this),
              error: function (respuesta){
                this.props.mensaje('Ha ocurrido un error');
              }.bind(this)
            });
    } else {
      this.handlePreferred();
    }
  },
  //Recibe la dirección del vendedor
  contactPurchase: function() {
    this.props.mensaje(`¡Listo! Podrás comprar el producto contactando con su vendedor, este es su correo: ${this.state.user.email}`)
  },
  //Realiza el cambio de lista de favoritos
  handlePreferred() {
    this.setState({preferred: !this.state.preferred})
  },
  //Realizamos petición para incluir en la carga de los datos
  showData: function() {
    var url_ajax = "http://localhost:3000/api/products/"+this.props.id;

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
              this.setData(res.product);
            }.bind(this),
            error: function (res){
              this.props.mensaje('Ha ocurrido un error')
            }.bind(this)
          });
  },
  //Carga de los datos de dicho elemento
  componentDidMount() {
    this.showData();
  },
  //Muestra el boton de añadir lista de deseos
  showButtonFav(showButton){
      if(showButton){
        return(
          <Button bsStyle="danger" onClick={this.handleClickPreferred} block>{this.state.preferred ? 'Eliminar de la Wishlist' : 'Añadir a WishList'}</Button>
        )
      }
  },

  render() {
    var publicationdate = moment(this.state.data.publicationdate).format('DD MMM YYYY');

    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <h4>Información detallada</h4>
          </Modal.Header>

          <Modal.Body>
            <div>
              <Image style={{display: "block", marginLeft: "auto", marginRight: "auto"}} src="/web/public/images/bed.jpg" height="300" width="300" rounded/>
            </div>

            <div>
              <p style={{fontSize: "35px", fontWeight: "600"}}>{this.state.data.price+"€"}</p>
              <p style={{fontSize: "30px", marginTop: "-25px", borderBottom: "1px solid #CFD8DC"}}>{this.state.data.title}</p>

              <div style={{marginTop: "-10px"}}>
                <img src="/web/public/images/icon-visited.png" height="42" width="42"/>
                <p style={{fontSize: "12px", display: "inline", marginLeft: "-5px", marginRight: "10px"}}>{this.state.data.visits}</p>
                <img src="/web/public/images/icon-category.png" height="15" width="15"/>
                <p style={{fontSize: "12px", display: "inline", marginLeft: "7px"}}>{this.state.data.categoryproduct}</p>
                <img style={{marginLeft: "10px"}} src="/web/public/images/icon-time.png" height="15" width="15"/>
                <p style={{fontSize: "12px", display: "inline", marginLeft: "7px"}}>{publicationdate}</p>
              </div>

              <p style={{marginTop: "5px", textAlign: "justify", paddingBottom: "5px", borderBottom: "1px solid #CFD8DC"}}>{this.state.data.description}</p>
            </div>

            <div>
              <Image src={this.state.user.userimg} height="40" width="40" circle/>
              <p style={{fontSize: "15px", marginLeft: "10px", display: "inline"}}>{this.state.user.name}</p>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <ButtonGroup vertical block>
              {this.showButtonFav(this.props.showButton)}
              <Button bsStyle="info" onClick={this.contactPurchase} block>¡Lo quiero!</Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
})
module.exports = ShowProduct
