import React from 'react';
import {MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog} from "mdb-react-ui-kit";

export function ErrorLoginModal(props){
    return (
        <>
            <MDBModal animationDirection='top'
                      backdrop={false}
                      show={true}
                      tabIndex='-1'
                      className="h-auto"
                      {...props}
            >
                <MDBModalDialog position='bottom' className="w-100 mw-100 m-0">
                    <MDBModalContent className="rounded-0" style={{backgroundColor: "#DC4C64"}}>
                        <MDBModalBody className='py-1'>
                            <div className='d-flex justify-content-center align-items-center my-3'>
                                <p className='mb-0'>{props.errMsg}</p>
                            </div>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    )
}