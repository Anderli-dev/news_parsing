import {Blocks} from "react-loader-spinner";
import React from "react";

export const LoadingPreview = () => {
    return(
        <>
            <div className="placeholder-glow">
                <div
                    className='placeholder'
                    style={{width: "100%", height: "160px"}}
                />
            </div>
             <div style={{backgroundColor: "#343434"}} className="placeholder-glow py-3 px-3 mb-3">
            <span className='placeholder w-100'></span>
            <span className='placeholder col-7'></span>
            <span className='placeholder col-4'></span>
            <span className='placeholder col-4'></span>
            <span className='placeholder col-6'></span>
        </div>
        </>

    )
}