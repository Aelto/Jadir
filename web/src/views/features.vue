<template>
  <div class="features">

    <ul>
      <li class="feature todo"
        v-for="(todo, index) in features.todo"
        v-bind:key="index">{{ todo }}</li>

      <li class="feature inprogress"
      v-for="(inprogress, index) in features.inprogress"
        v-bind:key="index">{{ inprogress }}</li>

      <li class="feature done"
      v-for="(done, index) in features.done"
        v-bind:key="index">{{ done }}</li>

    </ul> 

  </div>
</template>

<script>

export default {
  data: () => ({
    features: {
      todo: [
        'Email signup and password resetting',
        'Add tag to our favorites and favorites page',
        'Add bio/description to profile page',
        'Be able to store todos, inprogress and dones on this page'
      ],
      inprogress: [

      ],
      done: [
        'Show user score in the profile page',
        'Add state indication on downvote & upvote button'
      ]
    }
  })
}

</script>

<style scoped>

.feature {
  padding-left: 1em;
}

.feature.todo {
  border-left: solid 3px maroon;
}

.feature.inprogress {
  border-left: solid 3px lemonchiffon
}

.feature.done {
  border-left: solid 3px lightgreen
}

</style>