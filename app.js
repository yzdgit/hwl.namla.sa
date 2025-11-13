tailwind.config = {
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: { sans: ['Cairo', 'system-ui', 'ui-sans-serif', 'sans-serif'] },
      colors: { primary: { DEFAULT: '#2563EB', dark: '#1D4ED8' } }
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });
  const statusEl = document.getElementById('ffmpeg-status');
  const statusDot = document.getElementById('status-dot');
  const videoInput = document.getElementById('video-input');
  const convertBtn = document.getElementById('convert-btn');
  const convertLabel = document.getElementById('convert-label');
  const convertSpinner = document.getElementById('convert-spinner');
  const progressWrapper = document.getElementById('progress-bar-wrapper');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const progressLabel = document.getElementById('progress-label');
  const errorMessage = document.getElementById('error-message');
  const resultCard = document.getElementById('result-card');
  const audioPreview = document.getElementById('audio-preview');
  const downloadLink = document.getElementById('download-link');
  document.getElementById('year').textContent = new Date().getFullYear();
  let ffmpegReady = false;

  async function ensureFFmpegLoaded() {
    if (ffmpegReady) return;
    statusEl.textContent = 'جاري تحميل محرك التحويل لأول مرة...';
    await ffmpeg.load();
    ffmpegReady = true;
    statusEl.textContent = 'جاهز للتحويل – اختر ملف الفيديو ثم اضغط على زر التحويل.';
    statusDot.classList.remove('bg-amber-400', 'bg-rose-400');
    statusDot.classList.add('bg-emerald-400');
  }

  function setConvertingState(isConverting) {
    convertBtn.disabled = isConverting;
    if (isConverting) {
      convertLabel.textContent = 'جاري التحويل...';
      convertSpinner.classList.remove('hidden');
      progressWrapper.classList.remove('hidden');
    } else {
      convertLabel.textContent = 'تحويل الفيديو إلى صوت';
      convertSpinner.classList.add('hidden');
    }
  }

  function updateProgress(value) {
    const percent = Math.min(100, Math.max(0, Math.round(value)));
    progressBar.style.width = percent + '%';
    progressText.textContent = percent + '%';
    progressLabel.textContent = 'التقدم: ' + percent + '%';
  }

  async function handleConvert() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
    resultCard.classList.add('hidden');
    const file = videoInput.files && videoInput.files[0];
    if (!file) {
      errorMessage.textContent = 'الرجاء اختيار ملف فيديو أولًا.';
      errorMessage.classList.remove('hidden');
      return;
    }
    const rawBaseName = file.name.replace(/\.[^/.]+$/, '');
    const safeBaseName = (rawBaseName || 'audio-from-video').replace(/[^\u0600-\u06FF\w\-]+/g, '-');
    const format = 'mp3';
    const inputName = 'input_' + Date.now() + '.' + (file.name.split('.').pop() || 'mp4');
    const outputName = safeBaseName + '_hawil_namla_sa.' + format;
    setConvertingState(true);
    updateProgress(5);
    try {
      await ensureFFmpegLoaded();
      updateProgress(15);
      await ffmpeg.FS('writeFile', inputName, await fetchFile(file));
      updateProgress(30);
      await ffmpeg.run('-i', inputName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outputName);
      updateProgress(80);
      const data = ffmpeg.FS('readFile', outputName);
      updateProgress(100);
      ffmpeg.FS('unlink', inputName);
      ffmpeg.FS('unlink', outputName);
      const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      audioPreview.src = url;
      downloadLink.href = url;
      downloadLink.download = outputName;
      resultCard.classList.remove('hidden');
    } catch (error) {
      errorMessage.textContent = 'حدث خطأ أثناء التحويل.';
      errorMessage.classList.remove('hidden');
    } finally {
      setConvertingState(false);
    }
  }

  convertBtn.addEventListener('click', event => {
    event.preventDefault();
    handleConvert();
  });

  ensureFFmpegLoaded();
});
