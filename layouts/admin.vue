<script setup lang="ts">
const showSideBar = ref(false)
const route = useRoute()

const items = ref([
  {
    menu: { name: 'General' },
    sub_menu: [
      {
        name: 'Dashboard',
        icon: 'i-mdi-monitor',
        link: '/admin',
      },
      {
        name: 'Player',
        icon: 'i-mdi-account-group',
        link: '/admin/player',
      },
    ],
  },

])

const openMenuIndex = ref(-1)
watch(() => route.path, () => {
  showSideBar.value = false
})

const { clear } = useUserSession()

async function logout() {
  await clear()
  window.location.href = '/'
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <nav class="flex items-center justify-between bg-gray-50 px-6 py-3 text-gray-950 dark:bg-gray-900 dark:text-gray-50 border-b">
      <div class="lg:hidden">
        <UIcon
          name="i-mdi-menu"
          @click="showSideBar = !showSideBar"
        />
      </div>
      <NuxtLink
        class="w-20 h-fit"
        to="/admin"
      >
        <!-- <NuxtImg
          src="images/"
          alt="cricnepal5"
        /> -->
        <div class="text-2xl font-bold text-gray-700 dark:text-gray-300">
          CricNepal5
        </div>
      </NuxtLink>
      <div class="flex gap-6 items-center">
        <div
          class="cursor-pointer text-lg md:text-2xl"
          @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'"
        >
          <UIcon
            v-if="$colorMode.value === 'dark'"
            name="i-mdi-bulb-off-outline"
          />
          <UIcon
            v-else
            name="i-mdi-bulb-outline"
          />
        </div>
        <UIcon
          name="i-mdi-logout"
          class="cursor-pointer text-lg md:text-2xl"
          @click="logout()"
        />
      </div>
    </nav>
    <div class=" flex flex-1 overflow-y-auto">
      <aside
        class="no-scrollbar min-w-[260px] overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50"
        :class="showSideBar ? 'block w-full' : 'hidden lg:block'"
      >
        <div>
          <div
            v-for="(item, i) in items"
            :key="`item-${i}`"
            class="py-1 text-sm"
            :class="{
              'bg-gray-50 dark:bg-gray-900': openMenuIndex === i,
              'mb-2': i > 0,
            }"
            @click="openMenuIndex = i"
          >
            <div
              class="flex items-center justify-between px-5 py-2.5 text-white"
              @click="
                () => {
                  openMenuIndex < 0 ? (openMenuIndex = i) : (openMenuIndex = -1)
                }
              "
            >
              <div class="flex text-base items-center gap-5 font-bold text-gray-700 dark:text-gray-300">
                {{ item?.menu?.name }}
              </div>
            </div>
            <div
              v-for="(sub_item) in item.sub_menu"
              :key="sub_item.name"
              class="ms-5 py-1 text-gray-700 dark:text-gray-300"
            >
              <NuxtLink
                :to="sub_item?.link"
                class="hover:text-primary-500 text-lg flex items-center gap-5 border-r-2 border-transparent px-5 py-1 "
              >
                <UIcon
                  :name="sub_item?.icon"
                  class="max-w-[20px] text-inherit"
                />
                <div>{{ sub_item?.name }}</div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </aside>
      <div
        class="grow overflow-y-auto bg-gray-50 dark:bg-gray-900"
        :class="showSideBar ? 'hidden' : ''"
      >
        <div
          class="flex justify-end border-y border-gray-300 bg-gray-50 py-3 pl-5 pr-1 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          <!--  -->
        </div>
        <div class="px-2 md:px-4 py-3 md:py-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.router-link-active {
  @apply text-primary-500 border-primary-500  ;
}
</style>
