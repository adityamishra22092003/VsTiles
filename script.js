/* ============================================
   FEATURE-DETECTION
   Every enhancement below checks for its own
   dependency and degrades gracefully if missing.
   Each block is isolated in try/catch so one
   failure can never take down the rest of the page.
   ============================================ */
var hasGSAP   = (typeof gsap !== 'undefined');
var hasScroll = hasGSAP && (typeof ScrollTrigger !== 'undefined');
var hasLenis  = (typeof Lenis !== 'undefined');
var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

if(hasGSAP && hasScroll){
  try{ gsap.registerPlugin(ScrollTrigger); } catch(e){ hasScroll = false; }
}

/* ============================================
   IMAGE FALLBACKS
   Any broken/blocked image quietly becomes a
   dark tile instead of a broken-icon gap.
   ============================================ */
try{
  document.querySelectorAll('img').forEach(function(img){
    img.addEventListener('error', function onErr(){
      img.removeEventListener('error', onErr);
      img.style.background = 'linear-gradient(135deg,#1c1c1c,#0b0b0b)';
      img.style.minHeight = img.style.minHeight || '100%';
      img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="%230f0f0f"/></svg>');
    }, { once:true });
  });
}catch(e){ /* non-critical */ }

/* ============================================
   LENIS SMOOTH SCROLL (guarded, single raf loop)
   ============================================ */
var lenis = null;
try{
  if(hasLenis && !prefersReducedMotion){
    lenis = new Lenis({ duration: 1.1, easing: function(t){ return 1 - Math.pow(1-t, 3); }, smoothWheel:true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if(hasScroll) lenis.on('scroll', ScrollTrigger.update);
  }
}catch(e){ lenis = null; }

/* ============================================
   MOBILE MENU (no dependencies)
   ============================================ */
try{
  var burger = document.getElementById('burger');
  var navMenu = document.getElementById('navMenu');
  if(burger && navMenu){
    burger.addEventListener('click', function(){
      burger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        burger.classList.remove('open'); navMenu.classList.remove('open');
      });
    });
  }
}catch(e){ /* non-critical */ }

/* ============================================
   NEWSLETTER SIGNUP
   ============================================ */
try{
  var newsletterInput = document.querySelector('.newsletter input');
  var newsletterBtn = document.querySelector('.newsletter button');
  if(newsletterInput && newsletterBtn){
   function handleNewsletterSubmit(){
     var email = (newsletterInput.value || '').trim();
     if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
       newsletterInput.setAttribute('aria-invalid', 'true');
       newsletterInput.placeholder = 'Please enter a valid email';
       newsletterInput.focus();
       return;
     }

     newsletterInput.setAttribute('aria-invalid', 'false');
     newsletterBtn.textContent = 'Subscribed ✓';
     newsletterBtn.disabled = true;
     newsletterInput.value = '';
     newsletterInput.placeholder = 'Thanks for subscribing';
   }

   newsletterBtn.addEventListener('click', handleNewsletterSubmit);
   newsletterInput.addEventListener('keydown', function(e){
     if(e.key === 'Enter') handleNewsletterSubmit();
   });
  }
}catch(e){ /* non-critical */ }

/* ============================================
   NAVBAR SCROLLED STATE
   ============================================ */
try{
  var navbar = document.getElementById('navbar');
  var navTicking = false;
  function updateNavbar(){
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    navbar.classList.toggle('scrolled', y > 40);
    navTicking = false;
  }
  window.addEventListener('scroll', function(){
    if(!navTicking){
      navTicking = true;
      requestAnimationFrame(updateNavbar);
    }
  }, { passive:true });
  updateNavbar();
}catch(e){ /* non-critical */ }

/* ============================================
   MOUSE SPOTLIGHT & CURSOR RADIAL GLOW
   Updates CSS custom variables --mouse-x, --mouse-y
   ============================================ */
try{
  if(!isCoarsePointer){
    window.addEventListener('mousemove', function(e){
      document.querySelectorAll('.tile-card, .proj-card, .t-card, .calc-card').forEach(function(card){
        var r = card.getBoundingClientRect();
        if(e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom){
          card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
          card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
        }
      });
    });
  }
}catch(e){ /* non-critical */ }

/* ============================================
   MAGNETIC BUTTONS + RIPPLE
   ============================================ */
