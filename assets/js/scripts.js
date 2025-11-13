document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const avatar = document.getElementById('avatar');

  // Apply saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  // Calculate and display age
  const calculateAge = () => {
    const birthDate = new Date('1999-01-23');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const ageElement = document.getElementById('age');
  if (ageElement) ageElement.textContent = calculateAge();

  // Typing effect
  const titles = ['Web Developer', 'Server Administrator', 'Reverse Engineer'];
  const typedTextElement = document.getElementById('typed-text');
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentTitle = titles[titleIndex];
    typedTextElement.textContent = currentTitle.substring(0, isDeleting ? charIndex - 1 : charIndex + 1);
    charIndex += isDeleting ? -1 : 1;

    if (!isDeleting && charIndex === currentTitle.length) {
      setTimeout(() => {
        isDeleting = true;
        type();
      }, 3500);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }

    setTimeout(type, isDeleting ? 50 : 100);
  };

  setTimeout(type, 500);

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showSpeechBubble(newTheme === 'light' ? 'MY EYES' : 'Much better', avatar);
  });

  // Speech bubble
  const showSpeechBubble = (text, element) => {
    document.querySelectorAll('.speech-bubble').forEach(bubble => bubble.remove());

    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = text;
    document.body.appendChild(bubble);

    const rect = element.getBoundingClientRect();
    bubble.style.left = `${rect.left + rect.width / 2}px`;
    bubble.style.top = `${rect.top}px`;

    // Expanding bau effect
    if (text === 'bau') {
      let count = 1;
      const interval = setInterval(() => {
        count++;
        bubble.textContent = 'bau '.repeat(count).trim();
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        bubble.remove();
      }, 2500);
    } else {
      setTimeout(() => bubble.remove(), 3000);
    }
  };

  // Avatar click
  const phrases = [':3', '>_<', 'bau', 'miau'];
  avatar.addEventListener('click', () => {
    showSpeechBubble(phrases[Math.floor(Math.random() * phrases.length)], avatar);
  });

  // Name click
  const nameElement = document.querySelector('#name');
  if (nameElement) {
    const effects = [
      { transform: 'scale(1.15)', duration: 150 },
      { transform: 'rotate(15deg)', duration: 150 },
      { transform: 'rotate(-15deg)', duration: 150 },
      { transform: 'skew(10deg)', duration: 150 },
      { transform: 'skew(-10deg)', duration: 150 },
      { transform: 'translateY(-15px)', duration: 150 },
      { transform: 'translateX(-15px)', duration: 150 },
      { transform: 'translateX(15px)', duration: 150 },
      { transform: 'scale(0.9)', duration: 150 },
      { transform: 'rotateY(180deg)', duration: 200 },
    ];

    nameElement.addEventListener('click', () => {
      const effect = effects[Math.floor(Math.random() * effects.length)];
      nameElement.style.transition = `transform ${effect.duration}ms ease-out`;
      nameElement.style.transform = effect.transform;

      setTimeout(() => {
        nameElement.style.transform = '';
      }, effect.duration);
    });
  }

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab, .tab-panel').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // Discord username copy
  const discordBtn = document.getElementById('discord-btn');
  if (discordBtn) {
    discordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('robinmiau').then(() => {
        showSpeechBubble('Copied!', avatar);
      });
    });
  }
});
