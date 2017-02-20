import React, {Component} from 'react';
import {modal} from 'react-redux-modal';

class myModalComponent extends Component {
  constructor(props) {
    super(props);
    console.log('## MODAL DATA AND PROPS:', this.props);
  }
 
  removeThisModal() {
    this.props.removeModal();
  }

  submit(e) {
    console.log("would submit here");
  }

    
  render() {
    return (
      <div>
        <div className="modal-pic"><img className="overlay-pic" src="/css/contes_overlay.jpg"></img></div>
        <button
          className="close-modal-button"
          type="button"
          onClick={this.removeThisModal.bind(this)}>
          Close
        </button>
      </div>
    );
  }
}

export default class InstructionsModal extends Component {
  constructor(props) {
      super(props);
  }
 
  addModal() {
    modal.add(myModalComponent, {
      title: 'Enter A Contest',
      size: 'large', // large, medium or small,
      closeOnOutsideClick: false, // (optional) Switch to true if you want to close the modal by clicking outside of it,
      hideTitleBar: false, // (optional) Switch to true if do not want the default title bar and close button,
      hideCloseButton: false, // (optional) if you don't wanna show the top right close button
      //.. all what you put in here you will get access in the modal props ;)
    });
  }
  
  render() {
    return <button className="instructions-modal-button" onClick={this.addModal.bind(this)}>Instructions</button>;
  }
}