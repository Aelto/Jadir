<template>

  <div class="post">

    <div class='profile-pic' style="background-image: url('/assets/img/dog.jpg')"
      v-bind:style="`animation-delay: ${index * 0.15}s`"></div>

    <div class="post-text">
      <h5 v-on:click="readPost(post.id)">{{ post.title }}</h5>

      <postinfo :author="post.author" :score="post.score" :tags="post.tags"></postinfo>
    </div>
  </div>

</template>

<script>
import postInfo from './post-info.vue'

export default {
  props: ['post', 'global'],
  components: {
    postinfo: postInfo
  },
  methods: {
    async readPost(id) {
      this.global.api.posts.viewPost((await this.global.api.posts.getPost(id)).data.post)
    }
  }
}

</script>

<style scoped>

.post {
  display: flex;
  align-items: center
}

.post .profile-pic {
  display: inline-block
}

.post .post-text {
  display: inline-block
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.3);
  cursor: pointer;
  margin-right: 1em;
}

.post:nth-child(-n + 10) .profile-pic {
  animation: pop cubic-bezier(0.6, 0.2, 0.45, 1.2) 0.3s forwards;
  transform: scale(0);
  opacity: 0;
}
</style>