try{
  document.querySelectorAll('[data-magnetic]').forEach(function(btn){
    btn.style.transition = 'transform .5s cubic-bezier(.16,.84,.44,1)';
    if(!isCoarsePointer){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var relX = e.clientX - r.left - r.width/2;
        var relY = e.clientY - r.top - r.height/2;
        btn.style.transform = 'translate(' + (relX*0.3) + 'px,' + (relY*0.4) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){
        btn.style.transform = 'translate(0,0)';
      });
    }
    btn.addEventListener('click', function(e){
      var r = document.createElement('span');
      r.className = 'btn-ripple';
      var rect = btn.getBoundingClientRect();
      r.style.left = (e.clientX-rect.left)+'px';
      r.style.top = (e.clientY-rect.top)+'px';
      btn.appendChild(r);
      setTimeout(function(){ r.remove(); }, 700);
    });
  });
}catch(e){ /* non-critical */ }

/* ============================================
   3D TILT ON COLLECTION CARDS
   ============================================ */
try{
  if(!isCoarsePointer){
    document.querySelectorAll('.tile-card[data-tilt]').forEach(function(card){
      card.style.transition = 'transform .5s cubic-bezier(.16,.84,.44,1), border-color .5s';
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left)/r.width - 0.5;
        var py = (e.clientY - r.top)/r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (px*10) + 'deg) rotateX(' + (-py*10) + 'deg)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      });
    });
  }
}catch(e){ /* non-critical */ }

/* ============================================
   COLLECTION CATEGORY FILTER TABS
   ============================================ */
try{
  var filterBtns = document.querySelectorAll('.filter-btn');
  var tileCards = document.querySelectorAll('.tile-card');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;

      tileCards.forEach(function(card){
        var cat = card.dataset.category;
        if(filter === 'all' || cat === filter){
          card.classList.remove('filtered-out');
          if(hasGSAP){
            gsap.fromTo(card, { opacity:0, scale:0.92 }, { opacity:1, scale:1, duration:0.4, ease:'power2.out' });
          }
        }else{
          card.classList.add('filtered-out');
        }
      });
    });
  });
}catch(e){ /* non-critical */ }

/* ============================================
   INTERACTIVE SHOWROOM HOTSPOTS
   ============================================ */
try{
  var hotspotPins = document.querySelectorAll('.hotspot-pin');
  hotspotPins.forEach(function(pin){
    var title = pin.dataset.title || '';
    var desc = pin.dataset.desc || '';
    
    var tooltip = document.createElement('div');
    tooltip.className = 'hotspot-tooltip';
    tooltip.innerHTML = '<strong>' + title + '</strong><p>' + desc + '</p>';
    pin.appendChild(tooltip);

    pin.addEventListener('click', function(e){
      e.stopPropagation();
      var wasActive = pin.classList.contains('active');
      hotspotPins.forEach(function(p){ p.classList.remove('active'); });
      if(!wasActive) pin.classList.add('active');
    });
  });
  document.addEventListener('click', function(){
    hotspotPins.forEach(function(p){ p.classList.remove('active'); });
  });
}catch(e){ /* non-critical */ }

/* ============================================
   TILE REQUIREMENT CALCULATOR LOGIC
   ============================================ */
