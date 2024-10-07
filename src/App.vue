<template>
  <div class="container">
    <MenuVue 
      v-if="isQuizSelected === 0"
      :n3KanjiCodeQuizArray="n3KanjiCodeQuizArray"
      :n4KanjiCodeQuizArray="n4KanjiCodeQuizArray"
      :n4VocabularyCodeQuizArray="n4VocabularyCodeQuizArray"
      :n5KanjiCodeQuizArray="n5KanjiCodeQuizArray"
      :n5VocabularyCodeQuizArray="n5VocabularyCodeQuizArray"
      @setQuiz="setQuiz"
    />
    <div v-else-if="isQuizSelected === 1">
      <transition name="fade" mode="out-in">
        <QuestionsVue
          v-if="numberOfAnsweredQuestions < totalNumberOfQuestions"
          :isHardMode="isHardMode"
          :numberOfAnsweredQuestions="numberOfAnsweredQuestions"
          :quiz="quiz"
          :totalNumberOfQuestions="totalNumberOfQuestions"
          :typeOfQuiz="typeOfQuiz"
          @updateCounterVariables="updateCounterVariables"
          @updateUserAnswerArray="updateUserAnswerArray"
          @updateUserEnglishAnswerArray="updateUserEnglishAnswerArray"
        />
        <div v-else-if="numberOfAnsweredQuestions === totalNumberOfQuestions">
          <Result
            v-if="typeOfQuiz !== 'oral-script'"
            :numberOfCorrectAnswers="numberOfCorrectAnswers"
            :totalNumberOfQuestions="totalNumberOfQuestions"
          />  
          <Answers  
            v-if="isViewingAnswers === 1"
            :isHardMode="isHardMode"
            :quiz="quiz"
            :typeOfQuiz="typeOfQuiz"
            :userAnswerArray="userAnswerArray"
            :userEnglishAnswerArray="userEnglishAnswerArray"
          />
        </div>
      </transition>
    </div>
    <div v-if="numberOfAnsweredQuestions < totalNumberOfQuestions">
      <button
        v-if="typeOfQuiz === 'vocabulary' && isHardMode === 1"
        type="button"
        class="green-button"
        @click.prevent="setToEasyMode"
      >
        Easy Mode
      </button>
      <button
        v-if="typeOfQuiz === 'vocabulary' && isHardMode === 0"
        type="button"
        class="red-button"
        @click.prevent="setToHardMode"
      >
        Hard Mode
      </button>
      <button
        v-if="typeOfQuiz === 'oral-script'"
        type="button"
        class="blue-button"
        @click.prevent="next"
      >
        Next Question
      </button>
      <button
        type="button"
        class="red-button"
        @click.prevent="skip"
      >
        Give Up
      </button>
      <button
        type="button"
        class="red-button"
        @click.prevent="reset"
      >
        Go Back To Main Menu
      </button>
    </div>
    <div v-else-if="numberOfAnsweredQuestions === totalNumberOfQuestions">
      <button
        v-if="isViewingAnswers === 0 && typeOfQuiz !== 'oral-script'"
        type="button"
        class="blue-button"
        @click.prevent="viewAnswers"
      >
        View Answers
      </button>
      <button
        type="button"
        class="green-button"
        @click.prevent="retake"
      >
        Retake Quiz
      </button>
      <button
        type="button"
        class="red-button"
        @click.prevent="reset"
      >
        Take More Quizzes
      </button>
    </div>
  </div>
</template>

<script>
import N3KanjiQuizzes from "./assets/N3KanjiQuizzes.json";
import N4KanjiQuizzes from "./assets/N4KanjiQuizzes.json";
import N4VocabularyQuizzes from "./assets/N4VocabularyQuizzes.json";
import N5KanjiQuizzes from "./assets/N5KanjiQuizzes.json";
import N5VocabularyQuizzes from "./assets/N5VocabularyQuizzes.json";
import OralQuestions from "./assets/OralQuestions.json";
import Answers from "./components/Answers.vue";
import MenuVue from "./components/MenuVue.vue";
import QuestionsVue from "./components/QuestionsVue.vue";
import Result from "./components/Result.vue";

