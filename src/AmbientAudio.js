// Lightweight, zero-dependency Web Audio API synthesizer playing a gentle,
// dreamy warm electric-piano loop ("Blue Moon" I-vi-ii-V progression) with soft air.

const CHORDS = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0], // Am7
  [293.66, 349.23, 440.0, 523.25], // Dm7
  [196.0, 246.94, 329.63, 392.0], // G13
]

export class AmbientChordPlayer {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.timer = null
    this.chordIndex = 0
    this.playing = false
  }

  start() {
    if (this.playing) return true
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return false

    if (!this.ctx) {
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.14
      this.masterGain.connect(this.ctx.destination)
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    this.playing = true
    this.triggerChord()
    this.timer = window.setInterval(() => this.triggerChord(), 3400)
    return true
  }

  triggerChord() {
    if (!this.ctx || !this.playing) return
    const now = this.ctx.currentTime
    const notes = CHORDS[this.chordIndex % CHORDS.length]
    this.chordIndex += 1

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const sub = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const noteGain = this.ctx.createGain()

      osc.type = 'sine'
      sub.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.09)
      sub.frequency.setValueAtTime(freq * 2, now + idx * 0.09)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(920, now)

      const startAt = now + idx * 0.09
      noteGain.gain.setValueAtTime(0.0001, startAt)
      noteGain.gain.linearRampToValueAtTime(0.16, startAt + 0.32)
      noteGain.gain.exponentialRampToValueAtTime(0.0008, startAt + 3.1)

      const subGain = this.ctx.createGain()
      subGain.gain.value = 0.03

      osc.connect(filter)
      sub.connect(subGain)
      subGain.connect(filter)
      filter.connect(noteGain)
      noteGain.connect(this.masterGain)

      osc.start(startAt)
      sub.start(startAt)
      osc.stop(startAt + 3.2)
      sub.stop(startAt + 3.2)
    })
  }

  stop() {
    this.playing = false
    if (this.timer) {
      window.clearInterval(this.timer)
      this.timer = null
    }
  }

  dispose() {
    this.stop()
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
  }
}
