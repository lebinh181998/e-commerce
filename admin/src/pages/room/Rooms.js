import React, { useEffect, useState } from "react";
import classes from "./Rooms.module.css";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import connectSocket, { io } from "socket.io-client";

const Rooms = () => {
  const { SendToServer, isLoading } = useHttp();
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomID, setRoomID] = useState(null);
  const [isToggle, setIsToggle] = useState(false);

  const {
    valueInput: valueMessage,
    valueErrorInput: valueErrorMessage,
    eventChangeInput: eventChangeMessage,
    onSetFirstValueInput: onSetFirstValueMessage,
  } = useInput(() => {});

  //connect với server
  const socket = connectSocket("https://backend-ass3.onrender.com", {
    transports: ["websocket"],
  });

  useEffect(() => {
    SendToServer("/admin/rooms", (data, err) => {
      if (!err) {
        // console.log(data);
        setRooms(data.rooms);
      }
    });
  }, []);

  socket.on("messages", (data) => {
    //kiểm tra trạng thái
    //true: next
    if (data.status) {
      //kiểm tra room tồn tại không
      //có: next
      //không: (room vừa bị xoá) messages rỗng, đóng room
      if (data.action === "Delete") {
        setRooms((prev) => {
          const updatedRooms = [...prev];
          const isRoom = updatedRooms.filter(
            (room) => room._id === data.roomID
          );
          if (isRoom.length > 0) {
            return updatedRooms.filter((room) => room._id !== data.roomID);
          } else {
            return updatedRooms;
          }
        });
        setIsToggle(false);
        setMessages([]);
      } else {
        if (data.people !== "Admin") {
          //kiểm  tra tôn tại room chưa
          //chưa: thêm room vừa được user tạo
          // console.log(rooms);
          // console.log(isRoom.length);
          setRooms((prev) => {
            const updatedRooms = [...prev];
            const isRoom = updatedRooms.filter(
              (room) => room._id === data.roomID
            );
            if (isRoom.length <= 0) {
              return [...updatedRooms, { _id: data.roomID }];
            } else {
              return updatedRooms;
            }
          });

          if (roomID === data.roomID) {
            setMessages((prev) => {
              const updatedMsg = [...prev];
              const isMsg = updatedMsg.filter(
                (msg) => msg._id === data.messageID
              );

              if (isMsg.length <= 0) {
                return [
                  ...updatedMsg,
                  {
                    _id: data.messageID,
                    message: data.message,
                    people: data.people,
                  },
                ];
              } else {
                return updatedMsg;
              }
            });
          }
        }
      }
    } else {
      if (data.people === "Admin") alert(data.message);
    }
  });

  const onSendMessage = (e) => {
    let flagSend = true;
    if (e.key && e.key !== "Enter") {
      flagSend = false;
    }
    if (flagSend) {
      socket.emit("messages", {
        roomID: roomID,
        message: valueMessage,
        people: "Admin",
      });
      if (valueMessage.trim() !== "") {
        setMessages((prev) => [
          ...prev,
          { message: valueMessage, people: "Admin" },
        ]);
      }
      onSetFirstValueMessage("");
    }
  };

  const onSetRoomID = (id) => {
    if (roomID !== id) {
      SendToServer(`/messages/${id}`, (data, err) => {
        if (!err) {
          setMessages(data.messages);
        }
      });
      setIsToggle(true);
      setRoomID(id);
    } else {
      setIsToggle(false);
      setRoomID(null);
    }
  };

  return (
    <div className={`${classes.rooms}`}>
      <div className={`${classes["rooms-box"]}`}>
        <div className={`${classes["search-contact"]}`}>
          <input type="text" placeholder="Search Contact" />
        </div>
        {rooms.length > 0 &&
          rooms.map((room) => (
            <div
              key={room._id}
              onClick={onSetRoomID.bind(null, room._id)}
              className={`${classes.room}`}
            >
              <i className="fa fa-user text-warning fs-3"></i>
              <p>{room._id}</p>
            </div>
          ))}
      </div>
      {isToggle && (
        <div className={`${classes["room-box"]}`}>
          <div className={`${classes["chat"]}`}>
            {messages.length > 0 &&
              messages.map((item, i) => (
                <div
                  key={item.people + i}
                  className={`${
                    item.people === "Admin"
                      ? classes["chat-right"]
                      : classes["chat-left"]
                  }`}
                >
                  {item.people !== "Admin" && (
                    <i className="fa fa-user text-warning fs-3"></i>
                  )}
                  <p className={`${classes.message}`}>
                    {item.people !== "Admin" ? "Client: " : "You: "}
                    {item.message}
                  </p>
                </div>
              ))}
          </div>
          <div className={`${classes["chat-box"]}`}>
            <label htmlFor="enter">
              <input
                id="enter"
                className={`w-100`}
                type="text"
                placeholder="Type and enter"
                onKeyDown={onSendMessage}
                onChange={eventChangeMessage}
                value={valueMessage}
              />
            </label>
            <i
              onClick={onSendMessage}
              className="fa fa-paper-plane text-white bg-primary m-3 fs-4 p-2 rounded-5 text-center"
            ></i>
          </div>
        </div>
      )}
    </div>
  );
};
export default Rooms;
