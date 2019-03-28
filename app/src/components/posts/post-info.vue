<template>

  <div class='post-info'>
    <span class='submit-by'>submitted by <a v-on:click="goToProfile(author)">@{{ author }}</a>
      <time-diff :before="new Date(date)" :after="now"></time-diff>,
    </span>
    <span class="points"><b>{{ score }}</b> points</span>
    <span>in <a class="tag" v-for="(tag, index) in tags.split(' ')"
        :key="index"
        v-on:click="searchTag(tag)">{{ tag }} </a>
    </span>
  </div>

</template>

<script>
import TimeDiff from '../time-diff.vue'

export default {
  props: ['author', 'score', 'tags', 'global', 'date'],
  components: { TimeDiff },
  data: () => ({
    now: Date.now() 
  }),
  methods: {
    searchTag(tag) {
      this.$router.push(`/tag/${tag.replace('#', '')}`);
    },

    goToProfile(username) {
      this.$router.push(`/profile/${username}`);
    }
  }
}
</script>

<style scoped>
.post-info {
  display: block;
  font-size: 75%;
  opacity: .8;
  margin-bottom: 1.2rem;
}

.post-info .submit-by a {
  cursor: pointer;
}

.post-info div {
  display: inline-block;
}

.tag {
  cursor: pointer;
}
</style>