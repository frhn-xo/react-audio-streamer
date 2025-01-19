import useWebSocket from 'react-use-websocket';

export function useRealTime({
  wsEndpoint,
  enableInputAudioTranscription,
  onWebSocketOpen,
  onWebSocketClose,
  onWebSocketError,
  onWebSocketMessage,
  onReceivedResponseDone,
  onReceivedResponseAudioDelta,
  onReceivedResponseAudioTranscriptDelta,
  onReceivedInputAudioBufferSpeechStarted,
  onReceivedExtensionMiddleTierToolResponse,
  onReceivedInputAudioTranscriptionCompleted,
  onReceivedError,
}) {
  const { sendJsonMessage } = useWebSocket(wsEndpoint, {
    onOpen: () => onWebSocketOpen?.(),
    onClose: () => onWebSocketClose?.(),
    onError: (event) => onWebSocketError?.(event),
    onMessage: (event) => onMessageReceived(event),
    shouldReconnect: () => true,
  });

  const startSession = () => {
    const command = {
      type: 'session.update',
    };
    sendJsonMessage(command);
  };

  const addUserAudio = (base64Audio) => {
    const command = {
      type: 'input_audio_buffer.append',
      audio: base64Audio,
    };
    sendJsonMessage(command);
  };

  const inputAudioBufferClear = () => {
    const command = {
      type: 'input_audio_buffer.clear',
    };
    sendJsonMessage(command);
  };

  const onMessageReceived = (event) => {
    onWebSocketMessage?.(event);

    let message;
    try {
      message = JSON.parse(event.data);
    } catch (e) {
      console.error('Failed to parse JSON message:', e);
      throw e;
    }

    switch (message.type) {
      case 'response.done':
        onReceivedResponseDone?.(message);
        break;
      case 'response.audio.delta':
        onReceivedResponseAudioDelta?.(message);
        break;
      case 'response.audio_transcript.delta':
        onReceivedResponseAudioTranscriptDelta?.(message);
        break;
      case 'input_audio_buffer.speech_started':
        onReceivedInputAudioBufferSpeechStarted?.(message);
        break;
      case 'conversation.item.input_audio_transcription.completed':
        onReceivedInputAudioTranscriptionCompleted?.(message);
        break;
      case 'extension.middle_tier_tool_response':
        onReceivedExtensionMiddleTierToolResponse?.(message);
        break;
      case 'error':
        onReceivedError?.(message);
        break;
    }
  };

  return { startSession, addUserAudio, inputAudioBufferClear };
}