export default {
  name: "App",
  components: {
    Answers,
    MenuVue,
    QuestionsVue,
    Result
  },
  data() {
    return {
      easyModeQuiz: [],
      hardModeQuiz: [],
      isHardMode: 0,
      isQuizSelected: 0,
      isViewingAnswers: 0,
      n3KanjiCodeQuizArray: [],
      n4KanjiCodeQuizArray: [],
      n4VocabularyCodeQuizArray: [],
      n5KanjiCodeQuizArray: [],
      n5VocabularyCodeQuizArray: [],
      numberOfAnsweredQuestions: 0,
      numberOfCorrectAnswers: 0,
      questionsIndexes: [],
      quiz: [],
      randomNum: 0,
      totalNumberOfQuestions: -1,
      typeOfQuiz: "",
      userAnswerArray: [],
      userEnglishAnswerArray: []
    };
  },
  created() {
    this.n3KanjiCodeQuizArray = Object.keys(N3KanjiQuizzes);
    this.n4KanjiCodeQuizArray = Object.keys(N4KanjiQuizzes);
    this.n4VocabularyCodeQuizArray = Object.keys(N4VocabularyQuizzes);
    this.n5KanjiCodeQuizArray = Object.keys(N5KanjiQuizzes);
    this.n5VocabularyCodeQuizArray = Object.keys(N5VocabularyQuizzes);
  },
  methods: {
    generateRandomNumbers() {
      this.randomNum = Math.floor(Math.random() * this.totalNumberOfQuestions);
      if (this.questionsIndexes.indexOf(this.randomNum) === -1) {
        this.questionsIndexes.push(this.randomNum);
      } else {
        this.generateRandomNumbers();
      }
    },
    randomizeQuestions(questionSet){
      let randomizedQuestionSet = [];
      for(let i=0; i < questionSet.length; i++){
        this.generateRandomNumbers();
        randomizedQuestionSet[i] = questionSet[this.questionsIndexes[i]];
      }
      return randomizedQuestionSet;
    },
    next(){
      this.numberOfAnsweredQuestions++;
    },
    retake(){
      this.isViewingAnswers = 0;
      this.numberOfAnsweredQuestions = 0;
      this.numberOfCorrectAnswers = 0;
      this.questionsIndexes = [];
      this.randomNum = 0;
      this.userAnswerArray = [];
      this.userEnglishAnswerArray = [];
      this.quiz = this.randomizeQuestions(this.quiz);
    },
    setToEasyMode(){
      this.isHardMode = 0;
      this.numberOfAnsweredQuestions = 0;
      this.numberOfCorrectAnswers = 0;
      this.questionsIndexes = [];
      this.randomNum = 0;
      this.userAnswerArray = [];
      this.userEnglishAnswerArray = [];
      this.quiz = this.easyModeQuiz;
      this.totalNumberOfQuestions = this.quiz.length;
      this.quiz = this.randomizeQuestions(this.quiz);
    },
    setToHardMode(){
      this.hardModeQuiz = [];
      this.isHardMode = 1;
      this.numberOfAnsweredQuestions = 0;
      this.numberOfCorrectAnswers = 0;
      this.questionsIndexes = [];
      this.randomNum = 0;
      this.userAnswerArray = [];
      this.userEnglishAnswerArray = [];
      this.easyModeQuiz.forEach(item => {
        if (item.kanji_question !== ""){
          this.hardModeQuiz.push(item);
        }
      });
      this.totalNumberOfQuestions = this.hardModeQuiz.length;
      this.quiz = this.randomizeQuestions(this.hardModeQuiz);
    },
    reset() {
      this.easyModeQuiz = [];
      this.hardModeQuiz = [];
      this.isHardMode = 0;
      this.isQuizSelected = 0;
      this.isViewingAnswers = 0;
      this.numberOfAnsweredQuestions = 0;
      this.numberOfCorrectAnswers = 0;
      this.questionsIndexes = [];
      this.quiz = [];
      this.randomNum = 0;
      this.totalNumberOfQuestions = -1;
      this.typeOfQuiz = "";
      this.userAnswerArray = [];
      this.userEnglishAnswerArray = [];
    },
    updateCounterVariables(answer) {
      if (answer) {
        this.numberOfCorrectAnswers++;
      }
      this.numberOfAnsweredQuestions++;
    },
    setQuiz(selectedQuiz){
      this.isQuizSelected = 1;
      if(selectedQuiz.search("VQuiz") !== -1){
        if(selectedQuiz.search("N5") !== -1){
          this.quiz = N5VocabularyQuizzes[selectedQuiz];
        }
        else if(selectedQuiz.search("N4") !== -1){
          this.quiz = N4VocabularyQuizzes[selectedQuiz];
        }
        this.typeOfQuiz = "vocabulary";
      }
      else if(selectedQuiz.search("KQuiz") !== -1){
        if(selectedQuiz.search("N5") !== -1){
          this.quiz = N5KanjiQuizzes[selectedQuiz];
        }
        else if(selectedQuiz.search("N4") !== -1){
          this.quiz = N4KanjiQuizzes[selectedQuiz];
        }
        else if(selectedQuiz.search("N3") !== -1){
          this.quiz = N3KanjiQuizzes[selectedQuiz];
        }
        this.typeOfQuiz = "kanji";
      }
      else if(selectedQuiz.search("OQ") !== -1){
        this.quiz = OralQuestions[selectedQuiz];
        this.typeOfQuiz = "oral-script";
      }
      this.totalNumberOfQuestions = this.quiz.length;
      this.easyModeQuiz = this.quiz;
      this.quiz = this.randomizeQuestions(this.quiz);
    },
    updateUserAnswerArray(answer) {
      this.userAnswerArray.push(answer);
    },
    updateUserEnglishAnswerArray(answer) {
      this.userEnglishAnswerArray.push(answer);
    },
    viewAnswers() {
      this.isViewingAnswers = 1;
    },
    skip(){
      this.numberOfAnsweredQuestions = this.totalNumberOfQuestions;
    }
  },
};
</script>