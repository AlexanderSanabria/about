const projects = {
  squad: {
    title: 'Squad Arcade', category: 'Game architecture / Roguelike strategy', role: 'Game Technical Architect',
    description: 'A roguelike strategy game combining deckbuilding, squad positioning, automated combat, and tactical decisions in an 80s comic-book world.',
    contribution: 'Designed the core software architecture, established the technical foundations, and defined modular, reusable gameplay systems to support new mechanics and long-term development.',
    tags: ['Unreal Engine', 'C++', 'Software architecture', 'Gameplay systems'],
    images: [
      ['images/squad-arcade/key-art.jpg', 'Squad Arcade key art'],
      ['images/squad-arcade/battle.jpg', 'Squad Arcade comic-book battle'],
      ['images/squad-arcade/comic-pages.jpg', 'Squad Arcade route selection in comic pages']
    ],
    links: [['View on Steam', 'https://store.steampowered.com/app/3312170/Squad_Arcade/']]
  },
  fsx: {
    title: 'FSX Play Golf Simulator', category: 'Golf simulation / Desktop', role: 'Senior Programmer',
    description: 'A virtual golf simulator from Foresight Sports, built with the Unity graphics engine and connected to launch monitor data.',
    contribution: 'Worked as a senior programmer using C#, Unity, Windows Presentation Foundation, and UI graphics.',
    tags: ['Unity', 'C#', 'WPF', 'UI graphics'],
    images: [
      ['images/fsx-play/course-gameplay.jpg', 'FSX Play course simulation'],
      ['images/fsx-play/putting-grid.jpg', 'FSX Play putting grid'],
      ['images/fsx-play/course-library.jpg', 'FSX Play course library']
    ],
    links: [['Product site', 'https://www.foresightsports.com/pages/fsx-play'], ['Third-party video', 'https://youtu.be/VBUpLdmX4Z0']]
  },
  manikins: {
    title: 'Manikins: Relics and Tactics', category: 'Turn-based tactics / Game development', role: 'Lead Programmer',
    description: 'A turn-based tactical game where players control an army of manikins equipped with relics to defeat enemies.',
    contribution: 'Designed the game architecture and led the development team.',
    tags: ['Unity', 'C#', 'Game architecture', 'Team leadership'],
    images: [['images/manikins/climax.jpg', 'Manikins fantasy battle scene']],
    links: [['Watch video', 'https://youtu.be/PgeTyt62gk8']]
  },
  incantum: {
    title: 'Incantum', category: 'Mobile puzzle / Voice interaction', role: '',
    description: 'A colorful Android puzzle game set around a museum, spells, and interactive challenges.',
    contribution: 'Integrated Google speech recognition and AIML so voice input could trigger actions in the game.',
    tags: ['Unity', 'C#', 'Android', 'Speech recognition', 'AIML'],
    images: [
      ['images/incantum/title-screen.jpg', 'Incantum title screen'],
      ['images/incantum/museum-puzzle.jpg', 'Incantum museum puzzle'],
      ['images/incantum/spell-puzzle.jpg', 'Incantum spell puzzle']
    ],
    links: []
  },
  go: {
    title: 'Go Simulator', category: 'Surgical simulation / Voice interaction', role: '',
    description: 'A PC simulation set in a surgery room.',
    contribution: 'Built a system integrating Microsoft speech recognition so voice input could trigger actions in the simulation.',
    tags: ['Unity', 'PC', 'Microsoft speech recognition'],
    images: [], links: [['Watch video', 'https://youtu.be/tu2AXWlSskw']]
  },
  ibahell: {
    title: 'Welcome to Ibahell', category: '2D game / Gameplay', role: '',
    description: 'A vertical game with enemies, obstacles, and score-based play, as shown in the supplied screenshots.',
    contribution: '',
    tags: ['2D game', 'Gameplay'],
    images: [
      ['images/welcome-to-ibahell/gameplay-fire.jpg', 'Welcome to Ibahell fire obstacle sequence'],
      ['images/welcome-to-ibahell/gameplay-score.jpg', 'Welcome to Ibahell score gameplay'],
      ['images/welcome-to-ibahell/game-over.jpg', 'Welcome to Ibahell game over screen']
    ],
    links: [['Watch video', 'https://youtu.be/Qt0bCpEKjqg']]
  }
};

const dialog = document.querySelector('#project-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogCount = document.querySelector('#gallery-count');
const prev = document.querySelector('#gallery-prev');
const next = document.querySelector('#gallery-next');
let activeProject = null;
let activeImage = 0;
let opener = null;

function renderGallery() {
  const images = activeProject.images;
  const gallery = dialog.querySelector('.dialog-gallery');
  gallery.hidden = images.length === 0;
  if (!images.length) return;
  dialogImage.src = images[activeImage][0];
  dialogImage.alt = images[activeImage][1];
  dialogCount.textContent = `${activeImage + 1} / ${images.length}`;
  prev.hidden = next.hidden = images.length < 2;
  dialog.classList.toggle('no-gallery', false);
}

function openProject(key, button) {
  const project = projects[key];
  if (!project) return;
  opener = button;
  activeProject = project;
  activeImage = 0;
  dialog.querySelector('#dialog-title').textContent = project.title;
  dialog.querySelector('#dialog-category').textContent = project.category;
  const role = dialog.querySelector('#dialog-role');
  role.textContent = project.role;
  role.hidden = !project.role;
  dialog.querySelector('#dialog-description').textContent = project.description;
  const contribution = dialog.querySelector('#dialog-contribution');
  contribution.textContent = project.contribution;
  contribution.hidden = !project.contribution;
  dialog.querySelector('.dialog-contribution-label').hidden = !project.contribution;
  dialog.querySelector('.dialog-divider').hidden = !project.contribution;
  const tags = dialog.querySelector('#dialog-tags');
  tags.replaceChildren(...project.tags.map(label => {
    const span = document.createElement('span'); span.textContent = label; return span;
  }));
  const links = dialog.querySelector('#dialog-links');
  links.replaceChildren(...project.links.map(([label, url]) => {
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = `${label} ↗`; return a;
  }));
  dialog.classList.toggle('no-gallery', project.images.length === 0);
  renderGallery();
  dialog.showModal();
  dialog.querySelector('.dialog-close').focus();
}

document.querySelectorAll('[data-open-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.openProject, button)));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => opener?.focus());
prev.addEventListener('click', () => { activeImage = (activeImage - 1 + activeProject.images.length) % activeProject.images.length; renderGallery(); });
next.addEventListener('click', () => { activeImage = (activeImage + 1) % activeProject.images.length; renderGallery(); });
dialog.addEventListener('keydown', event => {
  if (!activeProject?.images.length) return;
  if (event.key === 'ArrowLeft') prev.click();
  if (event.key === 'ArrowRight') next.click();
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}));
