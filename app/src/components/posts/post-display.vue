<template>

  <div class="post"
    v-bind:class="{ nsfw: isNsfw }">

    <div class='profile-pic'
      v-bind:style="`animation-delay: ${index * 0.15}s; background-image: url(${image_url || defaultPostImage})`"
      v-on:click="readPost(id)"></div>

    <div class="post-text">
      <router-link class="post-title"
        :to="postUrl">{{ title }}</router-link>

      <PostInfo :author="author" :score="score" :tags="tags" :date="date"></PostInfo>
    </div>
  </div>

</template>

<script>
import PostInfo from './post-info.vue'

export default {
  props: ['title', 'id', 'author', 'score', 'tags', 'date', 'image_url'],
  components: { PostInfo },
  computed: {
    postUrl() {
      return `/post/${this.id}`
    },
    isNsfw() {
      return this.tags.includes('nsfw');
    }
  },
  data: () => ({
    defaultPostImage: '/static/typewriter.jpg'
  })
}
</script>

<style scoped>
.post {
  display: flex;
  animation: fade-in-right cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s forwards;
  opacity: 0;
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

.post a.post-title {
  display: inline-block;
  cursor: pointer;
  margin-bottom: 0em;
  font-size: 2em;
  color: var(--color-black);
}

.post a.post-title:hover {
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
  width: 74px;
  height: 74px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 1em;
}

.post .profile-pic:not(.spacer) {
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);
}

.post.nsfw .profile-pic {
  filter: blur(3px);
}

.post:nth-child(-n + 10) .profile-pic {
  animation: pop cubic-bezier(0.6, 0.2, 0.45, 1.2) 0.3s forwards;
  transform: scale(0);
  opacity: 0;
}

@keyframes pop {
  from {
    opacity: 0.8;
    transform:  scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>