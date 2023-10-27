import React, { useEffect, useState } from "react";
import classes from "./InfoBoard.module.css";
import Info from "./Info";
import useHttp from "../../../hooks/use-http";
import usePriceTypes from "../../../hooks/use-pricetypes";

const InfoBoard = () => {
  const { SendToServer, isLoading } = useHttp();
  const [infoBoard, setInfoBoard] = useState(null);
  const { Dot } = usePriceTypes();

  const resolveDataFetch = (data, err) => {
    if (!err) {
      // console.log(data);
      setInfoBoard(data.infoBoard);
    } else {
      alert(data.message);
    }
  };
  useEffect(() => {
    SendToServer("/admin/infoboard", resolveDataFetch);
  }, []);

  return (
    <div className={`${classes["info-board"]}`}>
      <Info
        title="Clients"
        content={infoBoard ? infoBoard.countUsers : 0}
        icon="fa-solid fa-user-plus"
      />
      <Info
        title="Earnings By Month"
        content={infoBoard ? Dot(String(infoBoard.earningsByMonth)) : 0}
        icon="fa-solid fa-dollar-sign"
      />
      <Info
        title="New Order"
        content={infoBoard ? infoBoard.countOrders : 0}
        icon="fa-solid fa-file-circle-plus"
      />
    </div>
  );
};
export default InfoBoard;
