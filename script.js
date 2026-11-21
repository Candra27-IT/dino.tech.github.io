/* ---------- 1. TAHUN OTOMATIS DI FOOTER ---------- */
document.getElementById('year').textContent = new Date().getFullYear();


/* ---------- 2. HAMBURGER MENU ----------*/
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('menu');

function setMenu(buka) {
  navMenu.classList.toggle('open', buka);
  navToggle.setAttribute('aria-expanded', buka);                    
  navToggle.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
}

navToggle.addEventListener('click', function () {
  setMenu(!navMenu.classList.contains('open'));   
});

navMenu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () { setMenu(false); });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') setMenu(false);
});


/* ---------- 3. TEMA TERANG / GELAP ---------- */
const themeBtn = document.getElementById('theme-toggle');

function pasangTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);   
  themeBtn.setAttribute('aria-pressed', tema === 'dark');
}

pasangTema(document.documentElement.getAttribute('data-theme') || 'light');

themeBtn.addEventListener('click', function () {
  const sekarang = document.documentElement.getAttribute('data-theme');
  const berikutnya = sekarang === 'dark' ? 'light' : 'dark';
  pasangTema(berikutnya);
  try { localStorage.setItem('tema', berikutnya); } catch (e) { /* abaikan jika penyimpanan diblokir */ }
});


/* ---------- 4. EFEK MENGETIK DI JENDELA KODE ---------- */
const codeOutput = document.getElementById('code-output');

function properti(kunci, kelasNilai, nilai) {
  return [
    ['tk-pl', '  '],
    ['tk-prop', kunci],
    ['tk-pl', ': '],
    [kelasNilai, nilai],
    ['tk-pl', ',\n']
  ];
}

const potonganKode = [
  ['tk-kw', 'const '], ['tk-var', 'saya'], ['tk-pl', ' = {\n'],
  ...properti('nama', 'tk-str', '"Aldi Aldino Candra"'),
  ...properti('jurusan', 'tk-str', '"Informatika"'),
  ...properti('semester', 'tk-num', '1'),
  ...properti('sedangBelajar', 'tk-str', '["HTML", "CSS", "JS"]'),
  ...properti('kampus', 'tk-str', '"Universitas Pamulang"'),
  ...properti('siapKolaborasi', 'tk-kw', 'true'),
  ['tk-pl', '};']
];

const tunggu = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

async function ketikKode() {
  const tanpaAnimasi = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  codeOutput.textContent = '';
  const kursor = document.createElement('span');
  kursor.className = 'caret';
  codeOutput.appendChild(kursor);

  for (const [kelas, teks] of potonganKode) {
    const span = document.createElement('span');
    span.className = kelas;
    codeOutput.insertBefore(span, kursor);       

    if (tanpaAnimasi) { span.textContent = teks; continue; }

    for (const huruf of teks) {
      span.textContent += huruf;
      await tunggu(huruf === '\n' ? 140 : 32);  
    }
  }
}


const pengintaiKode = new IntersectionObserver(function (daftar, pengintai) {
  if (daftar[0].isIntersecting) {
    ketikKode();
    pengintai.disconnect();                
  }
}, { threshold: 0.4 });
pengintaiKode.observe(codeOutput.closest('.code-window'));


/* ---------- 5. BAR SKILL TERISI SAAT TERLIHAT ----------*/
const pengintaiBar = new IntersectionObserver(function (daftar, pengintai) {
  daftar.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.classList.add('filled');   
      pengintai.unobserve(item.target);    
    }
  });
}, { threshold: 0.4 });                    

document.querySelectorAll('.bar-fill').forEach(function (bar) {
  pengintaiBar.observe(bar);
});


/* ---------- 6. MENU AKTIF MENGIKUTI SCROLL ---------- */
const semuaSection = document.querySelectorAll('main section[id]');
const semuaLink = document.querySelectorAll('.nav-menu a');

