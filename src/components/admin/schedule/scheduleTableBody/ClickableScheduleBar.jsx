import React, { useState } from "react";
import moment from "moment";
import ScheduleBar from "../../../calendar/Reusables/components/ScheduleBar";
import { useEffect } from "react";
import AdminScheduleModal from "./AdminScheduleModal";

const ClickableScheduleBar = ({
  daysInWeek,
  storeOpen,
  scheduleHrs,
  timezone,
  employeeSched,
  position,
  setSchedModalOpen,
  selectedDate,
  setSelectedDate,
  selectedSched,
  setSelectedSched,
}) => {
  // console.log("schedules",schedules)
  // const [selectedDate, setSelectedDate] = useState();
  const [timeList, setTimeList] = useState();
  const [open, setOpen] = useState(false);
  // const [workHrsinWeek, setWorkHrsinWeek] = useState();

  // console.log("ININ")

  useEffect(() => {
    const getTimeList = () => {
      const timeOpen = storeOpen?.clone();
      // console.log("storeClose", storeClose.format());
      const timeArray = [storeOpen.format("hh:mm a")];
      const iterTimes = (scheduleHrs * 60) / 15;
      // console.log("iteration time", scheduleHrs, iterTimes)
      for (let i = 0; i < iterTimes; i++) {
        timeArray.push(timeOpen?.add(15, "minutes").format("hh:mm a"));
      }
      setTimeList(() => timeArray);
      // console.log("times", timeArray)
    };
    getTimeList();
  }, []);

  const scheduleAction = (e, day, foundSched) => {
    // set initial values for schedule modal
    //set Date
    setSelectedDate(() => moment.tz(day, timezone));
    //set Schedule
    if (foundSched) {
      console.log("edit on", foundSched);
      setSelectedSched(() => foundSched);
      console.log("selected schdule after click", selectedSched);
    } else {
      setSelectedSched((pre) => {
        console.log(
          "create on user where id, storeid are",
          employeeSched.userId,
          employeeSched.storeId
        );
        return {
          ...pre,
          User_idUser: employeeSched.userId,
          Store_idStore: employeeSched.storeId,
        };
      });
    }
    // open modal
    setOpen(true);
  };


  useEffect(() => {
    console.log("open has been changed");
    const fetchDataAgain = () => {
      setSchedModalOpen((pre) => !pre);
    };
    fetchDataAgain();
  }, [open]);
  // console.log("selectedSched", selectedSched);

  return (
    <>
      {daysInWeek?.map((day, i) => {
        //need to change to store hrs
        const today = moment.tz(moment(), timezone);
        const oneDay = moment.tz(day, timezone);
        const dayStart = oneDay
          .clone()
          .set({ h: storeOpen?.hour(), m: storeOpen?.minute() });
        const dayEnd = dayStart.clone().add(scheduleHrs, "hours");

        const foundSched = employeeSched.schedules?.find(
          (sched) =>
            moment.tz(sched.endtime, timezone) > dayStart &&
            moment.tz(sched.starttime, timezone) < dayEnd
        );

        if (oneDay < today) {
          return (
            <div
              className="Schedule non-clickable"
              key={`emptySched ${i}`}
            ></div>
          );
        } else if (oneDay >= today) {
          if (foundSched === undefined) {
            return (
              <div
                className="Schedule clickable"
                key={`emptySched ${i}`}
                onClick={(e) => scheduleAction(e, day, foundSched)}
              ></div>
            );
          } else if (foundSched) {
            const schedFrom = moment.tz(foundSched.starttime, timezone);
            const schedTo = moment.tz(foundSched.endtime, timezone);
            const newFrom = schedFrom > dayStart ? schedFrom : dayStart;
            const newTo = schedTo < dayEnd ? schedTo : dayEnd;

            // CalcHrsinWeek += Math.round(moment(schedTo - schedFrom).unix()/60/60 );
            // console.log("workingHrs", workingHrs)

            return (
              <div
                onClick={(e) => scheduleAction(e, day, foundSched)}
                key={`Sched ${foundSched?.idSchedule} ${i}`}
                className="Schedule clickable"
                id={foundSched?.idSchedule}
              >
                <ScheduleBar
                  dayStart={dayStart}
                  dayEnd={dayEnd}
                  newFrom={newFrom}
                  newTo={newTo}
                  schedObj={foundSched}
                  timezone={timezone}
                />
                {foundSched.workcode === 0 && (
                  <div className="text">
                    {newFrom?.format("h:mm a")}-{newTo?.format("h:mm a")}
                  </div>
                )}
              </div>
            );
          }
        }
      })}
      <AdminScheduleModal
        employeeSched={employeeSched}
        position={position}
        selectedDate={selectedDate}
        selectedSched={selectedSched}
        timezone={timezone}
        setSelectedSched={setSelectedSched}
        open={open}
        setOpen={setOpen}
        timeList={timeList}
       
      />
    </>
  );
};

export default ClickableScheduleBar;
