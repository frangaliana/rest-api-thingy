var React = require('react')
var Modal = require('react-bootstrap/lib/Modal')
var Button = require('react-bootstrap/lib/Button')

var ModalAlerta = React.createClass({
  getInitialState() {
    return { showModal: true };
  },
  close() {
    this.setState({ showModal: false });
    this.props.mensajeLeido();
  },
  render() {
    return (
      <div>
        <Modal bsSize="small" show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h4>{this.props.mensaje}</h4>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});
module.exports = ModalAlerta
