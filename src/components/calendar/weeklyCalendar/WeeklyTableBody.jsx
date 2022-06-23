import React, { useContext, useEffect, useState } from "react";

//fetch sheduleData for store
// import mockScheduleData from "../mockScheduleData.json";

import moment from "moment";

import DisplayOthersSched from "./weeklyTableBody/DisplayOthersSched";
import DisplayMySched from "./weeklyTableBody/DisplayMySched";
import ScheduleBar from "../Reusables/components/ScheduleBar";
import setPositionList from "../Reusables/functions/setPositionList";

import { LoginContext } from "../../authentication/LoginProvider";
import { StoreContext } from "../../authentication/StoreProvider";

const WeeklyTableBody = (props) => {
  const { selectedDay, storeOpen, scheduleHrs } = props;
  const userId = useContext(LoginContext).user?.id ;
  const storeId = useContext(StoreContext).store?.Store_idStore ;
  // console.log('calendar user',user)
  // console.log("weekstart", selectedDay);

  const [week, setWeek] = useState();
  const [positions, setPositions] = useState();
  const [mySched, setMySched] = useState();
  const [cowokersSched, setCoworkersSched] = useState();

  const startDay = selectedDay?.clone().startOf("week");
  const endDay = selectedDay?.clone().endOf("week");
  const storeClose = storeOpen?.clone().add(scheduleHrs, "hours");
  //need to fetch current logged in user useContext
  console.log("userid : ", userId, "storeid : ", storeId);

  //set schdules & position colors
  useEffect(() => {
    const getAllSchedules = async () => {
      try {
        //need to fetch schedule with priod from server
        const weekStart = startDay.clone().format("YYYY-MM-DD");
        const res = await fetch(
          `/api/schedule/week?storeId=${storeId}&userId=${userId}&startDay=${weekStart}`
        );
        const scheduleData = await res.json();
        // console.log('fetched data',...scheduleData.mySchedules,
        // ...scheduleData.coworkersSchedules)
        setMySched(() => scheduleData.mySchedules);
        setCoworkersSched(() => scheduleData.coworkersSchedules);
        //enable this line chduleData
        const positionArray =
          scheduleData &&
          setPositionList(
            [...scheduleData.mySchedules,
            ...scheduleData.coworkersSchedules]
          );
        setPositions(positionArray);
      } catch (err) {
        console.log("failed to fetch schedule data", err);
        setMySched(() => null);
        setCoworkersSched(() => null);
      }
    };
    startDay && getAllSchedules();
  }, [selectedDay, storeId]);

  useEffect(() => {
    const weekArray = [];
    for (let i = 0; i < endDay?.diff(startDay, "days") + 1; i++) {
      // console.log('week', startDay)
      weekArray.push(startDay?.clone().add(i, "days").format("MMM DD YYYY"));
    }
    return setWeek(weekArray);
  }, [selectedDay]);

  //   console.log("weekarray",week)

  const displaySched = (schedules) => {
    return week?.map((day, i) => {
      //need to change to store hrs
      const oneDay = moment(day, "MMM DD YYYY HH:mm");
      const dayStart = oneDay
        .clone()
        .set({ h: storeOpen?.hour(), m: storeOpen?.minute() });
      const dayEnd = oneDay.set({
        h: storeClose?.hour(),
        m: storeClose?.minute(),
      });

      // console.log("sched", schedules);
      const foundSched = schedules?.find(
        (sched) =>
          moment(sched.endtime) > dayStart && moment(sched.starttime) < dayEnd
      );
      // console.log("foundsched", foundSched);
      if (foundSched === undefined) {
        // console.log("print empty div ");
        return (
          <div
            className="Schedule"
            key={`emptySched ${schedules?.scheduleId} ${i}`}
          ></div>
        );
      } else if (foundSched) {
        // console.log("day period", dayStart, dayEnd);
        // console.log("foundSched", foundSched);
        const schedFrom = moment(foundSched.starttime);
        const schedTo = moment(foundSched.endtime);
        const newFrom = schedFrom > dayStart ? schedFrom : dayStart;
        const newTo = schedTo < dayEnd ? schedTo : dayEnd;
        // console.log("schedule in a day", newFrom, "-", newTo);

        return (
          <div key={`Sched ${schedules?.scheduleId} ${i}`} className="Schedule">
            <ScheduleBar
              dayStart={dayStart}
              dayEnd={dayEnd}
              newFrom={newFrom}
              newTo={newTo}
              schedObj={foundSched}
            />
            {foundSched.workcode === 0 && (
              <div className="text">
                {newFrom?.format("h:mma")}-{newTo?.format("h:mma")}
              </div>
            )}
          </div>
        );
      }
    });
  };

  return (
    <>
      <div className="Empty-div"></div>
      {mySched && (
        <DisplayMySched
          myProfile={userId && mySched[0]}
          displaySched={displaySched}
          positions={positions}
        />
      )}

      {cowokersSched && (
        <DisplayOthersSched
          cowokerProfs={userId && cowokersSched}
          positions={positions}
          displaySched={displaySched}
        />
      )}
    </>
  );
};

export default WeeklyTableBody;
