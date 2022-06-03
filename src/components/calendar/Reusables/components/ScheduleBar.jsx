import React from 'react'
import moment from 'moment';

const ScheduleBar = (props) => {
    const {dayStart, dayEnd, schedFrom, schedTo, schedObj} = props;
    
        const newFrom = schedFrom > dayStart ? schedFrom : dayStart;
        const newTo = schedTo < dayEnd ? schedTo : dayEnd;
        //Divide maxmum of Bar every 15min
        const barLength = moment(dayEnd - dayStart).unix() / 60 / 15;
    
        // console.log("division", barLength);
        const barStart = moment(newFrom - dayStart).unix() / 60 / 15;
        const barEnd = moment(newTo - dayStart).unix() / 60 / 15;
        // console.log("bar indexs", barStart, barEnd);
    
        if (schedObj.workCode === "Working") {
          return (
            <>
              <div
                className="Full-bar"
                style={{ gridTemplateColumns: `repeat(${barLength - 1},1fr)` }}
              >
                <div
                  className="Percentage-bar working"
                  style={{ gridColumn: `${barStart + 1}/${barEnd}` }}
                >
                  <p className="hours">
                    {moment(newTo - newFrom).unix() / 60 / 60}hrs
                  </p>
                </div>
              </div>
              <div className="text">
                {newFrom.format("HH:mm")}-{newTo.format("HH:mm")}
              </div>
            </>
          );
        } else if (schedObj.workCode === "Vacation") {
          return (
            <>
              <div
                className="Full-bar"
                style={{ gridTemplateColumns: `repeat(${barLength - 1},1fr)` }}
              >
                <div
                  className={"Percentage-bar vacation"}
                  style={{ gridColumn: `${barStart + 1}/${barEnd}` }}
                ></div>
              </div>
            </>
          );
        }
      ;
  return (
    <div>ScheduleBar</div>
  )
}

export default ScheduleBar