const pengintaiSection = new IntersectionObserver(function (daftar) {
  daftar.forEach(function (item) {
    if (item.isIntersecting) {
      semuaLink.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + item.target.id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });   

semuaSection.forEach(function (sec) { pengintaiSection.observe(sec); });


/* ---------- 7. FORM KONTAK ---------- */
const EMAIL_TUJUAN = 'emailkamu@example.com';  

const form = document.getElementById('contact-form');
const statusForm = document.getElementById('form-status');
const inputNama = document.getElementById('f-name');
const inputEmail = document.getElementById('f-email');
const inputPesan = document.getElementById('f-message');

function tampilkanError(input, pesan) {
  document.getElementById(input.id + '-error').textContent = pesan;
  input.setAttribute('aria-invalid', pesan ? 'true' : 'false');
}

function validasiForm() {
  let valid = true;

  if (inputNama.value.trim() === '') {
    tampilkanError(inputNama, 'Isi nama kamu dulu ya.');
    valid = false;
  } else {
    tampilkanError(inputNama, '');
  }

  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!polaEmail.test(inputEmail.value.trim())) {
    tampilkanError(inputEmail, 'Tulis email yang valid, contoh: nama@email.com');
    valid = false;
  } else {
    tampilkanError(inputEmail, '');
  }

  if (inputPesan.value.trim().length < 10) {
    tampilkanError(inputPesan, 'Pesan minimal 10 karakter.');
    valid = false;
  } else {
    tampilkanError(inputPesan, '');
  }

  return valid;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();               
  statusForm.textContent = '';

  if (!validasiForm()) return;      

  const subjek = 'Pesan dari portofolio: ' + inputNama.value.trim();
  const isi = inputPesan.value.trim() + '\n\nDari: ' + inputNama.value.trim() + ' (' + inputEmail.value.trim() + ')';

  window.location.href = 'mailto:' + EMAIL_TUJUAN +
    '?subject=' + encodeURIComponent(subjek) +
    '&body=' + encodeURIComponent(isi);

  statusForm.textContent = 'Aplikasi email kamu akan terbuka. Tekan kirim di sana untuk menyelesaikan pesan.';
  form.reset();
});

[inputNama, inputEmail, inputPesan].forEach(function (input) {
  input.addEventListener('input', function () { tampilkanError(input, ''); });
});


/* ===== ANIMASI TAMBAHAN (bagian 8 dan seterusnya) ===== */
const modeHemat = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const bisaHover = window.matchMedia('(hover: hover)').matches;


/* ---------- 8. JUDUL MUNCUL KATA DEMI KATA + KATA PERAN BERGANTI ---------- */
const judulHero = document.querySelector('.hero h1');
if (judulHero && !modeHemat) {
  const kataKata = judulHero.textContent.trim().split(/\s+/);
  judulHero.textContent = '';
  kataKata.forEach(function (kata, i) {
    const span = document.createElement('span');
    span.className = 'word';
    span.style.setProperty('--i', i);                 
    span.textContent = kata;
    judulHero.appendChild(span);
    judulHero.appendChild(document.createTextNode(' '));
  });
}

const rotator = document.getElementById('rotator');
const daftarPeran = ['Web Enthusiast', 'Front-end Learner', 'Problem Solver', 'Calon Developer'];
let urutanPeran = 0;

if (rotator && !modeHemat) {
  setInterval(function () {
    rotator.classList.add('keluar');                  
    setTimeout(function () {
      urutanPeran = (urutanPeran + 1) % daftarPeran.length;
      rotator.textContent = daftarPeran[urutanPeran]; 
      rotator.classList.remove('keluar');
      rotator.classList.add('masuk');                 
      void rotator.offsetWidth;                       
      rotator.classList.remove('masuk');              
    }, 350);
  }, 2800);
}


/* ---------- 9. SCROLL: GARIS PROGRES, BAYANGAN HEADER, TOMBOL KE ATAS ---------- */
const garisProgres = document.getElementById('scroll-progress');
const headerSitus = document.querySelector('.site-header');
const tombolAtas = document.getElementById('to-top');

function saatScroll() {
  const tinggiTotal = document.documentElement.scrollHeight - window.innerHeight;
  const persen = tinggiTotal > 0 ? window.scrollY / tinggiTotal : 0;   // 0 sampai 1
  garisProgres.style.transform = 'scaleX(' + persen + ')';
  headerSitus.classList.toggle('scrolled', window.scrollY > 10);
  tombolAtas.classList.toggle('show', window.scrollY > 600);
}
window.addEventListener('scroll', saatScroll, { passive: true });
saatScroll();


/* ---------- 10. MUNCUL SAAT DI-SCROLL (SCROLL REVEAL) ---------- */
const daftarReveal = '.section-head, .about-text, .fact-list, .stat, .skill-panel, .project-card, .contact-links li, .contact-form';

document.querySelectorAll(daftarReveal).forEach(function (el) {
  el.classList.add('reveal');
  const saudara = Array.from(el.parentNode.children).filter(function (c) { return c.matches(daftarReveal); });
  el.style.setProperty('--d', saudara.indexOf(el));
});

document.querySelectorAll('.badge-list li').forEach(function (li) {
  li.style.setProperty('--i', Array.from(li.parentNode.children).indexOf(li));
});

const pengintaiReveal = new IntersectionObserver(function (daftar, pengintai) {
  daftar.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.classList.add('visible');
      pengintai.unobserve(item.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(function (el) { pengintaiReveal.observe(el); });


/* ---------- 11. ANGKA BERHITUNG ---------- */
function hitungNaik(el) {
  const target = Number(el.dataset.count);       
  const durasi = 1400;                          
  const mulai = performance.now();

  function langkah(sekarang) {
    const p = Math.min((sekarang - mulai) / durasi, 1);   
    const halus = 1 - Math.pow(1 - p, 3);                 
    el.textContent = Math.round(target * halus);
    if (p < 1) requestAnimationFrame(langkah);            
  }
  requestAnimationFrame(langkah);
}

if (!modeHemat) {
  const pengintaiAngka = new IntersectionObserver(function (daftar, pengintai) {
    daftar.forEach(function (item) {
      if (item.isIntersecting) { hitungNaik(item.target); pengintai.unobserve(item.target); }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-num').forEach(function (el) {
    el.textContent = '0';                       
    pengintaiAngka.observe(el);
  });
}


/* ---------- 12. KARTU PROYEK MIRING MENGIKUTI MOUSE (efek 3D) ---------- */
if (bisaHover && !modeHemat) {
  document.querySelectorAll('.project-card').forEach(function (kartu) {
    kartu.addEventListener('mousemove', function (e) {
      const kotak = kartu.getBoundingClientRect();
      const x = (e.clientX - kotak.left) / kotak.width - 0.5;    
      const y = (e.clientY - kotak.top) / kotak.height - 0.5;    
      kartu.style.transform =
        'perspective(800px) rotateY(' + (x * 9) + 'deg) rotateX(' + (-y * 9) + 'deg) translateY(-6px)';
    });
    kartu.addEventListener('mouseleave', function () { kartu.style.transform = ''; });
  });
}

/* ---------- 13. CAHAYA HERO MENGIKUTI KURSOR ---------- */
const heroSection = document.getElementById('home');
if (bisaHover && !modeHemat) {
  heroSection.addEventListener('pointermove', function (e) {
    const kotak = heroSection.getBoundingClientRect();
    heroSection.style.setProperty('--mx', (e.clientX - kotak.left) + 'px');   
    heroSection.style.setProperty('--my', (e.clientY - kotak.top) + 'px');
  });
}