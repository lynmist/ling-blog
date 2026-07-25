let currentIndex = 0;
let currentPhotos = [];
let flipEl = null;

function renderGallery(photos) {
  const masonry = document.getElementById('masonry');
  if (!photos || photos.length === 0) {
    masonry.innerHTML = '<div class="empty"><p>还没有画</p></div>';
    return;
  }

  // distribute into N columns based on viewport, balancing by estimated height
  const colCount = window.innerWidth <= 640 ? 2 : window.innerWidth <= 900 ? 3 : 4;
  masonry.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;

  const cols = Array.from({ length: colCount }, () => ({ el: document.createElement('div'), height: 0 }));
  cols.forEach(c => { c.el.className = 'masonry-col'; });

  photos.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.index = i;
    const estHeight = 1 / (p.ratio || 1);

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.cap || '';
    img.loading = 'lazy';
    card.appendChild(img);

    if (p.cap) {
      const overlay = document.createElement('div');
      overlay.className = 'photo-card-overlay';
      overlay.innerHTML = `<span class="photo-card-cap">${p.cap}</span>`;
      card.appendChild(overlay);
    }

    card.addEventListener('click', () => openLightbox(i, img));

    // put into shortest column
    let target = cols[0];
    for (const c of cols) if (c.height < target.height) target = c;
    target.el.appendChild(card);
    target.height += estHeight;
  });

  masonry.innerHTML = '';
  cols.forEach(c => masonry.appendChild(c.el));
}

function openLightbox(index, sourceImgEl) {
  currentIndex = index;
  const p = currentPhotos[index];
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');

  lbImg.style.transition = '';
  lbImg.style.opacity = '1';
  lbImg.src = p.src;
  lbImg.alt = p.cap || '';
  document.getElementById('lb-cap').textContent = p.cap || '';
  document.getElementById('lb-index').textContent = `${index + 1} / ${currentPhotos.length}`;
  updateSourceLink(p);

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  // FLIP: animate a clone from the thumbnail's screen rect to the final lightbox image rect
  if (sourceImgEl) {
    const startRect = sourceImgEl.getBoundingClientRect();

    const clone = document.createElement('img');
    clone.src = sourceImgEl.src;
    clone.className = 'lb-flip-img';
    clone.style.left = startRect.left + 'px';
    clone.style.top = startRect.top + 'px';
    clone.style.width = startRect.width + 'px';
    clone.style.height = startRect.height + 'px';
    clone.style.transform = 'translate(0,0) scale(1)';
    document.body.appendChild(clone);
    flipEl = clone;

    lbImg.style.visibility = 'hidden';

    // wait one frame so the final image has rendered/laid out, then measure target rect
    requestAnimationFrame(() => {
      lb.classList.add('show');
      requestAnimationFrame(() => {
        const endRect = lbImg.getBoundingClientRect();
        const scaleX = endRect.width / startRect.width;
        const scaleY = endRect.height / startRect.height;
        const dx = endRect.left - startRect.left;
        const dy = endRect.top - startRect.top;
        clone.style.borderRadius = '8px';
        clone.style.boxShadow = '0 20px 60px rgba(0,0,0,0.35)';
        clone.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
        clone.style.transformOrigin = 'top left';

        setTimeout(() => {
          lbImg.style.visibility = 'visible';
          clone.remove();
          flipEl = null;
        }, 420);
      });
    });
  } else {
    lb.classList.add('show');
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const card = document.querySelector(`.photo-card[data-index="${currentIndex}"] img`);

  if (card) {
    const endRect = card.getBoundingClientRect();
    const startRect = lbImg.getBoundingClientRect();

    const clone = document.createElement('img');
    clone.src = lbImg.src;
    clone.className = 'lb-flip-img';
    clone.style.left = startRect.left + 'px';
    clone.style.top = startRect.top + 'px';
    clone.style.width = startRect.width + 'px';
    clone.style.height = startRect.height + 'px';
    clone.style.borderRadius = '8px';
    clone.style.boxShadow = '0 20px 60px rgba(0,0,0,0.35)';
    document.body.appendChild(clone);

    // fade out backdrop + ui while the clone flies back, but keep .open until done
    lb.classList.remove('show');
    lbImg.style.visibility = 'hidden';
    document.body.style.overflow = '';

    requestAnimationFrame(() => {
      const scaleX = endRect.width / startRect.width;
      const scaleY = endRect.height / startRect.height;
      const dx = endRect.left - startRect.left;
      const dy = endRect.top - startRect.top;
      clone.style.transformOrigin = 'top left';
      clone.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
      clone.style.borderRadius = '10px';
      clone.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
      setTimeout(() => {
        clone.remove();
        lbImg.style.visibility = 'visible';
        lb.classList.remove('open');
      }, 420);
    });
  } else {
    lb.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => {
      lb.classList.remove('open');
    }, 320);
  }
}

function navLightbox(delta) {
  currentIndex = (currentIndex + delta + currentPhotos.length) % currentPhotos.length;
  const p = currentPhotos[currentIndex];
  const lbImg = document.getElementById('lb-img');
  // cross-fade quickly between images without the FLIP morph (used for prev/next)
  lbImg.style.transition = 'opacity .15s ease';
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = p.src;
    lbImg.alt = p.cap || '';
    document.getElementById('lb-cap').textContent = p.cap || '';
    document.getElementById('lb-index').textContent = `${currentIndex + 1} / ${currentPhotos.length}`;
    updateSourceLink(p);
    lbImg.style.opacity = '1';
  }, 150);
}

function updateSourceLink(photo) {
  const btn = document.getElementById('lb-source');
  if (photo && photo.source) {
    btn.href = photo.source;
    btn.style.display = 'flex';
  } else {
    btn.style.display = 'none';
  }
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => navLightbox(-1));
document.getElementById('lb-next').addEventListener('click', () => navLightbox(1));
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navLightbox(-1);
  if (e.key === 'ArrowRight') navLightbox(1);
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => renderGallery(currentPhotos), 200);
});

// init
currentPhotos = PHOTOS;
renderGallery(currentPhotos);
