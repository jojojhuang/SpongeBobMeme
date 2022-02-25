<script setup lang="ts">
  import { useLikeStore } from '@/stores/memes'
  import type { ActiveOption, meme } from '@/type'
  import { useClipboard, usePermission } from '@vueuse/core'
  import { computed, ref } from 'vue'

  const store = useLikeStore()

  const props = defineProps<{
    m: meme
  }>()

  const active = ref<ActiveOption>('')
  const activeText = computed(() => {
    switch (active.value) {
      case 'like':
        return store.isLike(props.m.uid) ? '取消收藏' : '收藏'
      case 'copy':
        return '複製網址'
      case 'link':
        return '新分頁中開啟'
      default:
        return ''
    }
  })

  const { copied, copy } = useClipboard()
  usePermission('clipboard-read')
  usePermission('clipboard-write')

  const toggleLike = () => {
    store.isLike(props.m.uid) ? store.removeLike(props.m.uid) : store.addLike(props.m.uid)
  }
</script>

<template>
  <div class="rounded-lg relative overflow-hidden image-container">
    <img
      :src="m.src"
      :alt="m.title"
      loading="lazy"
      class="font-bold min-w-full max-w-full object-cover object-bottom h-[35vh] text-center text-white text-lg"
    />

    <div
      class="flex-col min-w-full bg-black/50 min-h-[35vh] inset-0 gap-4 control-embed absolute justify-center items-center hidden"
    >
      <div class="font-bold min-h-9 text-white/80 text-3xl">
        {{ copied ? '完成' : activeText }}
      </div>
      <div class="flex gap-4 justify-center items-center">
        <button
          class="rounded-full border-white/70 border-2 group hover:bg-white/70"
          @mouseenter="active = 'like'"
          @mouseleave="active = ''"
          @click="toggleLike"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 m-1 fill-transparent stroke-white/70 w-12 group-hover:stroke-yellow-600/80"
            :class="{ '!fill-yellow-500': store.isLike(m.uid) }"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
        <button
          class="rounded-full border-white/70 border-2 group hover:bg-white/70"
          @click="copy(encodeURI(m.src))"
          @mouseenter="active = 'copy'"
          @mouseleave="active = ''"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 m-1 stroke-white/70 w-12 group-hover:stroke-black/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </button>
        <a
          :href="m.src"
          class="rounded-full border-white/70 border-2 group hover:bg-white/70"
          target="_blank"
          @mouseenter="active = 'link'"
          @mouseleave="active = ''"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 m-1 stroke-white/70 w-12 group-hover:stroke-black/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .image-container:hover > .control-embed {
    @apply flex;
  }
</style>
