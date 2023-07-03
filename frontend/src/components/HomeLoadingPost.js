import React from "react";
import {MDBBtn, MDBCardBody, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";

export const HomeLoadingPost = () => {
    return(
        <>
            <div
                style={{
                    width: "50rem",
                    color:"black",
                    backgroundColor:"#fff",
                    borderRadius:"10px",
                    boxShadow:"0px 5px 31px 4px rgba(0,0,0,0.75)"}}
                className="mb-4 px-3 pt-4 pb-3 placeholder-glow">
                <span className='placeholder col-2'></span>
                <MDBCardTitle className='mb-3'><span className='placeholder col-10'></span></MDBCardTitle>

                <div className="d-flex">
                    <div className="img-fluid placeholder" style={{width: "350px", height: "180px"}}></div>
                    <MDBCardBody className="py-0 pe-0">
                        <MDBCardText>
                            <span className='placeholder col-11'></span>
                            <br/>
                            <span className='placeholder col-8'></span>
                        </MDBCardText>
                        <MDBBtn className='px-3 placeholder' style={{width:"125px"}} disabled/>
                    </MDBCardBody>
                </div>

                <div className="d-flex">
                    <MDBBtn  className="m-0 mt-3 me-2 p-0 placeholder"
                             disabled
                             style={{width:'30px'}}>
                    </MDBBtn>
                    <MDBBtn  className="m-0 mt-3 me-2 p-0 placeholder"
                             disabled
                             style={{width:'30px'}}>
                    </MDBBtn>
                    <MDBBtn  className="m-0 mt-3 me-2 p-0 d-flex align-items-center placeholder"
                             disabled
                             style={{height:'30px', width:"80px"}}>
                    </MDBBtn>
                </div>
            </div>
        </>

    )
}