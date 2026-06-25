document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const avatar = document.getElementById('avatar');
  let activeBubble = null;
  let activeBubbleAnchor = null;

  const applyTheme = (theme) => {
    html.classList.add('theme-switching');
    html.setAttribute('data-theme', theme);
    html.offsetHeight;
    html.classList.remove('theme-switching');
  };

  // Keep theme in sync if the early head script could not read storage.
  try {
    applyTheme(localStorage.getItem('theme') || html.getAttribute('data-theme') || 'dark');
  } catch {
    applyTheme(html.getAttribute('data-theme') || 'dark');
  }

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
  const titles = ['Web Developer', 'Game Developer', 'Server Administrator'];
  const typedTextElement = document.getElementById('typed-text');
  let titleIndex = 0;
  let charIndex = titles[0].length;
  let isDeleting = true;
  typedTextElement.textContent = titles[0];

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

  setTimeout(type, 3500);

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // Theme still changes for this page even when storage is unavailable.
    }
    showSpeechBubble(newTheme === 'light' ? 'Too bright' : 'Much better', avatar);
  });

  // Speech bubble
  const positionSpeechBubble = (bubble, element) => {
    const rect = element.getBoundingClientRect();
    const viewportPadding = 16;
    const centeredLeft = rect.left + rect.width / 2;
    const minLeft = bubble.offsetWidth / 2 + viewportPadding;
    const maxLeft = window.innerWidth - bubble.offsetWidth / 2 - viewportPadding;
    bubble.style.left = `${Math.min(Math.max(centeredLeft, minLeft), maxLeft)}px`;
    bubble.style.top = `${Math.max(rect.top, bubble.offsetHeight + 24)}px`;
  };

  const repositionSpeechBubble = () => {
    if (activeBubble && activeBubbleAnchor) {
      positionSpeechBubble(activeBubble, activeBubbleAnchor);
    }
  };

  const showSpeechBubble = (text, element) => {
    document.querySelectorAll('.speech-bubble').forEach(bubble => bubble.remove());

    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = text;
    document.body.appendChild(bubble);

    activeBubble = bubble;
    activeBubbleAnchor = element;
    positionSpeechBubble(bubble, element);

    if (text === 'bau') {
      let count = 1;
      const interval = setInterval(() => {
        count++;
        bubble.textContent = 'bau '.repeat(count).trim();
        repositionSpeechBubble();
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        if (activeBubble === bubble) {
          activeBubble = null;
          activeBubbleAnchor = null;
        }
        bubble.remove();
      }, 2500);
    } else {
      setTimeout(() => {
        if (activeBubble === bubble) {
          activeBubble = null;
          activeBubbleAnchor = null;
        }
        bubble.remove();
      }, 3000);
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
      const targetPanel = document.getElementById(targetTab);
      document.querySelectorAll('.tab, .tab-panel').forEach(el => el.classList.remove('active', 'entering'));
      tab.classList.add('active');
      targetPanel.classList.add('active', 'entering');
      targetPanel.addEventListener('animationend', () => targetPanel.classList.remove('entering'), { once: true });
      requestAnimationFrame(repositionSpeechBubble);
      setTimeout(repositionSpeechBubble, 350);
    });
  });

  window.addEventListener('resize', repositionSpeechBubble);

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
