# react-audio-streamer

## Table of Contents

- [How to Use](#how-to-use)
  - [AudioStreamerButton](#audiostreamerbutton)
    - [Parameters](#parameters)
    - [React Example](#react-example)
    - [Caveats](#caveats)

## How to Use

- **AudioStreamerButton**

  - The `AudioStreamerButton` component is used for audio recording and streaming.
  - It is clickable and toggles the recording state.
  - This component connects to a WebSocket server to stream real-time audio.

  - **Parameters**

    - | Parameter    | Type     | Description                                                                                                                 | Default |
      | ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------- | ------- |
      | `wsEndpoint` | string   | WebSocket URL for audio stream (required)                                                                                   | -       |
      | `onToggle`   | function | Callback function triggered when the button is clicked. It receives `true` when recording starts and `false` when it stops. | -       |
      | `sampleRate` | number   | Sample rate for audio recording (optional)                                                                                  | 24000   |
      | `bufferSize` | number   | Buffer size for audio recording (optional)                                                                                  | 4800    |

  - **React Example**

    - Use the component in a React app as shown below:

      ```jsx
      import { AudioStreamerButton } from 'react-audio-streamer';
      import { useState } from 'react';

      const App = () => {
        const [isRecording, setIsRecording] = useState(false);

        const handleSetRecording = (isRecording) => {
          console.log('Recording state:', isRecording);
          setIsRecording(isRecording);
        };

        return (
          <button
            style={{
              position: 'relative', // needs to be set relative
              backgroundColor: isRecording ? 'red' : 'gray',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            <AudioStreamerButton
              wsEndpoint="ws://localhost:8766/realtime"
              onToggle={handleSetRecording}
              sampleRate={25000}
            />
            {'microphone'}
          </button>
        );
      };

      export default App;
      ```

  - **Caveats**
    - The `AudioStreamerButton` should always be inside a button with the `position: relative` style.
    - This ensures proper layout and functionality.
