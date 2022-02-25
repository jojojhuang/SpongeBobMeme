import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLikeStore = defineStore('likes', () => {
  const likeList = ref<string[]>(JSON.parse(localStorage.getItem('likelist') ?? '[]'))

  const addLike = (uid: string) => {
    likeList.value.push(uid)
    localStorage.setItem('likelist', JSON.stringify(likeList.value))
  }

  const removeLike = (uid: string) => {
    likeList.value.splice(likeList.value.indexOf(uid), 1)
    localStorage.setItem('likelist', JSON.stringify(likeList.value))
  }

  const isLike = (uid: string) => {
    return likeList.value.includes(uid)
  }

  return { likeList, addLike, removeLike, isLike }
})
