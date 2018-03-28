<template>
  <div class="profile">

    <div v-if="isSelfProfile && account.profile !== null">
      <div class="profile-name">{{ account.profile.name }}</div>

      <img class="user-image"
        v-bind:src="account.profile.image_url">
      
      <div class="row">
        <input type="text" class="user-image-input" placeholder="your profile image url"
          v-model="newProfileImageUrl">
        <button class="user-image-button"
          v-on:click="setProfileImage">confirm</button>
      </div>
    </div>

    <div v-else-if="currentProfile !== null">
      <div class="profile-name">{{ currentProfile.name }}</div>

      <a class="see-posts"
        v-on:click="seeUserPosts()">see user posts</a>

      <img class="user-image"
        v-bind:src="currentProfile.image_url">

    </div>
  </div>
</template>

<script>
import { endpoints } from 'Shared/endpoints.ts'

export default {
  props: ['global', 'account', 'currentProfile'],
  watch: {
    '$route': 'fetchData'
  },
  data: () => ({
    newProfileImageUrl: '',
    profileImageUrl: ''
  }),
  created() {
    this.fetchData()
  },
  computed: {
    isSelfProfile() {
      return this.$route.params.user === this.account.username
    }
  },
  methods: {
    fetchData() {
      if (this.isSelfProfile) {
        this.global.ws.onAnswer(endpoints.setUserImage, e => {
          this.global.updateProfileData()
        })
      }

      else {
        this.global.updateProfileData(this.$route.params.user, e => {
          this.global.setCurrentProfile(e.message.user)
        })
      }
    },

    setProfileImage() {
      this.global.api.users.setUserImage(this.global.ws, this.newProfileImageUrl)
    },

    seeUserPosts() {
      if (!this.currentProfile.name)
        return

      this.global.route(`/posts/${this.currentProfile.name}`)
    }
  }
}

</script>

<style scoped>

.profile > div {
  display: flex;
  flex-direction: column;
  align-items: center;
} 

.profile .profile-name {
  font-weight: bold;
  font-size: 2em;
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