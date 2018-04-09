<template>
  <div class="features">

    <input type="checkbox" name="todos"
      v-model="displayTodo">
    <label for="todos">todo</label>

    <input type="checkbox" name="inprogress"
      v-model="displayInprogress">
    <label for="inprogress">inprogress</label>

    <input type="checkbox" name="done"
      v-model="displayDone">
    <label for="done">done</label>

    <ul>
      <li class="feature todo"
        v-for="(todo, index) in features.todo"
        v-if="displayTodo"
        v-bind:key="index">{{ todo }}</li>

      <li class="feature inprogress"
        v-for="(inprogress, index) in features.inprogress"
        v-if="displayInprogress"
        v-bind:key="index">{{ inprogress }}</li>

      <li class="feature done"
        v-for="(done, index) in features.done"
        v-if="displayDone"
        v-bind:key="index">{{ done }}</li>

    </ul> 

  </div>
</template>

<script>

export default {
  data: () => ({
    displayTodo: true,
    displayInprogress: true,
    displayDone: false,

    features: {
      todo: [
        'Email signup and password resetting',
        'Add tag to our favorites and favorites page',
        'Add bio/description to profile page',
        'Edit a post',
        'Edit a comment',
        'Admin controls: delete a post, delete a comment',
      ],
      inprogress: [
        'Open posts in new tabs. (currently forces a full-load even if it is not in a new tab)'
      ],
      done: [
        'Be able to filter todos, inprogress and dones on this page',
        'Do not resize small images',
        'Show user score in the profile page',
        'Add state indication on downvote & upvote button',
        'Display the current page',
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
  border-left: solid 3px darksalmon
}

.feature.done {
  border-left: solid 3px darkgreen
}

input, label {
  display: inline-block
}

label {
  margin-right: 1em;
}

</style>