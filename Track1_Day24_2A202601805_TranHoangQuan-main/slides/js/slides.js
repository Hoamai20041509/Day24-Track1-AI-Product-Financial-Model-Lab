/**
 * slides.js - Presentation Controller for Day 24 Lab (AI Product Financial Model & Unit Economics)
 */
document.addEventListener('DOMContentLoaded', () => {
  const timer = new LabTimerManager(LAB_DATA);
  window.labTimer = timer;

  let currentSlideIndex = 0;
  const totalSlides = 8; // 0: Hero, 1: Flow, 2-6: Phase 0-4, 7: End

  const slideViews = document.querySelectorAll('.slide-view');
  const currentSlideDisplay = document.getElementById('current-slide-num');
  const totalSlideDisplay = document.getElementById('total-slide-num');
  const stepDotsContainer = document.getElementById('step-dots-container');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  const headerStepTimerDisplay = document.getElementById('header-step-timer');
  const headerTotalTimerDisplay = document.getElementById('header-total-timer');
  const headerStepLabel = document.getElementById('header-step-label');
  const btnGlobalTimerToggle = document.getElementById('btn-global-timer-toggle');
  const btnGlobalTimerReset = document.getElementById('btn-global-timer-reset');

  if (totalSlideDisplay) totalSlideDisplay.innerText = totalSlides;

  function getStepIndexForSlide(slideIdx) {
    if (slideIdx >= 2 && slideIdx <= 6) {
      return slideIdx - 2;
    }
    return 0;
  }
  
  LAB_DATA.steps.forEach((step, idx) => {
    const descEl = document.getElementById(`desc-step-${idx}`);
    const cpEl = document.getElementById(`checkpoint-step-${idx}`);
    if (descEl) descEl.innerHTML = step.description;
    if (cpEl) {
      cpEl.innerHTML = step.checkpoints.map((cp, i) => `
        <div class="flex items-start gap-3">
          <i data-lucide="check-circle" class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"></i>
          <div><strong class="text-white">CP${i+1}:</strong> ${cp}</div>
        </div>
      `).join('');
    }
  });

  timer.subscribe((state) => {
    const activeStep = state.activeStep;
    if (headerStepTimerDisplay) {
      headerStepTimerDisplay.innerText = timer.formatTime(activeStep.remainingSeconds);
    }
    if (headerTotalTimerDisplay) {
      headerTotalTimerDisplay.innerText = timer.formatTime(state.totalRemainingSeconds);
    }
    if (headerStepLabel) {
      headerStepLabel.innerText = `PHASE ${activeStep.id.replace('step-', '')} (${Math.round(activeStep.allocatedSeconds / 60)}M)`;
    }

    if (btnGlobalTimerToggle) {
      btnGlobalTimerToggle.innerHTML = state.isRunning 
        ? '<i data-lucide="pause" class="w-4 h-4"></i>'
        : '<i data-lucide="play" class="w-4 h-4"></i>';
      btnGlobalTimerToggle.className = state.isRunning
        ? 'p-2 rounded-lg bg-amber-600 hover:bg-amber-500 active:scale-95 text-white transition flex items-center justify-center'
        : 'p-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white transition flex items-center justify-center';
    }

    const dynamicIsland = document.querySelector('.glass-island');
    if (dynamicIsland) {
      if (activeStep.remainingSeconds <= 30 && activeStep.remainingSeconds > 0 && state.isRunning) {
        dynamicIsland.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        dynamicIsland.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.3)';
      } else if (activeStep.remainingSeconds <= 120 && activeStep.remainingSeconds > 0 && state.isRunning) {
        dynamicIsland.style.borderColor = 'rgba(245, 158, 11, 0.5)';
        dynamicIsland.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.3)';
      } else {
        dynamicIsland.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        dynamicIsland.style.boxShadow = '0 0 30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset';
      }
    }

    LAB_DATA.steps.forEach((step, idx) => {
      const widget = document.getElementById(`step-timer-widget-${idx}`);
      if (!widget) return;

      const stepData = state.allSteps[idx];
      const timeDisplay = widget.querySelector('.step-time-text');
      const circleBar = widget.querySelector('.timer-circle-bar');
      const playBtn = widget.querySelector('.btn-step-play');

      if (timeDisplay) {
        timeDisplay.innerText = timer.formatTime(stepData.remainingSeconds);
      }

      if (circleBar) {
        const radius = 24;
        const circumference = 2 * Math.PI * radius;
        const progress = Math.max(0, Math.min(1, (stepData.allocatedSeconds - stepData.remainingSeconds) / stepData.allocatedSeconds));
        const offset = circumference * (1 - progress);
        circleBar.style.strokeDasharray = `${circumference}`;
        circleBar.style.strokeDashoffset = `${offset}`;

        if (stepData.remainingSeconds <= 30 && stepData.remainingSeconds > 0) {
          circleBar.style.stroke = '#ef4444';
        } else if (stepData.remainingSeconds <= 120 && stepData.remainingSeconds > 0) {
          circleBar.style.stroke = '#f59e0b';
        } else {
          circleBar.style.stroke = '#3b82f6';
        }
      }

      if (playBtn && idx === state.activeStepIndex) {
        playBtn.innerHTML = state.isRunning
          ? '<i data-lucide="pause" class="w-4 h-4"></i>'
          : '<i data-lucide="play" class="w-4 h-4"></i>';
      }
    });

    if (window.lucide) window.lucide.createIcons();
  });

  timer.onStepComplete = (completedStepIdx) => {
    // Tự động chuyển sang slide tiếp theo khi hết thời gian của Phase
    if (currentSlideIndex >= 2 && currentSlideIndex <= 6) {
      showSlide(currentSlideIndex + 1);
    }
  };

  function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentSlideIndex = index;

    slideViews.forEach((view, idx) => {
      if (idx === index) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    if (currentSlideDisplay) currentSlideDisplay.innerText = index + 1;

    const stepIdx = getStepIndexForSlide(index);
    timer.setActiveStep(stepIdx);

    updateNavigationDots();
    if (window.lucide) window.lucide.createIcons();
  }

  const slideLabels = [
    "Bìa", "Luồng 5 Phase", "Phase 0", "Phase 1", "Phase 2", "Phase 3", "Phase 4", "Tổng Kết"
  ];

  if (stepDotsContainer) {
    stepDotsContainer.innerHTML = '';
    slideLabels.forEach((label, idx) => {
      const btn = document.createElement('button');
      btn.className = `w-10 group-hover/sidebar:w-full h-10 rounded-xl flex items-center justify-start transition-all duration-300 relative group ${
        idx === 0 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10'
      }`;
      
      let labelChar = idx - 2;
      if (idx === 0) labelChar = 'H';
      if (idx === 1) labelChar = 'R';
      if (idx === 7) labelChar = 'E';
      
      btn.innerHTML = `
        <div class="flex items-center w-full px-3">
          <span class="font-mono text-xs font-bold shrink-0 w-4 text-center">${labelChar}</span>
          <span class="ml-3 font-mono text-sm whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 overflow-hidden w-0 group-hover/sidebar:w-auto">${label}</span>
        </div>
        <div class="absolute left-full ml-4 px-3 py-1.5 bg-black/90 border border-white/10 rounded-lg text-white text-xs whitespace-nowrap opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover/sidebar:!opacity-0 transition-all shadow-xl z-50">${label}</div>
      `;
      btn.onclick = () => showSlide(idx);
      stepDotsContainer.appendChild(btn);
    });
  }

  function updateNavigationDots() {
    if (!stepDotsContainer) return;
    const buttons = stepDotsContainer.querySelectorAll('button');
    buttons.forEach((btn, idx) => {
      if (idx === currentSlideIndex) {
        btn.className = 'w-10 group-hover/sidebar:w-full h-10 rounded-xl flex items-center justify-start transition-all duration-300 relative group bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] scale-110 group-hover/sidebar:scale-100';
      } else {
        btn.className = 'w-10 group-hover/sidebar:w-full h-10 rounded-xl flex items-center justify-start transition-all duration-300 relative group bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10';
      }
    });
  }

  if (btnPrev) btnPrev.onclick = () => showSlide(currentSlideIndex - 1);
  if (btnNext) btnNext.onclick = () => showSlide(currentSlideIndex + 1);

  if (btnGlobalTimerToggle) btnGlobalTimerToggle.onclick = () => timer.toggle();
  if (btnGlobalTimerReset) btnGlobalTimerReset.onclick = () => timer.resetActiveStep();

  if (btnFullscreen) {
    btnFullscreen.onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    };
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      showSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      showSlide(currentSlideIndex - 1);
    } else if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      timer.toggle();
    } else if (e.key === 'f' || e.key === 'F') {
      if (btnFullscreen) btnFullscreen.click();
    }
  });

  window.adjustStepTimer = (deltaSec) => {
    timer.adjustActiveStepTime(deltaSec);
  };

  window.resetCurrentStepTimer = () => {
    timer.resetActiveStep();
  };

  window.jumpToStep = (stepNumber) => {
    showSlide(stepNumber + 2);
  };

  showSlide(0);
});
