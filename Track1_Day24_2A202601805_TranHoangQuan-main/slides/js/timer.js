/**
 * timer.js - High-Precision Multi-Step Countdown & Session Timer Engine for Day 24 Lab
 */
class LabTimerManager {
  constructor(labData) {
    this.data = labData;
    const totalMins = labData.metadata ? labData.metadata.totalDurationMinutes : labData.totalDurationMinutes;
    this.totalDurationSeconds = totalMins * 60;
    this.totalRemainingSeconds = this.totalDurationSeconds;
    
    this.stepStates = {};
    this.activeStepIndex = 0;
    this.isRunning = false;
    this.timerInterval = null;
    this.listeners = [];

    this.initStepStates();
  }

  initStepStates() {
    this.data.steps.forEach((step, index) => {
      const allocSecs = step.allocatedSeconds !== undefined ? step.allocatedSeconds : (step.timeBudget * 60);
      this.stepStates[index] = {
        id: step.id || `step-${index}`,
        title: step.title,
        shortTitle: step.shortTitle || step.title,
        allocatedSeconds: allocSecs,
        remainingSeconds: allocSecs,
        elapsedSeconds: 0,
        isCompleted: false,
        hasWarned: false
      };
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getState());
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  getState() {
    const activeStep = this.stepStates[this.activeStepIndex] || this.stepStates[0];
    return {
      isRunning: this.isRunning,
      activeStepIndex: this.activeStepIndex,
      activeStep: { ...activeStep },
      totalRemainingSeconds: this.totalRemainingSeconds,
      totalDurationSeconds: this.totalDurationSeconds,
      totalProgressPercent: Math.min(100, Math.max(0, ((this.totalDurationSeconds - this.totalRemainingSeconds) / this.totalDurationSeconds) * 100)),
      stepProgressPercent: Math.min(100, Math.max(0, ((activeStep.allocatedSeconds - activeStep.remainingSeconds) / activeStep.allocatedSeconds) * 100)),
      allSteps: { ...this.stepStates }
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.notify();

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.notify();
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  tick() {
    const activeStep = this.stepStates[this.activeStepIndex];
    if (activeStep) {
      activeStep.remainingSeconds--;
      activeStep.elapsedSeconds++;

      if (activeStep.remainingSeconds === 0) {
        this.playChime(880, 0.6);
        activeStep.isCompleted = true;
        if (typeof this.onStepComplete === 'function') {
          this.onStepComplete(this.activeStepIndex);
        }
      } else if (activeStep.remainingSeconds === 60 && !activeStep.hasWarned) {
        this.playChime(440, 0.2);
        activeStep.hasWarned = true;
      }
    }

    if (this.totalRemainingSeconds > 0) {
      this.totalRemainingSeconds--;
    }

    this.notify();
  }

  setActiveStep(stepIndex) {
    if (stepIndex in this.stepStates) {
      this.activeStepIndex = stepIndex;
      this.notify();
    }
  }

  adjustActiveStepTime(deltaSeconds) {
    const activeStep = this.stepStates[this.activeStepIndex];
    if (activeStep) {
      activeStep.remainingSeconds = Math.max(0, activeStep.remainingSeconds + deltaSeconds);
      activeStep.allocatedSeconds = Math.max(activeStep.allocatedSeconds, activeStep.remainingSeconds + activeStep.elapsedSeconds);
      this.notify();
    }
  }

  resetActiveStep() {
    const stepMeta = this.data.steps[this.activeStepIndex];
    const activeStep = this.stepStates[this.activeStepIndex];
    if (stepMeta && activeStep) {
      const allocSecs = stepMeta.allocatedSeconds !== undefined ? stepMeta.allocatedSeconds : (stepMeta.timeBudget * 60);
      activeStep.remainingSeconds = allocSecs;
      activeStep.elapsedSeconds = 0;
      activeStep.isCompleted = false;
      activeStep.hasWarned = false;
      this.notify();
    }
  }

  resetAll() {
    this.pause();
    this.totalRemainingSeconds = this.totalDurationSeconds;
    this.initStepStates();
    this.notify();
  }

  formatTime(seconds) {
    const isNegative = seconds < 0;
    const abs = Math.abs(seconds);
    const mins = Math.floor(abs / 60);
    const secs = abs % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return isNegative ? `-${str}` : str;
  }

  playChime(frequency = 660, duration = 0.4) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration * 0.5);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext chime disabled or not allowed by browser", e);
    }
  }
}

if (typeof window !== 'undefined') {
  window.LabTimerManager = LabTimerManager;
}
