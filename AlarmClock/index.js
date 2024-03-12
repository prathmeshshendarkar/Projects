const timerViewer = document.getElementById("timerViewer");
const inputTime = document.getElementById("inputTime");
const listAlarms = document.getElementById("listAlarms");
let alarms = [];

function getCurrentTime(){
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();

    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;

    var currentTime = hours + ":" + minutes;
    if(hours < 12)  currentTime += " AM";
    else currentTime += " PM";

    return currentTime;
}

function renderEachAlarm(e){
    console.log(e);
    const alarmBox = document.createElement('div');
    alarmBox.setAttribute('class', 'alarmBox');

    const newTimeBox = document.createElement('p');
    const deleteButton = document.createElement('button');
    
    newTimeBox.textContent = e;
    newTimeBox.setAttribute('class', 'newTimeBox');
    alarmBox.appendChild(newTimeBox);

    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('class', 'deleteButton');
    alarmBox.appendChild(deleteButton);
    
    listAlarms.appendChild(alarmBox);
    deleteButton.addEventListener('click', () => {
        alarms = alarms.filter((alarmItem) => alarmItem !== e);
        renderAlarmsList();
    });
}

function renderAlarmsList(){
    listAlarms.innerHTML = "";
    const uniqueAlarms = alarms.filter((value, index, xd) => xd.indexOf(value) === index);

    uniqueAlarms.map((e) => renderEachAlarm(e));
}

(() => {
    const showTime = document.createElement('p');
    showTime.textContent = getCurrentTime();
    timerViewer.appendChild(showTime);
})();

const setAlarmFunction = () => {
    let inputBoxTime = inputTime.value;
    console.log(inputBoxTime);
    if(alarms.includes(inputBoxTime)) return;
    alarms.push(inputBoxTime);

    renderAlarmsList();
}