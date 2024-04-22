import React, {useEffect, useRef, useState} from "react";
import {FaClock} from "react-icons/fa";
import {createPopper} from "@popperjs/core";
import "../static/css/time-popover.css"

export const TimePopover = (props) =>{
    const [isShowTimePicker, setIsShowTimePicker] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);

    const hoursRef = useRef(null)
    const minutesRef = useRef(null)

    const { styles, attributes } = createPopper(referenceElement, popperElement, {
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [10, 90],
                },
            }
        ],
        placement: 'right-end',
    });

    const TimeScroll = ({timeCount, timeRef, timeId, timeProps, onClickChange}) =>{
        let style = "hover  rounded-2 scroll-time-btn"
        let arr = []
        for(let i=0; i<timeCount; i++){
            arr.push(<button
                    type="button"
                    onClick={()=>onClickChange(i)}
                    style={{marginTop: "5px"}}
                    className={i === timeProps? style+" selected-time" : style+" border-0"}>
                    {i.toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    })}
                </button>
            )
        }

        useEffect(()=>{
            if(timeProps<6){
                timeRef.current.scrollTop = (timeCount+timeProps-2.5) * 45
            }
            else{
                timeRef.current.scrollTop = (timeProps) * 45
                timeRef.current.scrollTop = (timeProps-2.5) * 45
            }
        })

        return(
            <>
                <div className="overflow-y-scroll scrollbar text-center p-2 w-100" onScroll={(e)=>onScroll(e, onClickChange)} ref={timeRef}>
                    <div data-current="0" id={timeId}>
                        {
                            arr.map(t => t)
                        }
                        {
                            arr.map(t => t)
                        }
                    </div>
                </div>
            </>
        )
    }

    const onScroll = (e, onClickChange) =>{
        let max_scroll = e.target.scrollHeight - e.target.clientHeight;
        let current_scroll = e.target.scrollTop;
        let bottom = 100;

        let div, current, ps
        const getPElements = () =>{
            div = e.target.getElementsByTagName("div")[0];
            current = parseInt(div.dataset.current, 10);
            ps = e.target.getElementsByTagName("button")
        }

        if ( current_scroll + bottom >= max_scroll) {
            getPElements()

            let p = ps[current];
            let new_p = p.cloneNode(true);
            new_p.addEventListener("click", ()=>onClickChange(new_p.textContent))
            div.append(new_p);

            div.dataset.current = current + 1;
        }
        else if ( current_scroll - bottom <= 0) {
            getPElements()

            ps = [...ps]
            ps = ps.reverse()

            let p = ps[current];
            let new_p = p.cloneNode(true);
            new_p.addEventListener("click", ()=>onClickChange(new_p.textContent))
            div.prepend(new_p);

            div.dataset.current = current + 1;
        }
    }

    return (
        <>
            <button type="button"
                    onClick={()=> {
                        setIsShowTimePicker(!isShowTimePicker)
                    }}
                    ref={setReferenceElement}
                    className="border-0 px-0 ms-1"
                    style={{backgroundColor: "#fff"}}
            >
                <FaClock
                    className="p-0 mb-1 h-100 w-100"
                    size="1.1em"
                />
            </button>

            {isShowTimePicker &&
                <div ref={setPopperElement}
                     className= "p-2 d-flex rounded-3"
                     style=
                         {{
                             height: "300px",
                             width: "150px",
                             backgroundColor: "#ffffff",
                         }}
                     {...attributes}>

                    <TimeScroll timeCount={24} timeRef={hoursRef} timeId={"hours"} timeProps={props.hours} onClickChange={props.onHourChange}/>
                    <p className="d-flex flex-column justify-content-around m-0 fw-bolder">:</p>
                    <TimeScroll timeCount={60} timeRef={minutesRef} timeId={"minutes"} timeProps={props.minutes} onClickChange={props.onMinuteChange}/>

                </div>
            }
        </>
    )
}