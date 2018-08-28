import React, { Component } from "react";
import PropTypes from "prop-types";

import Styles from "./modal-edit-connection.styles.less";

export default class ModalEditConnection extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    initialConnection: PropTypes.object,
    addUpdateConnection: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
    connections: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      connection: {
        name: (props.initialConnection ? props.initialConnection.name : ''),
        https: (props.initialConnection ? props.initialConnection.https : ''),
        ws: (props.initialConnection ? props.initialConnection.ws : ''),
        userCreated: true,
        selected: this.props.initialConnection ? this.props.initialConnection.selected : false,
      },
      validations: {},
    };

    this.closeModal = this.closeModal.bind(this)
    this.updateField = this.updateField.bind(this)
    this.saveConnection = this.saveConnection.bind(this)
    this.delete = this.delete.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialConnection !== this.props.initialConnection) {
      const connection = {
        name: this.props.initialConnection ? this.props.initialConnection.name : '',
        https: this.props.initialConnection ? this.props.initialConnection.name : '',
        name: this.props.initialConnection ? this.props.initialConnection.name : '',
        userCreated: true,
        selected: this.props.initialConnection ? this.props.initialConnection.selected : false,
      }
      this.setState({connection: connection})
    }
  }

  saveConnection(e) {
    const key = this.props.initialConnection ? this.props.initialConnection.key : this.state.connection.name
    this.props.addUpdateConnection(key, this.state.connection)
    this.closeModal(e)
    e.stopPropagation()
  }

  validateField(name, value) {
    const { connections } = this.props
    let { validations, disableButton } = this.state
    const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

    if (name === 'name') {
      const nameRepeat = (Object.values(connections || [])).find(network => network.name.toLowerCase() === value.toLowerCase())
      if (nameRepeat) {
        validations[name] = 'Name already in use'
      } else {
        delete validations[name]
      }
    } else if (name === 'https') {
      if (!value.match(urlRegex)) {
        validations[name] = 'Not a valid HTTP Endpoint'
      } else {
        delete validations[name]
      }
    } else if (name === 'ws') {
      if (!value.match(urlRegex)) {
        validations[name] = 'Not a valid Websocket Endpoint'
      } else {
        delete validations[name]
      }
    }

    this.setState({validations})
  }

  updateField(name, value) {
    this.validateField(name, value)
    const { connection } = this.state
    connection[name] = value
    this.setState({connection: connection})
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  delete(e) {
    this.props.updateModal({initialConnection: this.props.initialConnection, key: this.props.initialConnection.key})
    e.stopPropagation()
  }

  render() {
    const { initialConnection } = this.props;
    const { connection, validations } = this.state

    let enableButton = (connection.name !== '' && (connection.ws !== '' || connection.https !== '' ))
    if ( validations.name || validations.ws || validations.https ) {
      enableButton = false
    }

    return (
      <section id="editModal" className={Styles.ModalEditConnection}>
        <div className={Styles.ModalEditConnection__container}>
          <div className={Styles.ModalEditConnection__header}>{ initialConnection ? 'Edit Connection' : 'Add Connection' }</div>
          <div className={Styles.ModalEditConnection__subheader}>
            Only one endpoint (HTTP or Websocket) is required.
          </div>
          <div className={Styles.ModalEditConnection__label}>
              Connection Name
          </div>
          <div className={Styles.ModalEditConnection__inputContainer}>
              <input 
                  onChange={e => {
                    this.updateField("name", e.target.value);
                  }} 
                  className={Styles.ModalEditConnection__input}
                  value={connection.name}
              />
              {validations.name &&
                <div className={Styles.ModalEditConnection__errorMessage}>{validations.name}</div>
              }
          </div>
          <div className={Styles.ModalEditConnection__label}>
              HTTP Endpoint
          </div>
          <div className={Styles.ModalEditConnection__inputContainer}>
              <input 
                  onChange={e => {
                    this.updateField("https", e.target.value);
                  }}
                  value={connection.https} 
                  className={Styles.ModalEditConnection__input}
                  placeholder="http(s)://" 
              />
              {validations.https &&
                <div className={Styles.ModalEditConnection__errorMessage}>{validations.https}</div>
              }
          </div>
          <div className={Styles.ModalEditConnection__label}>
              Websocket Endpoint
          </div>
          <div className={Styles.ModalEditConnection__inputContainer}>
              <input 
                  onChange={e => {
                    this.updateField("ws", e.target.value);
                  }}
                  value={connection.ws} 
                  className={Styles.ModalEditConnection__input}
                  placeholder="ws://"
              />
              {validations.ws &&
                <div className={Styles.ModalEditConnection__errorMessage}>{validations.ws}</div>
              }
          </div>
          <div className={Styles.ModalEditConnection__buttonContainer}>
              <div className={Styles.ModalEditConnection__cancel} onClick={this.closeModal}>Cancel</div>
              <button className={Styles.ModalEditConnection__save} onClick={this.saveConnection} disabled={!enableButton}>Save Connection</button>
          </div>
          { initialConnection &&
            <div className={Styles.ModalEditConnection__delete} onClick={this.delete}>
              Delete connection
            </div>
          }
        </div>
      </section>
    )
  }
}
