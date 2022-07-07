import {
    MDBBtn, MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle
} from "mdb-react-ui-kit";
import {Scrollbars} from "react-custom-scrollbars"

export function PermissionsModal(props){
    return(
        <MDBModal tabIndex='-1' show={props.centredModal} setShow={props.setCentredModal}>
            <MDBModalDialog centered style={{color: '#000'}}>
                <MDBModalContent>
                    <MDBModalHeader className='justify-content-center'>
                        <MDBModalTitle>Choose permissions</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody className='d-flex'>
                        <div className='border-end border-dark w-50'>
                            <Scrollbars style={{width:'100%', height: '30vh'}} autoHide>
                                {props.notAppliedPermissions.map(item => (
                                    <button
                                        key={item.id}
                                        type='button'
                                        className='d-block w-100 text-start'
                                        onClick={e => props.switchToApplied(e, item.id)}
                                        style={{backgroundColor:'inherit', border:'none'}}>
                                        {item.name}
                                    </button>
                                ))}
                            </Scrollbars>
                        </div>
                        <div className='ms-3 w-50'>
                            <Scrollbars style={{width:'100%', height: '30vh'}} autoHide>
                                {props.rolePermissions.map(item => (
                                    <button
                                        key={item.id}
                                        type='button'
                                        className='d-block w-100 text-start'
                                        onClick={e => props.switchToNotApplied(e, item.id)}
                                        style={{backgroundColor:'inherit', border:'none'}}>
                                        {item.name}
                                    </button>
                                ))}
                            </Scrollbars>
                        </div>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn type='button' color='danger' onClick={props.toggleShow}>
                            Close
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    )
}