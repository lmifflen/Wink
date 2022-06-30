import React from "react";
import { ProfileIcon } from "./ProfileIcon";

const ProfileSmall = ({ emp, position, i, index,calcHrsinWeek }) => {
  // console.log("position in profileSmall", emp,position)
  return (
    <div className="WeeklyCal-Profiles others" key={`profile ${i} ${index}`}>
      {index === 0 && (
        <div className="title" key={`position ${i}`}>
          <ProfileIcon profile={emp} color={position.color} />
          <div className="name">{position.position}</div>
        </div>
      )}
      <div className="profile" key={`profile ${index}`}>
        <div key={`name ${index}`} className="Name-container">
          <div className="name">
            {emp.firstname}, {emp.lastname}
          </div>
          {calcHrsinWeek&&<div className="scheduled-Hrs">{calcHrsinWeek} hrs</div>}
        </div>
      </div>
    </div>
  );
};

export default ProfileSmall;
