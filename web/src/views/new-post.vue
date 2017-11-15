<template>
  <div class="new-post">

    <div class="card">

      <input type="text" class="title" v-model="postTitle">

      <textarea type="text" class="description" v-model="postDescription">
      </textarea>
      <div class="char-limit">{{ postDescription.length }} / 1024</div>

      <label for="tags">Add tags</label>
      <input name="tags" type="text" class="tags" v-model="postTags">

      <p>
        <button class="submit" v-on:click="submit">Submit</button>
      </p>

    </div>

  </div>
</template>

<script>

export default {
  props: ['global'],
  data: () => ({
    postTitle: 'Title',
    postDescription: 'Tell what you want',
    postTags: '#all #first-post'
  }),
  methods: {
    async submit() {
      try {
        const post = await this.global.api.posts.createPost(this.postTitle, this.postDescription.slice(0, 1024), this.postTags)
        this.global.api.posts.viewPost(post.data.newPost)

      } catch (error) {
        console.log(error)
      }
    }
  }
}

</script>

<style scoped>
.new-post {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card {
  margin: 0 auto;
  padding: 1em;
  box-shadow: 0 0 6px rgba(20, 20, 20, 0.2);
  background: white;
}

input.title {
  font-size: 2em;
  border: none;
  color: inherit;
  display: block;
}

textarea.description {
  min-width: 435px;
  max-width: 90vw;

  min-height: 40vh;
}

input.tags {
  border: none;
  color: var(--color-blue);
}

.char-limit {
  display: block;
  text-align: center;
}
</style>