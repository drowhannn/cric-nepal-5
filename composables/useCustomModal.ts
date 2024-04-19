import { createApp } from 'vue'
import Modal from '~~/components/a/Modal.vue'

export function useCustomModal() {
  const confirmAction = (title: string, description: string, confirmButtonLabel = 'Confirm', cancelButtonLabel = 'Cancel') => {
    return new Promise((resolve, reject) => {
      const isOpen = ref(true)
      const ComponentApp = createApp(Modal, {
        modelValue: isOpen.value,
        title,
        description,
        confirmButtonLabel,
        cancelButtonLabel,
        width: 'w-full max-w-[90vw] md:max-w-xl',
        onClose() {
          reject(
            new Error('closed'),
          )
        },
        onConfirm() {
          resolve('confirmed')
        },
      })
      const wrapper = document.createElement('div')
      ComponentApp.mount(wrapper)
      document.body.appendChild(wrapper)
    })
  }
  return {
    confirmAction,
  }
}
