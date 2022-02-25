<script setup lang="ts">
  import ImageList from '@/components/ImageList.vue'
  import { useLikeStore } from '@/stores/memes'
  import type { meme } from '@/type'
  import { useFuse } from '@vueuse/integrations/useFuse'
  import { computed, onMounted, ref } from 'vue'

  const store = useLikeStore()

  const datas = ref<meme[]>([])

  onMounted(async () => {
    const rawDatas = await fetch(
      'https://sponge-bob-meme.s3.ap-southeast-1.amazonaws.com/memes.json',
      {
        method: 'get'
      }
    )
    const jsonDatas = await rawDatas.json()
    datas.value = jsonDatas.sort((a: meme, b: meme) => b.id - a.id)
  })

  const search = ref('')
  const { results } = useFuse(search, datas, {
    fuseOptions: { keys: ['title'], threshold: 0.55 },
    matchAllWhenSearchEmpty: true
  })

  const memes = computed<meme[]>(() => {
    const res = results.value.map((fuseResult) => {
      return fuseResult.item
    })
    return viewLike.value
      ? res.filter((m) => {
          return store.isLike(m.uid)
        })
      : res
  })

  const viewLike = ref(false)
</script>

<template>
  <section class="min-h-screen bg-cool-gray-800 overflow-hidden">
    <nav class="flex bg-cool-gray-800 w-full z-10 gap-4 items-center">
      <input
        type="text"
        v-model="search"
        placeholder="搜尋..."
        class="border rounded-xl flex-grow outline-none bg-gray-600 bg-opacity-20 border-gray-600 h-10 m-4 mr-0 text-white text-base min-w-0 p-2 pl-4 transition-colors ease-in-out text-gray-100 duration-200 sm:flex-grow-0 focus:bg-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900"
      />
      <button
        class="rounded-xl flex font-bold outline-none bg-gray-600 bg-opacity-20 border-1 border-gray-600 h-10 text-white px-2 items-center active:bg-transparent active:border-indigo-500 active:ring-2 active:ring-indigo-900"
        :class="{ 'bg-white bg-opacity-100 text-gray-600': viewLike }"
        @click="viewLike = !viewLike"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 m-1 fill-yellow-500 stroke-yellow-600/80 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="hidden sm:inline">收藏夾</span>
      </button>
      <a
        class="flex ml-auto h-10 mr-4 text-white/20 w-10 justify-center items-center hover:text-white"
        href="https://github.com/jojojhuang/SpongeBobMeme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="h-8 w-8"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </a>
    </nav>
    <image-list :list="memes" class="mx-4" />
  </section>
</template>
