<script setup lang="ts">
  import Image from '@/components/Image.vue'
  import { meme } from '@/type'
  import { useIntersectionObserver } from '@vueuse/core'
  import { computed, ref } from 'vue'

  const props = defineProps<{
    list: meme[]
  }>()

  const size = ref(20)

  const target = ref<HTMLDivElement>()
  const targetVisable = computed(() => {
    return size.value < props.list.length
  })
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        size.value += 20
      }
    },
    { rootMargin: '200px' }
  )

  const partList = computed(() => {
    return props.list.slice(0, size.value)
  })
</script>

<template>
  <div class="max-h-[calc(100vh-74px)] overflow-y-scroll overflow-x-hidden">
    <ul class="flex flex-wrap gap-4 after:(content-DEFAULT min-w-[35vh] flex-grow-[999999999]) ">
      <li v-for="m in partList" class="flex-grow h-[35vh] aspect-16/13" :key="m.id">
        <Image :m="m" />
      </li>
    </ul>
    <div ref="target" class="min-w-screen min-h-px bg-blue-gray-100" v-show="targetVisable" />
  </div>
</template>
