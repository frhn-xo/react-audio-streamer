import { useRef } from 'react';
import { Recorder } from '../utils/recorder';

export function useAudioRecorder({ onAudioRecorded, bufferSize, sampleRate }) {
  const audioRecorder = useRef(null);

  let buffer = new Uint8Array();

  const appendToBuffer = (newData) => {
    const newBuffer = new Uint8Array(buffer.length + newData.length);
    newBuffer.set(buffer);
    newBuffer.set(newData, buffer.length);
    buffer = newBuffer;
  };

  const handleAudioData = (data) => {
    const uint8Array = new Uint8Array(data);
    appendToBuffer(uint8Array);

    if (buffer.length >= bufferSize) {
      const toSend = new Uint8Array(buffer.slice(0, bufferSize));
      buffer = new Uint8Array(buffer.slice(bufferSize));

      const regularArray = String.fromCharCode(...toSend);
      const base64 = btoa(regularArray);

      onAudioRecorded(base64);
    }
  };

  const start = async () => {
    if (!audioRecorder.current) {
      audioRecorder.current = new Recorder(handleAudioData, sampleRate);
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRecorder.current.start(stream);
  };

  const stop = async () => {
    if (audioRecorder.current) {
      await audioRecorder.current.stop();
    }
  };

  return { start, stop };
}
