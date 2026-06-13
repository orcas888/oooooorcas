// ===== 渲染作品网格 =====
(function renderWorks() {
  const grid = document.getElementById('worksGrid');
  if (!grid || !worksData) return;

  grid.innerHTML = worksData.map((work, index) => `
    <div class="work-card" data-index="${index}">
      <img class="work-thumb" src="${work.thumbnail}" alt="${work.title}"
           onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22640%22 height=%22360%22><rect fill=%22%23333%22 width=%22640%22 height=%22360%22/><text fill=%22%23888%22 font-size=%2220%22 x=%22250%22 y=%22190%22>${encodeURIComponent(work.title)}</text></svg>'">
      <div class="work-play-icon"></div>
      <div class="work-info">
        <h3 class="work-title">${work.title}</h3>
        <p class="work-desc">${work.description}</p>
        <div class="work-tags">
          ${work.tags ? work.tags.map(t => `<span class="tag">${t}</span>`).join('') : ''}
        </div>
      </div>
    </div>
  `).join('');

  // 点击卡片播放视频
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.work-card');
    if (!card) return;
    const index = parseInt(card.dataset.index, 10);
    openModal(index);
  });
})();

// ===== 视频播放弹窗 =====
const modal = document.getElementById('videoModal');
const overlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('modalClose');
const video = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

let currentVideoSrc = '';

function openModal(index) {
  const work = worksData[index];
  if (!work) return;

  currentVideoSrc = work.videoSrc;
  modalTitle.textContent = work.title;
  modalDesc.textContent = work.description;
  video.src = work.videoSrc;
  video.load();

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // 加载完成后自动播放
  video.onloadeddata = () => {
    video.play().catch(() => {});
  };
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  video.pause();
  video.src = '';
  currentVideoSrc = '';
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

// ===== 导航高亮 (Intersection Observer) =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, {
  rootMargin: '-40% 0px -55% 0px',
});

sections.forEach(s => observer.observe(s));

// ===== 滚动渐入动画 =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
});

revealEls.forEach(el => revealObserver.observe(el));

// ===== 移动端菜单 =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});

// 点击导航链接后关闭菜单
navLinksContainer.addEventListener('click', () => {
  navLinksContainer.classList.remove('open');
});
