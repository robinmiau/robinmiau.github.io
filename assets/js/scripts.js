document.addEventListener('DOMContentLoaded', () => {
  function calculateAge() {
    const birthDate = new Date('1999-01-23');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
      age -= 1;
    }
    return age;
  }

  function typeEffect(element, text, callback) {
    let index = 0;
    const interval = setInterval(() => {
      element.innerHTML = text.slice(0, index + 1) || ' ';
      index++;
      if (index === text.length) {
        clearInterval(interval);
        setTimeout(() => {
          deleteEffect(element, callback);
        }, 5000);
      }
    }, 100);
  }

  function deleteEffect(element, callback) {
    let text = element.textContent;
    const interval = setInterval(() => {
      text = text.slice(0, -1) || ' ';
      element.textContent = text;
      if (text === ' ') {
        clearInterval(interval);
        callback();
      }
    }, 50);
  }

  function updateSubtitle() {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;

    const age = calculateAge();
    const phrases = [
      'Web Developer',
      'Server Administrator',
      'Reverse Engineer',
      'Gamer',
      `${age} y/o`,
      'Based in Germany',
      'PHP & Node.js ftw',
      'Listening to Spotify',
      'Watching Anime',
      'Playing Fortnite',
    ];

    let index = 1;

    function loop() {
      deleteEffect(subtitle, () => {
        typeEffect(subtitle, phrases[index], () => {
          index = (index + 1) % phrases.length;
          loop();
        });
      });
    }

    loop();
  }

  function spawnSmiley(event) {
    const avatar = event.currentTarget;
    const expressions = [':3', '^_^', '>w<', '(*^_^*)', '(^o^)', '(*≧ω≦)', '(｡♥‿♥｡)'];

    const randomText = expressions[Math.floor(Math.random() * expressions.length)];

    const textElement = document.createElement('div');
    textElement.textContent = randomText;
    textElement.className = 'spawned-text';

    const avatarRect = avatar.getBoundingClientRect();
    const randomX = Math.random() * avatarRect.width - avatarRect.width / 2;
    textElement.style.left = `${avatarRect.left + avatarRect.width / 2 + randomX}px`;
    textElement.style.top = `${avatarRect.top - 20}px`;
    textElement.style.transform = `translateX(-50%)`;

    document.body.appendChild(textElement);
    textElement.addEventListener('animationend', () => {
      textElement.remove();
    });
  }

  const avatar = document.querySelector('.avatar');
  avatar.addEventListener('click', spawnSmiley);

  setTimeout(() => {
    updateSubtitle();
  }, 5000);
});