try{
  var calcSqFt = document.getElementById('calcSqFt');
  var calcSqFtVal = document.getElementById('calcSqFtVal');
  var calcTileSize = document.getElementById('calcTileSize');
  var calcFinish = document.getElementById('calcFinish');
  var resBoxes = document.getElementById('resBoxes');
  var resPieces = document.getElementById('resPieces');
  var resTotalArea = document.getElementById('resTotalArea');
  var resFinish = document.getElementById('resFinish');
  var resTier = document.getElementById('resTier');
  var resPriceEst = document.getElementById('resPriceEst');
  var calcWaBtn = document.getElementById('calcWaBtn');

  function calculateTileRequirements(){
    if(!calcSqFt || !calcTileSize) return;
    var sqft = parseFloat(calcSqFt.value) || 350;
    if(calcSqFtVal) calcSqFtVal.textContent = sqft.toLocaleString('en-IN') + ' Sq. Ft';

    var selectedOpt = calcTileSize.options[calcTileSize.selectedIndex];
    var boxCoverageSqFt = parseFloat(selectedOpt.dataset.boxcoverage || selectedOpt.value) || 16;
    var pcsPerBox = parseInt(selectedOpt.dataset.pcs) || 2;
    var tileName = selectedOpt.dataset.name || 'Tile';
    var baseMinRate = parseFloat(selectedOpt.dataset.minprice) || 50;
    var baseMaxRate = parseFloat(selectedOpt.dataset.maxprice) || 90;

    var finishName = (calcFinish && calcFinish.options[calcFinish.selectedIndex]) ? calcFinish.options[calcFinish.selectedIndex].value : 'Mat Digital Carving';

    var boxes = Math.ceil(sqft / boxCoverageSqFt);
    var pieces = boxes * pcsPerBox;

    // Quantity-dependent Volume Pricing Tiers:
    // < 250 Sq.Ft  -> Standard Retail (1.0x)
    // 250–999 Sq.Ft -> Semi-Bulk (0.88x / 12% Volume Discount)
    // >= 1000 Sq.Ft -> Wholesale Project (0.78x / 22% Volume Discount)
    var tierName = 'Retail Tier';
    var tierMultiplier = 1.0;

    if(sqft >= 1000){
      tierName = 'Wholesale Project (22% Off)';
      tierMultiplier = 0.78;
    } else if(sqft >= 250){
      tierName = 'Semi-Bulk (12% Off)';
      tierMultiplier = 0.88;
    }

    var minPrice = Math.round(sqft * baseMinRate * tierMultiplier);
    var maxPrice = Math.round(sqft * baseMaxRate * tierMultiplier);

    if(resBoxes) resBoxes.textContent = boxes.toLocaleString('en-IN');
    if(resPieces) resPieces.textContent = pieces.toLocaleString('en-IN');
    if(resTotalArea) resTotalArea.textContent = sqft.toLocaleString('en-IN') + ' Sq. Ft';
    if(resFinish) resFinish.textContent = finishName;
    if(resTier) resTier.textContent = tierName;
    if(resPriceEst) resPriceEst.textContent = '₹' + minPrice.toLocaleString('en-IN') + ' — ₹' + maxPrice.toLocaleString('en-IN');

    if(calcWaBtn){
      var waMsg = encodeURIComponent(
        'Hi Tile Wale Bhaiya,\nI calculated my tile requirement:\n• Area: ' + sqft + ' Sq. Ft (' + tierName + ')\n• Tile Size: ' + tileName + '\n• Surface Finish: ' + finishName + '\n• Boxes Needed: ' + boxes + ' Boxes (' + pieces + ' Pcs)\n• Est. Total Price: ₹' + minPrice.toLocaleString('en-IN') + ' — ₹' + maxPrice.toLocaleString('en-IN') + '\nPlease send me catalogs & final quotation.'
      );
      calcWaBtn.href = 'https://wa.me/916232798194?text=' + waMsg;
    }
  }

  if(calcSqFt) calcSqFt.addEventListener('input', calculateTileRequirements);
  if(calcTileSize) calcTileSize.addEventListener('change', calculateTileRequirements);
  if(calcFinish) calcFinish.addEventListener('change', calculateTileRequirements);

  calculateTileRequirements();
}catch(e){ /* non-critical */ }

/* ============================================
   QUICK VIEW MATERIAL SPEC MODAL
   ============================================ */
try{
  var modalBackdrop = document.getElementById('quickModalBackdrop');
  var modalCloseBtn = document.getElementById('modalCloseBtn');
  var modalImg = document.getElementById('modalImg');
  var modalTitle = document.getElementById('modalTitle');
  var modalDesc = document.getElementById('modalDesc');
  var modalTag = document.getElementById('modalTag');
  var modalSizes = document.getElementById('modalSizes');
  var modalOrigin = document.getElementById('modalOrigin');
  var modalFinish = document.getElementById('modalFinish');
  var modalWaBtn = document.getElementById('modalWaBtn');

  document.querySelectorAll('.tile-card').forEach(function(card){
    card.addEventListener('click', function(){
      var name = card.dataset.name || 'Luxury Surface';
      var desc = card.dataset.desc || '';
      var img = card.dataset.img || card.querySelector('img').src;
      var sizes = card.dataset.sizes || 'Custom Sizes';
      var origin = card.dataset.origin || 'Imported';
      var finish = card.dataset.finish || 'Polished Glaze';
      var num = card.querySelector('.num') ? card.querySelector('.num').textContent : 'COLLECTION';

      if(modalTitle) modalTitle.textContent = name;
      if(modalDesc) modalDesc.textContent = desc;
      if(modalImg) modalImg.src = img;
      if(modalTag) modalTag.textContent = num;
      if(modalSizes) modalSizes.textContent = sizes;
      if(modalOrigin) modalOrigin.textContent = origin;
      if(modalFinish) modalFinish.textContent = finish;

      if(modalWaBtn){
        var msg = encodeURIComponent('Hi Tile Wale Bhaiya, I would like to inquire about: ' + name + ' (' + sizes + ', ' + finish + ').');
        modalWaBtn.href = 'https://wa.me/916232798194?text=' + msg;
      }

      if(modalBackdrop) modalBackdrop.classList.add('open');
    });
  });

  function closeModal(){ if(modalBackdrop) modalBackdrop.classList.remove('open'); }
  if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if(modalBackdrop){
    modalBackdrop.addEventListener('click', function(e){
      if(e.target === modalBackdrop) closeModal();
    });
  }
  window.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
}catch(e){ /* non-critical */ }

