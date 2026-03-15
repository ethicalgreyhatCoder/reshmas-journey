import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BengaliCharacter, CHAPTER_1_DATA } from '../data/chapter1.data';
import { CHAPTER_2_DATA } from '../data/chapter2.data';
import { CHAPTER_3_DATA } from '../data/chapter3.data';
import { CHAPTER_4_DATA } from '../data/chapter4.data';

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  data: BengaliCharacter[];
}

@Component({
  selector: 'app-learn-bengali',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learn-bengali.html',
  styleUrl: './learn-bengali.css',
})
export class LearnBengali implements OnInit {
  chapters: Chapter[] = [
    { id: 1, title: 'Chapter 1', subtitle: 'Vowels (স্বরবর্ণ)', data: CHAPTER_1_DATA },
    { id: 2, title: 'Chapter 2', subtitle: 'Consonants (ব্যঞ্জনবর্ণ)', data: CHAPTER_2_DATA },
    { id: 3, title: 'Chapter 3', subtitle: 'Vowel Signs (কার)', data: CHAPTER_3_DATA },
    { id: 4, title: 'Chapter 4', subtitle: 'How to Pronounce (শব্দ)', data: CHAPTER_4_DATA }
  ];

  selectedChapter: Chapter = this.chapters[0];
  viewState: 'chapterList' | 'learning' | 'testSetup' | 'testing' = 'chapterList';

  // Dialog State
  selectedLetterForDialog: BengaliCharacter | null = null;

  // Test state
  requestedQuestionCount = 5;
  testQuestions: BengaliCharacter[] = [];
  currentQuestionIndex = 0;
  currentTestQuestion: BengaliCharacter | null = null;
  testOptions: BengaliCharacter[] = [];
  testResult: 'correct' | 'incorrect' | null = null;
  selectedOption: BengaliCharacter | null = null;
  score = 0;
  testFinished = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.viewState = 'chapterList';
  }

  goBack() {
    if (this.viewState === 'testing' || this.viewState === 'testSetup' || this.viewState === 'learning') {
      this.viewState = 'chapterList';
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  selectChapter(chapter: Chapter) {
    this.selectedChapter = chapter;
    this.viewState = 'learning';
  }

  openDialog(char: BengaliCharacter) {
    if (this.selectedChapter.id <= 3 && char.imageUrl) {
      this.selectedLetterForDialog = char;
    }
  }

  closeDialog() {
    this.selectedLetterForDialog = null;
  }

  playSound(char: BengaliCharacter) {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = char.relatedWord
      ? `${char.name}... ${char.relatedWord.pronunciation}`
      : char.name;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 0.7;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  openTestSetup() {
    this.viewState = 'testSetup';
    this.requestedQuestionCount = Math.min(5, this.selectedChapter.data.length);
  }

  startTest() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.testFinished = false;

    const maxQs = this.selectedChapter.data.length;
    if (this.requestedQuestionCount > maxQs) this.requestedQuestionCount = maxQs;
    if (this.requestedQuestionCount < 1) this.requestedQuestionCount = 1;

    const shuffledData = [...this.selectedChapter.data].sort(() => Math.random() - 0.5);
    this.testQuestions = shuffledData.slice(0, this.requestedQuestionCount);

    this.viewState = 'testing';
    this.loadNextQuestion();
  }

  loadNextQuestion() {
    if (this.currentQuestionIndex >= this.testQuestions.length) {
      this.testFinished = true;
      return;
    }

    this.testResult = null;
    this.selectedOption = null;
    this.currentTestQuestion = this.testQuestions[this.currentQuestionIndex];

    let options = [this.currentTestQuestion];
    while (options.length < 4 && options.length < this.selectedChapter.data.length) {
      const rand = this.selectedChapter.data[Math.floor(Math.random() * this.selectedChapter.data.length)];
      if (!options.find((o) => o.letter === rand.letter)) {
        options.push(rand);
      }
    }
    this.testOptions = options.sort(() => Math.random() - 0.5);
  }

  checkAnswer(option: BengaliCharacter) {
    if (this.testResult !== null || !this.currentTestQuestion) return;

    this.selectedOption = option;

    if (option.letter === this.currentTestQuestion.letter) {
      this.testResult = 'correct';
      this.score++;
    } else {
      this.testResult = 'incorrect';
    }
    // No setTimeout needed — user clicks "Next Question" button to advance
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.loadNextQuestion();
  }
}
