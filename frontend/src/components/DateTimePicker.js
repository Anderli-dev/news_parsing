import React, {forwardRef, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {MDBInput} from "mdb-react-ui-kit";
import data from "bootstrap/js/src/dom/data";

export function DateTimePicker(){
    const [startDate, setStartDate] = useState(new Date());

    const [headerTypeId, setHeaderTypeId] = useState(0)

    const CustomInput = forwardRef(({ className, value, onClick, onChange }, ref) => (
        <MDBInput
            onClick={onClick}
            className={className}
            type='text'
            value={value}
            ref={ref}
            contrast
            onChange={(e) => onChange(e.target.value)}
        />
    ));
    const renderDayContents = (day, date) => {
        const tooltipText = `Tooltip for date: ${day}`;
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

    // wasn't found realization of changing date, so it was made an ineffective method
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
        <>
            <DatePicker
                selected={startDate}

                onChange={(date) => {
                    setStartDate(date)
                    headerTypeId > 0 && setHeaderTypeId(headerTypeId-1)
                }}

                shouldCloseOnSelect={false}
                customInput={<CustomInput/>}
                dateFormat="dd/MM/yyyy h:mm aa"
                timeInputLabel="Time:"


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
                            style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
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
                                style={{border: "none"}}
                                onClick={()=>{setHeaderTypeId(headerTypeId === 2 ? 0 : headerTypeId+1)}}
                        >
                            {headerDate(date)}
                        </button>

                        <button
                            aria-label="Next Month"
                            className={
                                "react-datepicker__navigation react-datepicker__navigation--next"
                            }
                            style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
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
            />
        </>
    );
}
