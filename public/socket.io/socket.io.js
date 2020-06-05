var Chat = require("../../models/chat");

var socket = io();
socket.on("chat", Chat);