// // 录音
// prepareRecordingPath(audioPath){
//   AudioRecorder.prepareRecordingAtPath(audioPath, {
//     SampleRate: 22050,
//     Channels: 1,
//     AudioQuality: "Low",
//     AudioEncoding: "amr",
//     AudioEncodingBitRate: 32000
//   });
// }
//
// _checkPermission() {
//   if (Platform.OS !== 'android') {
//     return Promise.resolve(true);
//   }
//
//   const rationale = {
//     'title': 'Microphone Permission',
//     'message': 'AudioExample needs access to your microphone so you can record audio.'
//   };
//
//   return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
//     .then((result) => {
//       console.log('Permission result:', result);
//       return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
//     });
// }
//
// async _record() {
//   if (this.state.recording) {
//     console.warn('Already recording!');
//     return;
//   }
//
//   if (!this.state.hasPermission) {
//     console.warn('Can\'t record, no permission granted!');
//     return;
//   }
//
//   if(this.state.stoppedRecording){
//     this.prepareRecordingPath(this.state.audioPath);
//   }
//
//   this.setState({recording: true});
//
//   try {
//     const filePath = await AudioRecorder.startRecording();
//   } catch (error) {
//     console.error(error);
//   }
// }
//
// async _stop() {
//     // 如果没有在录音
//     if (!this.state.recording) {
//       console.warn('Can\'t stop, not recording!');
//       return;
//     }
//
//     this.setState({stoppedRecording: true, recording: false});
//
//     try {
//       const filePath = await AudioRecorder.stopRecording();
//
//       if (Platform.OS === 'android') {
//         this._finishRecording(true, filePath);
//       }
//       this.handleSendImage({path:"file://" + filePath, filename:'test.amr'}, 'audio');
//       return filePath;
//     } catch (error) {
//       console.error(error);
//     }
// }
//
// async _play() {
//     if (this.state.recording) {
//       await this._stop();
//     }
//
//     // These timeouts are a hacky workaround for some issues with react-native-sound.
//     // See https://github.com/zmxv/react-native-sound/issues/89.
//     setTimeout(() => {
//       var sound = new Sound(this.state.audioPath, '', (error) => {
//         if (error) {
//           console.log('failed to load the sound', error);
//         }
//       });
//
//       setTimeout(() => {
//         sound.play((success) => {
//           if (success) {
//             console.log('successfully finished playing');
//           } else {
//             console.log('playback failed due to audio decoding errors');
//           }
//         });
//       }, 100);
//     }, 100);
// }
//
// _finishRecording(didSucceed, filePath) {
//   this.setState({ finished: didSucceed });
//   console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
// }
