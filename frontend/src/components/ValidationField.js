import React from "react";

export const ValidationField = ({asElement: Element, ...props}) => {
    const error = props.error[props.name]
    return (
        <div className={!error &&'mb-4'}>
            <Element {...props} labelStyle={{color:"rgb(147 147 147)"}} />
            {error&&
                <div style={{color: "#DC4C64", fontSize: "15px"}} >
                    <p className="m-0">{error}</p>
                </div>
            }
        </div>
    )
}