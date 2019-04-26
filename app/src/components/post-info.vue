<template>

  <div class='post-info'>
    <div class='submit-by'>submitted by <a v-on:click="go_to_profile(author)">@{{ author }}</a>
      <time-diff :before="new Date(date)" :after="now"></time-diff>,
    </div>
    <div class="points"><b>{{ score }}</b> points</div>
    <div>in <a class="tag" v-for="(tag, index) in tags.split(' ')"
        :key="index"
        v-on:click="search_tag(tag)">{{ tag }} </a>
    </div>
  </div>

</template>

<script>
import TimeDiff from './time-diff.vue'

export default {
  props: ['author', 'score', 'tags', 'date'],
  components: {
    TimeDiff
  },
  data: () => ({
    now: Date.now() 
  }),
  methods: {
    search_tag(tag) {
      this.global.route(`/tag/${tag.replace('#', '')}`)
    },

    go_to_profile(username) {
      this.global.route(`/profile/${username}`)
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