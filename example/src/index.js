import sendMsg from "./msg.js";
import jsonData from "./data.json";

const data = JSON.parse(jsonData);

sendMsg(`Hello ${data.name}!!!`);
