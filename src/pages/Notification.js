import React, { useEffect, useState } from "react";
import apiServices from "../api/apiServices";

const Notification = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      let data = await apiServices.getAnnouncements();
      if (data?.success) {
        setData(data?.data);
      }
} catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="relative h-[20px] overflow-hidden w-[96%] text-xs text-white ml-2">
      <div className="absolute w-full animate-scrollUp">
        {data[0]?.content? data[0]?.content :"Thanks to all our members — past and present — for being part of our journey."}
      </div>
    </div>
  );
};

export default Notification;
