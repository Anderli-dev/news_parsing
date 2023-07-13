import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const DeleteModal = (props) => {
    const [show, setShow] = useState(true);

    const handleClose = () => {setShow(false);props.setIsDelete(false)}

    return (
        <>
            <Modal show={show}
                   onHide={handleClose}
                   backdrop="static"
                   centered
            >
                <Modal.Header closeButton style={{color:"black"}} className="border-0">
                    <Modal.Title>Are you sure you want to delete?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-between my-3 mx-5">
                    <Button variant="danger" size="lg" onClick={props.onDeleteClick}>
                        Delete
                    </Button>
                    <Button variant="secondary" size="lg" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}