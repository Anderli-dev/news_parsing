import React, {forwardRef, useEffect, useState} from "react";
import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {MDBInput} from "mdb-react-ui-kit";
import "../static/css/data-picker.css"
import {TimePopover} from "./TimePopover";
import dayjs from "dayjs";

export function DateTimePicker(props){
    const [headerTypeId, setHeaderTypeId] = useState(0)

    const [minuteFocus, setMinFocus]=useState(false)
    const [hourFocus, setHourFocus]=useState(false)

    const CustomInput = forwardRef(({ className, value, onClick, onChange }, ref) => (
        <>
            <MDBInput
            onClick={onClick}
            className={className}
            type='text'
            value={props.selected.utc().format("DD/MM/YYYY HH:mm")}
            ref={ref}
            style={{backgroundColor:"#202124"}}
            contrast
            readonly
            onChange={(e) => onChange(e.target.value)}
        />
            </>
    ));
    const renderDayContents = (day, date) => {
        const tooltipText = `Date: ${day}`;
        return <span title={tooltipText}>{day}</span>;
    };

    const renderMonthContent = (month, shortMonth, longMonth) => {
        const tooltipText = `Month: ${longMonth}`;
        return <span title={tooltipText}>{shortMonth}</span>;
    };

    const renderYearContent = (year) => {
        const tooltipText = `Year: ${year}`;
        return <span title={tooltipText}>{year}</span>;
    };

    const CustomTimeInput = () => {
        const onMinuteChange = (e) =>{
            props.onSelectedChange(props.selected.minute(e))
        }
        const onHourChange = (e) =>{
            props.onSelectedChange(props.selected.hour(e))
        }

        return (
            <div className="mb-1 d-inline-flex justify-content-center align-items-center">
                <input
                    type="number"
                    autoFocus={hourFocus}

                    value={
                        props.selected.hour().toLocaleString('en-US', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        })
                    }
                    onChange={(e) => {
                        onHourChange(
                            e.target.value
                        )
                        setHourFocus(true)
                    }}
                    onBlur={()=>setHourFocus(false)}

                    className="text-center border-0 ms-1"
                    style={{width: "10%"}}
                />
                <p className="m-0 mx-1 fw-bolder">:</p>
                <input
                    type="number"
                    autoFocus={minuteFocus}

                    value={
                        props.selected.minute().toLocaleString('en-US', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        })
                    }
                    onChange={(e) => {
                        onMinuteChange(
                            e.target.value
                        )
                        setMinFocus(true)
                    }}
                    onBlur={()=>setMinFocus(false)}

                    className="text-center border-0 me-1"
                    style={{width: "10%"}}
                />
                <TimePopover hours={props.selected.hour()} minutes={props.selected.minute()} onMinuteChange={onMinuteChange} onHourChange={onHourChange} />
            </div>
        )
    }

    // setting date in header
    const headerDate = (currentDate) =>{
        let header
            if (headerTypeId === 0) {
                header = currentDate.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                })
            }
            if(headerTypeId === 1){
                header =currentDate.toLocaleString("en-US", {
                    year: "numeric",
                })
            }
            // some ineffective logic of setting years in header (from 20xx to (20xx+12))
            if(headerTypeId === 2){
                if((Math.floor(((currentDate.getFullYear())/12))*12) === Math.ceil((currentDate.getFullYear())/12)*12)
                {
                    header = (Math.floor(((currentDate.getFullYear())/12))*12-11).toString()
                        + " - " +
                        (Math.ceil((currentDate.getFullYear())/12)*12).toString()
                }
                else {
                    header = (Math.floor(((currentDate.getFullYear())/12))*12+1).toString()
                        + " - " +
                        (Math.ceil((currentDate.getFullYear())/12)*12).toString()
                }
            }

        return header
    }

    // wasn't found realization of changing date, so it was made an ineffective way
    const onClickHeader = (func) =>{
        if(headerTypeId === 0){
            func()
        }
        if(headerTypeId === 1)
        {
            for(let i = 0; i<12; i++){func()}
        }
        if(headerTypeId === 2)
        {
            for (let i = 0; i < 12; i++)
            {
                for (let i = 0; i < 12; i++) {
                    func()
                }
            }
        }
    }

    return (
        <div>
            <DatePicker
                selected={props.selected.toDate()}

                onChange={(date) => {
                    props.onSelectedChange(dayjs(date))
                    headerTypeId > 0 && setHeaderTypeId(headerTypeId-1)
                }}
                shouldCloseOnSelect={false}

                dateFormat="dd/MM/yyyy HH:mm"
                timeInputLabel={null}

                fixedHeight
                showPopperArrow={false}
                calendarClassName={""}
                customInput={<CustomInput/>}
                popperClassName={"custom_popper_style"}

                renderDayContents={renderDayContents}
                renderMonthContent={renderMonthContent}
                renderYearContent={renderYearContent}

                showMonthYearPicker={headerTypeId === 1}
                showYearPicker={headerTypeId === 2}

                renderCustomHeader={({
                                         date,
                                         customHeaderCount,
                                         decreaseMonth,
                                         increaseMonth,
                                     }) => (
                    <div>
                        <button
                            aria-label="Previous Month"
                            className={
                                "react-datepicker__navigation react-datepicker__navigation--previous"
                            }
                            style={customHeaderCount === 1 ? { visibility: "hidden", left:"10px" } : {left: "10px"}}
                            onClick={()=>onClickHeader(decreaseMonth)}
                            type="button"
                        >
                            <span
                                className={
                                    "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous mt-3"
                                }
                            >
                              {"<"}
                            </span>
                        </button>

                        <button className="react-datepicker__current-month"
                                type="button"
                                style={{border: "none", backgroundColor:"white"}}
                                onClick={()=>{setHeaderTypeId(headerTypeId === 2 ? 0 : headerTypeId+1)}}
                        >
                            {headerDate(date)}
                        </button>

                        <button
                            aria-label="Next Month"
                            className={
                                "react-datepicker__navigation react-datepicker__navigation--next"
                            }
                            style={customHeaderCount === 1 ? { visibility: "hidden", right:"10px" } : {right: "10px"}}
                            onClick={()=>onClickHeader(increaseMonth)}
                            type="button"
                        >
                            <span
                                className={
                                    "react-datepicker__navigation-icon react-datepicker__navigation-icon--next mt-3"
                                }
                            >
                              {">"}
                            </span>
                        </button>
                    </div>
                )}
            >
                <CustomTimeInput/>
            </DatePicker>
        </div>
    );
}
