import React from "react";
import Datetime from 'react-datetime';
import moment from 'moment';

export class DataTimePicker extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Datetime
                className="mb-4"
                inputProps={{style: {width: '100%', color: '#fff', backgroundColor:"inherit"}}}
                renderDay={this.renderDay}
                renderMonth={this.renderMonth}
                renderYear={this.renderYear}
                renderInput={this.renderInput}
                renderView={(undefined, renderDefault) =>
                    this.renderView(renderDefault)
                }
                initialValue={this.props.initialValue}
                onChange={this.props.onChange}
            />
        );
    }

    renderView(renderDefault) {
        // Only for years, months and days view
        return (
            <div className="wrapper" style={{color:'black'}}>
                {renderDefault()}
            </div>
        );
    }
    renderDay(props, currentDate, selectedDate) {
        // Adds 0 to the days in the days view
        return <td {...props}>{currentDate.date()}</td>;
    }
    renderMonth(props, month, year, selectedDate) {
        // Display the month index in the months view
        return <td {...props}>{moment().month(month).format("MMM")}</td>;
    }
    renderYear(props, year, selectedDate) {
        // Just display the last 2 digits of the year in the years view
        return <td {...props}>{year}</td>;
    }
    renderInput(props, openCalendar, closeCalendar){
        return <input {...props} onChange={null}></input>
    }
}
