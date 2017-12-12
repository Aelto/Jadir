<template>

  <div class="post">

    <div class='profile-pic' style="background-image: url('/assets/img/robert-magnusson.jpg')"
      v-if="post.image_url"
      v-bind:style="`animation-delay: ${index * 0.15}s; background-image: url(${post.image_url})`"
      v-on:click="readPost(post.id)"></div>

    <div class='profile-pic spacer'
      v-else></div>

    <div class="post-text">
      <h5 v-on:click="readPost(post.id)">{{ post.title }}</h5>

      <postinfo :author="post.author" :score="post.score" :tags="post.tags"></postinfo>
    </div>
  </div>

</template>

<script>
import postInfo from './post-info.vue'
import { endpoints } from 'Shared/endpoints.ts'

export default {
  props: ['post', 'global'],
  components: {
    postinfo: postInfo
  },
  created() {
    this.global.ws.onAnswer(endpoints.getPost, data => {
      this.global.route(`/post/${data.message.post.id}`)
      this.global.setCurrentPost(data.message.post)
    })
  },
  methods: {
    async readPost(id) {
      this.global.api.posts.getPost(this.global.ws, id)
    }
  }
}
</script>

<style scoped>
.post {
  display: flex;
}

.post + .post {
  margin-top: 2em;
}

.post .spacer {
  box-shadow: none;
}

.post .post-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post h5 {
  display: inline-block;
  cursor: pointer;
  margin-bottom: 0em;
}

.post h5:hover {
  text-decoration: underline;
}

.post a.tag {
  margin-right: 0.4em;
}

.post .author-wrapper {
  display: flex;
  align-items: center;
  margin-top: 1em;
}

.post .author {
  display: flex;
}

.post .profile-pic {
  background-size: cover;
  background-position: center;
  /* width: 48px;
  height: 48px;
  border-radius: 50%; */
  width: 74px;
  height: 74px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 1em;
}

.post .profile-pic:not(.spacer) {
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);
}

.post:nth-child(-n + 10) .profile-pic {
  animation: pop cubic-bezier(0.6, 0.2, 0.45, 1.2) 0.3s forwards;
  transform: scale(0);
  opacity: 0;
}
</style>