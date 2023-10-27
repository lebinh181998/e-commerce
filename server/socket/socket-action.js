const Room = require("../models/room");
const Message = require("../models/message");
const io = require("../socket/socket");

// exports.socketON = (socket, listen) => {
//   socket.on(listen, async (data) => {
//     try {
//       //kiểm tra room có tồn tại
//       let room = await Room.findById(data.roomID);

//       //kiểm tra user có muốn xoá room chat
//       //có: thực hiện xoá room
//       //không: kiểm tra message có nhâp chưa
//       if (data.people === "User" && data.message.trim() === "/end") {
//         //kiểm tra room chat muốn xoá có tồn tại
//         //có: xoá room và các message
//         //không: thông báo lỗi
//         if (room) {
//           // await room.findByIdAndRemove(data.roomID);
//           await Message.deleteMany({ roomID: data.roomID });
//           return io.getIO().emit(listen, {
//             status: true,
//             people: data.people,
//             message: data.message,
//           });
//         } else {
//           return io.getIO().emit(listen, {
//             status: false,
//             people: data.people,
//             message: "Not found room",
//           });
//         }
//         //kiểm tra message có nhâp chưa
//         //có : kiểm tra phòng có tồn tại chưa
//         //chưa: tạo room
//       } else if (data.message.trim() !== "") {
//         if (!room) {
//           room = new Room();
//           await room.save();
//         }

//         const message = new Message({
//           message: data.message,
//           people: data.people,
//           roomID: room._id,
//         });

//         await message.save();

//         return io.getIO().emit(listen, {
//           status: true,
//           roomID: room._id,
//           people: data.people,
//           message: data.message,
//           messageID: message._id,
//         });
//       }
//     } catch (error) {
//       socket.emit(listen, { status: false, message: "Error server" });
//     }
//   });
// };

exports.socketON = (socket, listen) => {
  socket.on(listen, async (data) => {
    try {
      //kiểm tra room có tồn tại
      let room = await Room.findById(data.roomID);
      //các action liên quan đén user
      if (data.people === "User") {
        //kiểm tra user có muốn xoá room chat
        //có: thực hiện xoá room
        //không: kiểm tra message có nhâp chưa
        if (data.message.trim() === "/end") {
          //kiểm tra room chat muốn xoá có tồn tại
          //có: xoá room và các message
          //không: thông báo lỗi
          if (room) {
            await Room.findByIdAndRemove(data.roomID);
            await Message.deleteMany({ roomID: data.roomID });
            return io.getIO().emit(listen, {
              status: true,
              roomID: data.roomID,
              people: data.people,
              action: "Delete",
              message: data.message,
            });
          } else {
            return io.getIO().emit(listen, {
              status: false,
              roomID: data.roomID,
              people: data.people,
              action: "Error",
              message: "Not found room",
            });
          }
        }
      }

      //kiểm tra message có nhâp chưa
      //có : kiểm tra phòng có tồn tại chưa
      //chưa: tạo room
      if (data.message.trim() !== "") {
        if (!room) {
          room = new Room();
          await room.save();
        }

        const message = new Message({
          message: data.message,
          people: data.people,
          roomID: room._id,
        });

        await message.save();

        return io.getIO().emit(listen, {
          status: true,
          roomID: room._id,
          people: data.people,
          action: "Add",
          message: data.message,
          messageID: message._id,
        });
      }
    } catch (error) {
      socket.emit(listen, { status: false, message: "Error server" });
    }
  });
};
