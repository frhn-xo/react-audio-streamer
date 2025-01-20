import React, { useState, useEffect } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useRealTime } from '../hooks/useRealTime';

export function AudioStreamerButton({
  wsEndpoint,
  onToggle,
  sampleRate = 24000,
  bufferSize = 4800,
}) {
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    onToggle(isRecording);
  }, [isRecording]);

  const { startSession, addUserAudio, inputAudioBufferClear } = useRealTime({
    wsEndpoint,
    onWebSocketOpen: () => console.log('WebSocket connection opened'),
    onWebSocketClose: () => console.log('WebSocket connection closed'),
    onWebSocketError: (event) => console.error('WebSocket error:', event),
    onReceivedError: (message) => console.error('error', message),
    onReceivedResponseAudioDelta: (message) => {
      isRecording && playAudio(message.delta);
    },
    onReceivedInputAudioBufferSpeechStarted: () => {
      stopAudioPlayer();
    },
    onReceivedExtensionMiddleTierToolResponse: (message) => {
      console.log(message);
    },
  });

  const {
    reset: resetAudioPlayer,
    play: playAudio,
    stop: stopAudioPlayer,
  } = useAudioPlayer({ sampleRate });
  const { start: startAudioRecording, stop: stopAudioRecording } =
    useAudioRecorder({ onAudioRecorded: addUserAudio, bufferSize, sampleRate });

  const onToggleListening = async () => {
    if (!isRecording) {
      await startSession();
      await startAudioRecording();
      resetAudioPlayer();

      setIsRecording(true);
    } else {
      await stopAudioRecording();
      stopAudioPlayer();
      inputAudioBufferClear();

      setIsRecording(false);
    }
  };

  return (
    <div
      onClick={onToggleListening}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        opacity: 0.5,
        zIndex: 1,
      }}
    ></div>
  );
}
