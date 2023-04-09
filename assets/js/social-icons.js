const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach((icon) => {
  icon.addEventListener('click', (event) => {
    event.preventDefault();
    icon.classList.add('fadeOut');
    icon.addEventListener('animationend', () => {
      window.location.href = icon.getAttribute('href');
    }, {once: true});
  });
});
