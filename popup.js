import { startRecording, stopRecording } from './recorder.js';
import { EventTracker } from './eventTracker.js';

const startBtn = document.getElementById('startRecording');
const stopBtn = document.getElementById('stopRecording');
const timerEl = document.getElementById('timer');
const statusEl = document.getElementById('status-text');

let timer;
let seconds = 0;

function updateTimer() {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  seconds++;
}

startBtn.addEventListener('click', async () => {
  try {
    await startRecording();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusEl.textContent = 'Recording...';
    timer = setInterval(updateTimer, 1000);
    EventTracker.start();
  } catch (error) {
    statusEl.textContent = 'Error starting recording';
    console.error(error);
  }
});

stopBtn.addEventListener('click', async () => {
  try {
    await stopRecording();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusEl.textContent = 'Ready';
    clearInterval(timer);
    seconds = 0;
    timerEl.textContent = '00:00';
    EventTracker.stop();
  } catch (error) {
    statusEl.textContent = 'Error stopping recording';
    console.error(error);
  }
});