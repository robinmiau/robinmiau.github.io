const avatar = document.querySelector(".avatar");

const audioModule = (() => {
  let audioContext = null;
  let analyser = null;
  let dataArray = null;
  let currentAudio = null;
  let animationFrameId = null;

  const createAudioContext = () => {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.connect(audioContext.destination);
      }
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
    }
  };

  const isAudioPlaying = () => {
    return currentAudio && !currentAudio.paused && !currentAudio.ended;
  };

  const initializeAudio = () => {
    createAudioContext();

    const sounds = ["senpai.mp3", "senpai2.mp3", "laugh.mp3"];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

    currentAudio = new Audio(`assets/sounds/${randomSound}`);

    const source = audioContext.createMediaElementSource(currentAudio);
    source.connect(analyser);
    source.connect(audioContext.destination);

    currentAudio.addEventListener("play", () => {
      updateScale();
    });

    currentAudio.addEventListener("ended", () => {
      resetAvatar();
    });

    currentAudio.play();
  };

  const updateScale = () => {
    if (isAudioPlaying()) {
      analyser.getByteFrequencyData(dataArray);
      const averageAmplitude = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const scaleValue = 1 + (averageAmplitude / 256) * 0.5;
      avatar.style.transform = `scale(${scaleValue})`;

      animationFrameId = requestAnimationFrame(updateScale);
    }
  };

  const resetAvatar = () => {
    stopAudio();
    avatar.style.transform = "scale(1)";
  };

  const stopAudio = () => {
    if (currentAudio && currentAudio.currentTime > 0) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };

  return {
    initializeAudio,
    resetAvatar,
    isAudioPlaying,
  };
})();

avatar.addEventListener("click", () => {
  if (audioModule.isAudioPlaying()) {
    audioModule.resetAvatar();
  } else if (!audioModule.currentAudio) {
    audioModule.initializeAudio();
  }
});
