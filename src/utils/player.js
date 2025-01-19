import { SAMPLE_RATE } from './constants';

export class Player {
  constructor() {
    this.playbackNode = null;
  }

  async init(sampleRate = SAMPLE_RATE) {
    const audioContext = new AudioContext({ sampleRate });
    const playbackCode = `
            class AudioPlaybackWorklet extends AudioWorkletProcessor {
                constructor() {
                    super();
                    this.port.onmessage = this.handleMessage.bind(this);
                    this.buffer = [];
                }

                handleMessage(event) {
                    if (event.data === null) {
                        this.buffer = [];
                        return;
                    }
                    this.buffer.push(...event.data);
                }

                process(inputs, outputs, parameters) {
                    const output = outputs[0];
                    const channel = output[0];

                    if (this.buffer.length > channel.length) {
                        const toProcess = this.buffer.slice(0, channel.length);
                        this.buffer = this.buffer.slice(channel.length);
                        channel.set(toProcess.map(v => v / 32768));
                    } else {
                        channel.set(this.buffer.map(v => v / 32768));
                        this.buffer = [];
                    }

                    return true;
                }
            }

            registerProcessor("audio-playback-worklet", AudioPlaybackWorklet);
        `;
    const playbackBlob = new Blob([playbackCode], {
      type: 'application/javascript',
    });
    const playbackUrl = URL.createObjectURL(playbackBlob);
    await audioContext.audioWorklet.addModule(playbackUrl);

    this.playbackNode = new AudioWorkletNode(
      audioContext,
      'audio-playback-worklet'
    );
    this.playbackNode.connect(audioContext.destination);
  }

  play(buffer) {
    if (this.playbackNode) {
      this.playbackNode.port.postMessage(buffer);
    }
  }

  stop() {
    if (this.playbackNode) {
      this.playbackNode.port.postMessage(null);
    }
  }
}
