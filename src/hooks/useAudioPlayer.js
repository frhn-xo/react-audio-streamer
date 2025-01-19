import { useRef } from 'react';
import { Player } from '../utils/player';
import { SAMPLE_RATE } from '../utils/constants';

export function useAudioPlayer() {
  const audioPlayer = useRef(null);

  const reset = () => {
    audioPlayer.current = new Player();
    audioPlayer.current.init(SAMPLE_RATE);
  };

  const play = (base64Audio) => {
    const binary = atob(base64Audio);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const pcmData = new Int16Array(bytes.buffer);

    if (audioPlayer.current) {
      audioPlayer.current.play(pcmData);
    }
  };

  const stop = () => {
    if (audioPlayer.current) {
      audioPlayer.current.stop();
    }
  };

  return { reset, play, stop };
}
