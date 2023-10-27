import React, { useEffect, useState } from "react";
import classes from "./LiveChat.module.css";
import useHttp from "../../hook/use-http";
import useInput from "../../hook/use-input";
import connectSocket, { io } from "socket.io-client";

const LiveChat = () => {
  const [isToggle, setIsToggle] = useState(false);
  const [messages, setMessages] = useState([]);
  const { SendToServer } = useHttp();
  let roomID = localStorage.getItem("ROOM_ID")
    ? localStorage.getItem("ROOM_ID")
    : null;

  const {
    valueInput: valueMessage,
    valueErrorInput: valueErrorMessage,
    eventChangeInput: eventChangeMessage,
    onSetFirstValueInput: onSetFirstValueMessage,
  } = useInput(() => {});
  // connect với server
  const socket = connectSocket("https://backend-ass3.onrender.com", {
    transports: ["websocket"],
  });

  socket.on("messages", (data) => {
    //kiểm tra trạng thái
    //true: next
    //false: alert lỗi
    if (data.status) {
      //kiểm tra roomID hiện tại có chưa
      //có: update messages
      //không: kiểm tra room có vừa bị xoá không
      //có: (room đã bị xoá) messages rỗng
      //không: lưu roomID vào localtorage
      if (!roomID) {
        localStorage.setItem("ROOM_ID", data.roomID);
        roomID = data.roomID;
      } else {
        if (data.action === "Delete") {
          localStorage.removeItem("ROOM_ID");
          setMessages([]);
        } else {
          if (data.people !== "User" && roomID === data.roomID) {
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
      if (data.people === "User") alert(data.message);
    }
  });

  useEffect(() => {
    SendToServer(`/messages/${roomID}`, (data, err) => {
      if (!err) {
        setMessages(data.messages);
      } else {
        alert(data.message);
      }
    });
  }, []);

  const onToggleLivechat = () => {
    setIsToggle((prevIsToggle) => !prevIsToggle);
  };

  const onSendMessage = (e) => {
    let flagSend = true;
    if (e.key && e.key !== "Enter") {
      flagSend = false;
    }
    if (flagSend) {
      socket.emit("messages", {
        roomID: roomID,
        message: valueMessage,
        people: "User",
      });
      if (valueMessage.trim() !== "" && valueMessage.trim() !== "/end") {
        setMessages((prev) => [
          ...prev,
          { message: valueMessage, people: "User" },
        ]);
      }
      onSetFirstValueMessage("");
    }
  };

  return (
    <div className={classes["livechat-container"]}>
      <div
        onClick={onToggleLivechat}
        className={`${classes["livechat-button"]}`}
      >
        <i className="fa fa-comments-o"></i>
      </div>
      {isToggle && (
        <div className={`${classes["livechat-box"]}`}>
          <div className={`${classes["livechat-title"]}`}>
            <p>Customer Support</p>
            <p>Let's Chat App</p>
          </div>
          <div className={`${classes["chat"]}`}>
            {/* <div className={`${classes["chat-left"]}`}>
              <i className="fa fa-user text-warning"></i>
              <p>Cộng tác viên: Tôi có thể giúp gì cho bạn.</p>
            </div> */}
            {messages.length > 0 &&
              messages.map((item, i) => (
                <div
                  key={item.people + i}
                  className={`${
                    item.people === "User"
                      ? classes["chat-right"]
                      : classes["chat-left"]
                  }`}
                >
                  <p>
                    {item.people === "User" ? "You: " : "Cộng tác viên: "}
                    {item.message}
                  </p>
                </div>
              ))}
          </div>
          <div className={`${classes["chat-box"]}`}>
            <i className="fa fa-user text-warning fs-3"></i>
            <input
              type="text"
              placeholder="Enter Message!"
              onKeyDown={onSendMessage}
              onChange={eventChangeMessage}
              value={valueMessage}
            />
            <i className="fa fa-file-text-o text-secondary"></i>
            <i className="fa fa-smile-o text-secondary"></i>
            <i
              onClick={onSendMessage}
              className="fa fa-paper-plane text-primary"
            ></i>
          </div>
        </div>
      )}
    </div>
  );
};
export default LiveChat;
