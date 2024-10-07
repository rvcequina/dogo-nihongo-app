<template>
  <div class="heading-card">
    <div class="score">SCORE: {{ numberOfCorrectAnswers }}/{{ totalNumberOfQuestions }}</div>
  </div>
</template>

<script>
export default {
  props: ["numberOfCorrectAnswers", "totalNumberOfQuestions"]
  // computed: {
  //   resultIndex() {
  //     let index = 0;
  //     this.results.forEach((e, i) => {
  //       if (e.min <= this.totalCorrect && e.max >= this.totalCorrect) {
  //         index = i;
  //       }
  //     });
  //     return index;
  //   },
  // },

  // Place the code below to the appropriate .json file:
  // "results": [
  //   {
  //     "min": 0,
  //     "max": 2,
  //     "title": "Try again!",
  //     "desc": "Do a little more studying and you may succeed!"
  //   },
  //   {
  //     "min": 3,
  //     "max": 3,
  //     "title": "Wow, you're a genius!",
  //     "desc": "Studying has definitely paid off for you!"
  //   }
  // ]
};
</script>