/* ============================================
   SCROLL PROGRESS RING & BACK-TO-TOP BUTTON
   ============================================ */
try{
  var backToTop = document.getElementById('backToTop');
  var scrollProgressCircle = document.getElementById('scrollProgressCircle');
  var circumference = 113.097; // 2 * pi * r (r=18)

  if(scrollProgressCircle){
    scrollProgressCircle.style.strokeDasharray = circumference;
    scrollProgressCircle.style.strokeDashoffset = circumference;
  }

  function handleScrollProgress(){
    var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPct = Math.min(Math.max(scrollTop / (docHeight || 1), 0), 1);

    if(scrollProgressCircle){
      scrollProgressCircle.style.strokeDashoffset = circumference * (1 - scrollPct);
    }
    if(backToTop){
      if(scrollTop > 350) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollProgress, { passive:true });

  if(backToTop){
    backToTop.addEventListener('click', function(){
      if(lenis) lenis.scrollTo(0);
      else window.scrollTo({ top:0, behavior:'smooth' });
    });
  }
}catch(e){ /* non-critical */ }

/* ============================================
   SCROLL REVEALS (IntersectionObserver)
   ============================================ */
try{
  if('IntersectionObserver' in window){
    var revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-blur');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  }else{
    document.querySelectorAll('.reveal, .reveal-scale, .reveal-blur').forEach(function(el){
      el.classList.add('in-view');
    });
  }
}catch(e){
  document.querySelectorAll('.reveal, .reveal-scale, .reveal-blur').forEach(function(el){
    el.classList.add('in-view');
  });
}

/* ============================================
   COUNTER ANIMATION — IntersectionObserver + rAF
   ============================================ */
try{
  var counters = document.querySelectorAll('.count');
  function runCounter(el){
    var target = +el.dataset.target || 0;
    var start = null;
    var duration = 2200;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/duration, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.floor(eased*target).toLocaleString('en-IN');
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN');
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var cIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ runCounter(entry.target); cIo.unobserve(entry.target); }
      });
    }, { threshold:0.6 });
    counters.forEach(function(c){ cIo.observe(c); });
  }else{
    counters.forEach(runCounter);
  }
}catch(e){
  document.querySelectorAll('.count').forEach(function(el){
    el.textContent = (+el.dataset.target || 0).toLocaleString('en-IN');
  });
}

/* ============================================
   HERO ENTRANCE ANIMATION (GSAP-enhanced)
   ============================================ */
try{
  var heroTitle = document.getElementById('heroTitle');
  if(hasGSAP && !prefersReducedMotion && heroTitle){
    var lines = heroTitle.querySelectorAll('.line');
    lines.forEach(function(line){
      var text = line.textContent;
      line.innerHTML = '';
      text.split('').forEach(function(ch){
        var span = document.createElement('span');
        span.className = 'char';
        span.textContent = (ch === ' ') ? '\u00A0' : ch;
        if(line.classList.contains('accent-line')) span.classList.add('accent');
        line.appendChild(span);
      });
    });

    var heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .to('.hero-eyebrow', { opacity:1, duration:0.8, ease:'power2.out' })
      .to('.hero-title .char', { opacity:1, y:0, rotate:0, duration:1, ease:'power4.out', stagger:0.028 }, '-=0.4')
      .to('#heroSub', { opacity:1, y:0, duration:1, ease:'power3.out' }, '-=0.5')
      .to('.hero-actions .btn', { opacity:1, y:0, duration:0.8, ease:'power3.out', stagger:0.15 }, '-=0.6')
      .to('.scroll-indicator', { opacity:1, duration:0.8 }, '-=0.4');
  }else{
    document.querySelectorAll('.hero-eyebrow, .hero-sub, .hero-actions .btn, .scroll-indicator').forEach(function(el){
      el.style.opacity = '1'; el.style.transform = 'none';
    });
  }
}catch(e){
  document.querySelectorAll('.hero-eyebrow, .hero-sub, .hero-actions .btn, .scroll-indicator, .hero-title .char').forEach(function(el){
    el.style.opacity = '1'; el.style.transform = 'none';
  });
}

