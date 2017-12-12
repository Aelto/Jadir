<template>
  <div class="new-post">

    <input type="text" class="title" v-model="postTitle" placeholder="Set a new title">

    <textarea type="text" maxlength="1024" class="description" v-model="postDescription" placeholder="Tell what you want">
    </textarea>
    <div class="char-limit">{{ postDescription.length }} / 1024</div>

    <label for="image">Add a link to an image</label>
    <input name="image" type="text" placeholder="Add a link to an image"
      v-model="postImageUrl">

    <label for="tags">Add tags</label>
    <input name="tags" type="text" class="tags" v-model="postTags">

    <p>
      <button class="submit" v-on:click="submit">Submit</button>
    </p>

  </div>
</template>

<script>
import { endpoints } from 'Shared/endpoints.ts'
import * as intefaces from 'Shared/interfaces.ts'

export default {
  props: ['global', 'account'],
  data: () => ({
    postTitle: '',
    postDescription: '',
    postTags: '#all #first-post',
    postImageUrl: ''
  }),
  watch: {
    postTags(val) {
      console.log('!!')
      let changed = false
      
      const tags = val.trim().split(' ')
      const modTags = []
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].startsWith('#') && tags[i].length > 1) {
          modTags.push('#' + tags[i].replace(/\#*/g, ''))
        }

        if (!tags[i].startsWith('#')) {
          changed = true
          modTags.push('#' + tags[i].replace(/\#*/g, ''))
        }
      }
      if (changed)
        this.postTags = modTags.join(' ')
    }
  },
  created() {
    this.global.ws.onAnswer(endpoints.newPost, data => {
      if (data.state === 200) {
        this.global.route(`/post/${data.message.post.id}`)
        this.global.setCurrentPost(data.message.post)
      }

      else {
        console.log('TODO: manage errors in newPost')
      }

    })
  },
  methods: {
    submit() {
      this.global.api.posts.newPost(
        this.global.ws,
        this.postTitle,
        this.postDescription,
        this.postTags,
        this.postImageUrl)
    }
  }
}
</script>

<style scoped>
.new-post {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background-color: whitesmoke; */
}
.card {
  margin: 0 auto;
  padding: 1em;
  box-shadow: 0 0 6px rgba(20, 20, 20, 0.2);
  background: white;
}
input.title {
  font-size: 2em;
  /* border: none; */
  color: inherit;
  display: block;
}
textarea.description {
  min-width: 435px;
  max-width: 90vw;
  min-height: 40vh;
  /* border: none; */
}
input.tags {
  /* border: none; */
  color: var(--color-blue);
  width: 100%;
}

input, textarea {
  background: none;
}

.submit {
  margin: auto;
  display: inherit;
}

.char-limit {
  display: block;
  text-align: center;
}
</style>