import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const username = ref(localStorage.getItem('username') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(t, name) {
    token.value = t || ''
    username.value = name || ''
    if (t) {
      localStorage.setItem('token', t)
    } else {
      localStorage.removeItem('token')
    }
    if (name) {
      localStorage.setItem('username', name)
    } else {
      localStorage.removeItem('username')
    }
  }

  function logout() {
    setAuth('', '')
  }

  async function login(payload) {
    const data = await apiLogin(payload)
    if (data?.token) {
      setAuth(data.token, payload.username)
    }
    return data
  }

  async function register(payload) {
    const data = await apiRegister(payload)
    if (data?.token) {
      setAuth(data.token, payload.username)
    }
    return data
  }

  return {
    token,
    username,
    isLoggedIn,
    setAuth,
    logout,
    login,
    register
  }
})