<template>
  <div class="upvote-control">
    <button class="up default link-style" v-on:click="upvote"
      v-bind:class="{ active: isUpvoteActive }">upvote</button>
    <button class="down default link-style" v-on:click="downvote"
      v-bind:class="{ active: isDownvoteActive }">downvote</button>
  </div>
</template>


<script>
export default {
  props: ['isUpvoteActive', 'isDownvoteActive'],
  methods: {
    upvote() {
      this.$emit('upvote')
    },

    downvote() {
      this.$emit('downvote')
    }
  }
}
</script>

<style scoped>
.upvote-control {
  display: flex;
  /* justify-content: space-around; */
  padding: 1em;
}

.upvote-control button {
  cursor: pointer;
  background: none;
  outline: none;
  border: 0;
  text-decoration: none;
}

.upvote-control button:hover {
  text-decoration: underline;
}

.upvote-control button.active {
  font-weight: bold;
}
</style>
