<template>
    <div class="heading-card">
        <div class="heading-card-title">こんにちは！</div>
        <div class="heading-card-description">
            Please choose what type of quiz you want to take.
            <div class="text-danger margin-top-1">
                *Note: This app follows みんなの日本語 book's vocabularies and kanjis for each lesson.
            </div>
            <div class="text-danger">
                **Note: Answers that includes ～, 「, ［, 。, 、, or even just whitespace might be marked wrong.
            </div>
        </div>
    </div>
    <div class="grid-container short">
      <QuizButton 
        :n3KanjiCodeQuizArray="n3KanjiCodeQuizArray"
        :n4KanjiCodeQuizArray="n4KanjiCodeQuizArray"
        :n4VocabularyCodeQuizArray="n4VocabularyCodeQuizArray"
        :n5KanjiCodeQuizArray="n5KanjiCodeQuizArray"
        :n5VocabularyCodeQuizArray="n5VocabularyCodeQuizArray"
        @setQuiz="setQuiz"
      />
    </div>
</template>

<script>
  import QuizButton from "./QuizButton.vue";
  export default {
    components: {
      QuizButton
    },
    props: ["n3KanjiCodeQuizArray", "n4KanjiCodeQuizArray", "n4VocabularyCodeQuizArray", "n5KanjiCodeQuizArray", "n5VocabularyCodeQuizArray"],
    emits: ["setQuiz"],
    methods: {   
        setQuiz(selectedQuiz){
            this.$emit("setQuiz", selectedQuiz);
        }
    }
  };
</script>