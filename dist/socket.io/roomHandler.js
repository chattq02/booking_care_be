"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
const rooms = [];
const messages = {};
const listUserApproved = [];
const roomHandler = (socket, io) => {
    const joinRoom = ({ roomId, peerId, userId, dataUser, Approved }) => {
        // console.log(16, 'user join', roomId, peerId, 'userId', userId)
        // check xem người dùng đã ở trong room hay chưa
        // const isExist = rooms.some((e: IJoinRoomParams) => e.userId === userId)
        // if (isExist) return socket.emit('Nguoi_dung_da_ton_tai', { roomId, peerId, userId })
        socket.join(roomId);
        rooms.push({ roomId: roomId, peerId: peerId, userId: userId, dataUser: dataUser, approved: Approved });
        const listUserRequestApproval = [];
        // console.log(50, dataUser)
        // console.log('rooms', rooms)
        getListUsersRoom(roomId);
        sendChatHistory(roomId);
        socket.on('join-room-approval', ({ roomId, peerId, userId, dataUser, Approved }) => {
            console.log('join-room-approval', roomId, peerId, userId, dataUser, Approved);
            listUserApproved.push({ roomId, peerId, userId, dataUser, approved: Approved });
            io.to(roomId).emit('user-joined-approved', { peerId: peerId, userId: userId });
            getListUsersRoomPeer(roomId);
        });
        socket.on('toggle-camera-other', (data) => {
            socket.broadcast.to(data.roomId).emit('update-camera-status-other', data);
        });
        socket.on('toggle-micro-other', (data) => {
            socket.broadcast.to(data.roomId).emit('update-micro-status-other', data);
        });
        socket.on('kick-user-other', (data) => {
            console.log(68, data);
            io.to(data.roomId).emit('update-kick-user-other', data);
            kickUser({ roomId: data.roomId, peerId: data.peerId, userId: data.userID });
        });
        // thông báo đến tất cả người trong nhóm trừ user vào, là có người mới online
        notificationsNewUserJoin(roomId, peerId, userId);
        socket.on('approval-users', (data) => {
            io.to(roomId).emit('list_users_rooms_online', rooms.map((user) => {
                if (user.roomId === roomId && data.includes(user.userId)) {
                    return { ...user, approved: true };
                }
                return user;
            }));
            io.to(roomId).emit('get-list-user-approval', listUserRequestApproval
                ?.filter((item) => item.roomId === roomId)
                .filter((item) => item.Approved === false));
            socket.broadcast.to(roomId).emit('approved-user', data);
        });
        socket.on('reject-users', (data) => {
            socket.broadcast.to(roomId).emit('request-reject-user', data);
        });
        socket.on('request-approval', (data) => {
            listUserRequestApproval.push(data);
            io.to(roomId).emit('get-list-user-approval', listUserRequestApproval?.filter((item) => item.roomId === roomId)); // gửi các thông tin duyệt đến chủ phòng
        });
        socket.on('toggle-camera', (data) => {
            socket.broadcast.to(roomId).emit('update-camera-status', data);
        });
        // Lắng nghe sự kiện toggle-camera từ client và phát lại cho tất cả các client khác trong phòng
        socket.on('toggle-camera', (data) => {
            socket.broadcast.to(roomId).emit('update-camera-status', data);
        });
        // Lắng nghe sự kiện toggle-microphone từ client và phát lại cho tất cả các client khác trong phòng
        socket.on('toggle-microphone', (data) => {
            socket.broadcast.to(roomId).emit('update-microphone-status', data);
        });
        // tắt tất cả camera trong nhóm trừ mình ra (nâng cấp sau, chỉ user tạo khóa học mới có full quyền)
        socket.on('turn-off-all-cameras', (data) => {
            socket.broadcast.to(roomId).emit('turn-off-camera', data);
        });
        // tắt tất cả camera trong nhóm trừ mình ra (nâng cấp sau, chỉ user tạo khóa học mới có full quyền)
        socket.on('turn-off-all-mic', (data) => {
            socket.broadcast.to(roomId).emit('turn-off-mic', data);
        });
        socket.on('send-message', (data) => {
            if (!data.message.trim())
                return; // Bỏ qua tin nhắn rỗng
            data.timestamp = Date.now();
            // Lưu tin nhắn vào lịch sử
            if (!messages[roomId])
                messages[roomId] = [];
            messages[roomId].push(data);
            // Phát tin nhắn đến mọi người
            socket.broadcast.to(roomId).emit('receive-message', data);
        });
        socket.on('disconnect', () => {
            leaveRoom({ roomId, peerId, userId });
        });
    };
    const leaveRoom = ({ roomId, peerId, userId }) => {
        const index = rooms.findIndex((user) => user.userId === userId);
        rooms.splice(index, 1);
        const indexlistUserApproved = rooms.findIndex((user) => user.userId === userId);
        listUserApproved.splice(indexlistUserApproved, 1);
        socket.broadcast.to(roomId).emit('user_leave_room', { roomId, peerId, userId });
        getListUsersRoom(roomId);
    };
    const kickUser = ({ roomId, peerId, userId }) => {
        const roomIndex = rooms.findIndex((user) => user.userId === userId && user.roomId === roomId);
        if (roomIndex !== -1) {
            rooms.splice(roomIndex, 1);
        }
        // Xóa user khỏi danh sách listUserApproved
        const approvedIndex = listUserApproved.findIndex((user) => user.userId === userId && user.roomId === roomId);
        if (approvedIndex !== -1) {
            listUserApproved.splice(approvedIndex, 1);
        }
        io.to(roomId).emit('list_users_rooms_online', rooms);
    };
    const notificationsNewUserJoin = (roomId, peerId, userId) => {
        io.to(roomId).emit('user-joined', { peerId: peerId, userId: userId });
        socket.broadcast.to(roomId).emit('new_user_join', { roomId: roomId, peerId: peerId, userId: userId });
        getListUsersRoom(roomId);
    };
    const getListUsersRoom = (roomId) => {
        io.to(roomId).emit('list_users_rooms_online', rooms.filter((user) => user.roomId === roomId));
    };
    const getListUsersRoomPeer = (roomId) => {
        io.to(roomId).emit('list_user_peerId_rooms', listUserApproved);
    };
    const sendChatHistory = (roomId) => {
        const chatHistory = messages[roomId] || [];
        socket.emit('chat-history', chatHistory);
    };
    const startSharing = (data) => {
        socket.to(data.roomId).emit('user-started-sharing', data);
    };
    const stopSharing = (data) => {
        socket.to(data.roomId).emit('user-stopped-sharing', data);
    };
    socket.on('start-sharing', startSharing);
    socket.on('stop-sharing', stopSharing);
    socket.on('join-room', joinRoom);
};
exports.roomHandler = roomHandler;
