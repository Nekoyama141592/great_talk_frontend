import { atom } from 'jotai'

// Auth state interface
export interface AuthState {
  uid: string
  firstLoaded: boolean
}

// Initial auth state
const initialAuthState: AuthState = {
  uid: '',
  firstLoaded: false,
}

// Auth atom
export const authAtom = atom<AuthState>(initialAuthState)

// Derived atoms for specific auth properties
export const uidAtom = atom(get => get(authAtom).uid)
export const firstLoadedAtom = atom(get => get(authAtom).firstLoaded)

// Actions (write-only atoms)
export const initUserAtom = atom(null, (get, set, payload: { uid: string }) => {
  set(authAtom, { ...payload, firstLoaded: true })
})

export const clearUserAtom = atom(null, (get, set) => {
  set(authAtom, { ...initialAuthState, firstLoaded: true })
})
