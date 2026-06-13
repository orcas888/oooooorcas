// ===== Initialize FX background effects =====
(function initFX() {
  if (typeof HPX === 'undefined') return;
  const fxEls = document.querySelectorAll('[data-fx]');
  const instances = [];
  fxEls.forEach(el => {
    const name = el.getAttribute('data-fx');
    if (HPX[name]) {
      const inst = HPX[name](el);
      instances.push(inst);
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      instances.forEach(inst => { if (inst.stop) inst.stop(); });
    }
  });
})();

// ===== 导航栏滚动效果 =====
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// ===== 渲染作品网格 =====
(function renderWorks() {
  const grid = document.getElementById('worksGrid');
  if (!grid || !worksData) return;

  grid.innerHTML = worksData.map((work, index) => `
    <div class="work-card anim-parallax-tilt" data-index="${index}">
      <img class="work-thumb" src="${work.thumbnail}" alt="${work.title}"
           onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22640%22 height=%22360%22><rect fill=%22%230a1130%22 width=%22640%22 height=%22360%22/><text fill=%22%236a7a9e%22 font-size=%2220%22 x=%22250%22 y=%22190%22>${encodeURIComponent(work.title)}</text></svg>'">
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

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.work-card');
    if (!card) return;
    const index = parseInt(card.dataset.index, 10);
    openModal(index);
  });
})();

// ===== 视频播放弹窗 (支持 B 站嵌入 + 本地视频) =====
const modal = document.getElementById('videoModal');
const overlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('modalClose');
const wrapper = document.getElementById('modalVideoWrapper');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

function openModal(index) {
  const work = worksData[index];
  if (!work) return;

  modalTitle.textContent = work.title;
  modalDesc.textContent = work.description;

  // 清空 wrapper，根据类型创建播放器
  wrapper.innerHTML = '';

  if (work.type === 'bilibili') {
    const iframe = document.createElement('iframe');
    iframe.src = `//player.bilibili.com/player.html?bvid=${work.bvid}&autoplay=1&high_quality=1`;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    wrapper.appendChild(iframe);
  } else {
    const video = document.createElement('video');
    video.id = 'modalVideo';
    video.controls = true;
    video.preload = 'metadata';
    video.src = work.videoSrc;
    video.load();
    wrapper.appendChild(video);
    video.onloadeddata = () => {
      video.play().catch(() => {});
    };
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  wrapper.innerHTML = '';
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

// ===== 导航高亮 =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ===== 作品卡片入场动画 =====
const workCards = document.querySelectorAll('.work-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

workCards.forEach(el => cardObserver.observe(el));

// ===== 移动端菜单 =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.addEventListener('click', () => {
  navLinksContainer.classList.remove('open');
});
