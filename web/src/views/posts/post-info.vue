<template>

  <div class='post-info'>
    <div class='submit-by'>submitted by <a v-on:click="goToProfile(author)">@{{ author }}</a>
    <div>{{ getHoursDifference(new Date(date), now) }} hours ago</div>,
    </div>
    <div class="points"><b>{{ score }}</b> points</div>
    <div>in <a class="tag" v-for="(tag, index) in tags.split(' ')"
        :key="index"
        v-on:click="searchTag(tag)">{{ tag }} </a>
    </div>
  </div>

</template>

<script>
export default {
  props: ['author', 'score', 'tags', 'global', 'date'],
  data: () => ({
    now: Date.now() 
  }),
  methods: {
    searchTag(tag) {
      this.global.route(`/tag/${tag.replace('#', '')}`)
    },

    goToProfile(username) {
      this.global.route(`/profile/${username}`)
    },

    getHoursDifference(before, after) {
      return Math.floor((after - before) / (1000 * 60 * 60))
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