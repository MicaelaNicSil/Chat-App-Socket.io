const users = [];

//Join user to chat
function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

//Get current user (get user by its id. we pick up the id of the user and change it for normal id)
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//user leaves chat (removes user from the array)
function userLeaves(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Gets the room in which certian user is 
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
};