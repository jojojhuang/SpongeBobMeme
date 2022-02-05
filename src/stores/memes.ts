import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { meme } from '@/type'

export const useLikeStore = defineStore('likes', () => {
  const likeList = ref<string[]>(JSON.parse(localStorage.getItem('likelist') ?? '[]'))

  const addLike = (id: string) => {
    likeList.value.push(id)
    // console.log(likeList.value)
    localStorage.setItem('likelist', JSON.stringify(likeList.value))
  }

  const removeLike = (id: string) => {
    // likeList.value.delete(id)
    // console.log(likeList.value.indexOf(id))
    likeList.value.splice(likeList.value.indexOf(id), 1)
    // console.log(likeList.value)
    localStorage.setItem('likelist', JSON.stringify(likeList.value))
  }

  const isLike = (id: string) => {
    return likeList.value.includes(id)
  }

  return { likeList, addLike, removeLike, isLike }
})