/* Mouse parallax on hero */
try{
  if(hasGSAP && !isCoarsePointer && !prefersReducedMotion){
    var heroContent = document.querySelector('.hero-content');
    var heroImg = document.getElementById('heroImg');
    window.addEventListener('mousemove', function(e){
      var relX = (e.clientX / window.innerWidth - 0.5);
      var relY = (e.clientY / window.innerHeight - 0.5);
      if(heroContent) gsap.to(heroContent, { x: relX*18, y: relY*10, duration:1, ease:'power2.out', overwrite:'auto' });
      if(heroImg) gsap.to(heroImg, { x: relX*-24, y: relY*-14, duration:1.4, ease:'power2.out', overwrite:'auto' });
    });
  }
}catch(e){ /* non-critical */ }

/* Ambient hero gradient drift */
try{
  if(hasGSAP && !prefersReducedMotion){
    gsap.to('.hero-overlay', { backgroundPosition:'50% 20%', duration:14, ease:'sine.inOut', yoyo:true, repeat:-1 });
  }
}catch(e){ /* non-critical */ }

/* ============================================
   PARTICLES CANVAS
   ============================================ */
try{
  if(!prefersReducedMotion && !isCoarsePointer){
    var canvas = document.getElementById('particles-canvas');
    var ctx = canvas && canvas.getContext && canvas.getContext('2d');
    if(ctx){
      var W, H, particles = [];
      function resizeCanvas(){ W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
      function initParticles(){
        particles = [];
        var count = window.innerWidth < 700 ? 26 : 55;
        for(var i=0;i<count;i++){
          particles.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.8+0.4, vy:Math.random()*0.4+0.1, vx:(Math.random()-0.5)*0.15, o:Math.random()*0.5+0.15 });
        }
      }
      function animateParticles(){
        ctx.clearRect(0,0,W,H);
        particles.forEach(function(p){
          p.y -= p.vy; p.x += p.vx;
          if(p.y < -10){ p.y = H+10; p.x = Math.random()*W; }
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle = 'rgba(63,199,184,' + p.o + ')';
          ctx.fill();
        });
        requestAnimationFrame(animateParticles);
      }
      resizeCanvas(); initParticles(); animateParticles();
      window.addEventListener('resize', function(){ resizeCanvas(); initParticles(); });
    }
  }
}catch(e){ /* non-critical */ }

/* ============================================
   PROJECTS HORIZONTAL SCROLL WITH GSAP
   ============================================ */
try{
  if(hasScroll && !prefersReducedMotion && !isCoarsePointer){
    window.addEventListener('load', function(){
      try{
        var track = document.getElementById('horizTrack');
        var wrap = document.querySelector('.horiz-wrap');
        if(track && wrap){
          var scrollAmount = track.scrollWidth - window.innerWidth;
          if(scrollAmount > 0){
            wrap.style.overflow = 'hidden';
            gsap.to(track, {
              x: -scrollAmount,
              ease:'none',
              scrollTrigger:{
                trigger:'.projects-section',
                start:'top top',
                end: function(){ return '+=' + (scrollAmount+200); },
                scrub:1,
                pin:true,
                invalidateOnRefresh:true
              }
            });
          }
        }
        ScrollTrigger.refresh();
      }catch(e){ /* fall back to native horizontal scroll */ }
    });
  }
}catch(e){ /* non-critical */ }

/* ============================================
   SAFETY NET
   ============================================ */
window.addEventListener('load', function(){
  setTimeout(function(){
    try{
      document.querySelectorAll(
        '.hero-eyebrow, .hero-sub, .hero-actions .btn, .scroll-indicator, .hero-title .char, .reveal, .reveal-scale, .reveal-blur'
      ).forEach(function(el){
        if(parseFloat(getComputedStyle(el).opacity) < 1){
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.filter = 'none';
        }
      });
    }catch(e){ /* nothing more */ }
  }, 3500);
});