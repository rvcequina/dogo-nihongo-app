<template>
  <div class="items-container">
    <div class="heading-card" v-if="typeOfQuiz === 'vocabulary'">
      <div class="heading-card-description text-danger">This type of quiz only accepts hiragana input.</div>
    </div>
    <div class="progress">
      <div
        class="progress-bar"
        :style="{ width: `${(numberOfAnsweredQuestions / totalNumberOfQuestions) * 100}%` }"
      ></div>
      <div class="progress-status">
        {{ numberOfAnsweredQuestions }} out of {{ totalNumberOfQuestions }} questions answered
      </div>
    </div>
    <transition-group name="fade">
      <div
        class="single-item"
        v-for="(quizItem, loopIndex) in quiz"
        :key="quizItem.answer"
        v-show="numberOfAnsweredQuestions === loopIndex"
      >
        <div class="question" v-if="isHardMode === 0">{{ quizItem.question }}</div>
        <div class="question" v-else-if="isHardMode === 1">{{ quizItem.kanji_question }}</div>
        <input
          v-if="typeOfQuiz !== 'oral-script'"
          class="answer-input"
          placeholder="Your Hiragana Answer"
          @change="$event => evaluateHiraganaAnswer($event.target.value, quizItem.answer)"
        />
        <input
          v-if="typeOfQuiz === 'kanji'"
          class="answer-input"
          placeholder="Your English Answer"
          @change="$event => saveEnglishAnswer($event.target.value, quizItem.english_answer)"
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data(){
    return {
      englishAnswer: "",
      englishCorrectAnswer: "",
      hiraganaAnswer: "",
      hiraganaCorrectAnswer: ""
    };
  },
  props: ["isHardMode", "numberOfAnsweredQuestions", "quiz", "totalNumberOfQuestions", "typeOfQuiz"],
  emits: ["updateCounterVariables", "updateUserAnswerArray", "updateUserEnglishAnswerArray"],
  methods: {
    evaluateBothAnswers(){
      if(this.hiraganaAnswer === this.hiraganaCorrectAnswer && this.englishAnswer.toLowerCase() === this.englishCorrectAnswer.toLowerCase()){
        this.$emit("updateCounterVariables", 1);
      } else {
        this.$emit("updateCounterVariables", 0);
      }
      this.$emit("updateUserAnswerArray", this.hiraganaAnswer);
      this.$emit("updateUserEnglishAnswerArray", this.englishAnswer.toLowerCase());
      this.englishAnswer = "";
      this.englishCorrectAnswer = "";
      this.hiraganaAnswer = "";
      this.hiraganaCorrectAnswer = "";
    },
    evaluateHiraganaAnswer(answer, correctAnswer) {
      if(this.typeOfQuiz === "vocabulary"){
        if (answer === correctAnswer) {
          this.$emit("updateCounterVariables", 1);
        } else {
          this.$emit("updateCounterVariables", 0);
        }
        this.$emit("updateUserAnswerArray", answer);
      }
      else{
        this.hiraganaAnswer = answer;
        this.hiraganaCorrectAnswer = correctAnswer; 
      }
    },
    saveEnglishAnswer(answer, correctAnswer) {
      this.englishAnswer = answer;
      this.englishCorrectAnswer = correctAnswer;
    }
  },
  watch: {
    hiraganaAnswer: function (newHiraganaAnswer) {
      if (newHiraganaAnswer && this.englishAnswer !== "") this.evaluateBothAnswers();
    },
    englishAnswer: function (newEnglishAnswer) {
      if (newEnglishAnswer && this.hiraganaAnswer !== "") this.evaluateBothAnswers();
    }
  }
};
</script>
