let mediaRecorder;
let recordedChunks = [];

export async function startRecording() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: 'screen' },
    audio: true
  });

  mediaRecorder = new MediaRecorder(stream);
  
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screen-recording-${new Date().toISOString()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    recordedChunks = [];
  };

  mediaRecorder.start();
}

export function stopRecording() {
  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach(track => track.stop());
      resolve();
    };
    mediaRecorder.stop();
  });
}