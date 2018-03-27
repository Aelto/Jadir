<template>
  <div class="profile"
    v-if="account.profile !== null">

    <img class="user-image"
      v-bind:src="account.profile.image_url">
    
    <div class="row">
      <input type="text" class="user-image-input" placeholder="your profile image url"
        v-model="newProfileImageUrl">
      <button class="user-image-button"
        v-on:click="setProfileImage">confirm</button>
    </div>


  </div>
</template>


<script>
import { endpoints } from 'Shared/endpoints.ts'

export default {
  props: ['global', 'account'],
  watch: {
    '$route': 'syncPosts'
  },
  data: () => ({
    newProfileImageUrl: '',
    profileImageUrl: ''
  }),
  created() {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      this.global.ws.onAnswer(endpoints.setUserImage, e => {
        this.global.updateProfileData()
      })
    },

    setProfileImage() {
      this.global.api.users.setUserImage(this.global.ws, this.newProfileImageUrl)
    }
  }
}

</script>

<style scoped>

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
} 

.profile .user-image {
  margin-top: 2em;
  border-radius: 6px;
  width: 50%;
  border: solid 3px black;
}

.profile .user-image-input {
  display: inline-block;
  margin: 1em;
  width: 50%;
}

.profile .user-image-button {
  display: inline-block;
}
</style>