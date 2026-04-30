"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { MEALS, NEET_BLOCKS, PLAN, FIT_PHASES, TOTAL_KCAL, TOTAL_PRO } from "./data"

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

interface DayData {
  meals: Record<number, boolean>
  blocks: Record<number, boolean>
  steps: number
  cardio: number
  strength: boolean
  dayType: "bad" | "normal" | "peak"
  focus: string
  mcqs: number
  water: number
  pomodoroSessions: number
  note: string
}

interface Meta {
  fitnessPhase: number
  studyPhase: string
  streak: number
  lastCompletedDate: string
}

interface WeightEntry {
  date: string
  weight: number
}

interface State {
  mdcatDone: Record<string, boolean>
  mdcatOpen: string[]
  history: Record<string, number>
  weights: WeightEntry[]
  meta: Meta
  days: Record<string, DayData>
  currentView: string
  expandedRule: string | null
  expandedMeal: number | null
  showSaved: boolean
  toast: string | null
}

interface Actions {
  getTodayData: () => DayData
  setTodayData: (data: Partial<DayData>) => void
  toggleMdcatTask: (id: string) => void
  toggleDayOpen: (day: number) => void
  toggleNeetBlock: (id: number) => void
  toggleMeal: (id: number) => void
  toggleStrength: () => void
  setMode: (mode: "bad" | "normal" | "peak") => void
  setFocus: (focus: string) => void
  addMcqs: (n: number) => void
  setMcqs: (n: number) => void
  setSteps: (n: number) => void
  setCardio: (n: number) => void
  setWater: (n: number) => void
  addPomodoro: () => void
  setNote: (note: string) => void
  setFitPhase: (id: number) => void
  saveWeight: (w: number) => void
  deleteWeight: (date: string) => void
  setView: (view: string) => void
  setExpandedRule: (num: string | null) => void
  setExpandedMeal: (id: number | null) => void
  flashSaved: () => void
  showToast: (msg: string) => void
  getOverallPct: () => number
  getStudyPct: () => number
  getDietPct: () => number
  getFitPct: () => number
  getDayTargets: () => { blocks: number; mcq: number }
  getBlocksDone: () => number
  getMealsDone: () => number
  getKcalDone: () => number
  getProDone: () => number
  getCurrentPhase: () => typeof FIT_PHASES[number]
  getFitDone: () => { done: number; total: number; stepsHit: boolean; cardioHit: boolean | null }
  mdcatDayPct: (day: typeof PLAN[number]) => number
  mdcatDayDone: (day: typeof PLAN[number]) => boolean
  mdcatTodayPlan: () => typeof PLAN[number] | undefined
  mdcatTotalDone: () => number
  mdcatTotalTasks: () => number
  updateStreak: () => void
  resetToday: () => void
  resetAllData: () => void
}

const defaultDayData = (): DayData => ({
  meals: { 1: false, 2: false, 3: false, 4: false },
  blocks: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  steps: 0,
  cardio: 0,
  strength: false,
  dayType: "normal",
  focus: "",
  mcqs: 0,
  water: 0,
  pomodoroSessions: 0,
  note: "",
})

const defaultMeta = (): Meta => ({
  fitnessPhase: 0,
  studyPhase: "1",
  streak: 0,
  lastCompletedDate: "",
})

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      mdcatDone: {},
      mdcatOpen: [],
      history: {},
      weights: [],
      meta: defaultMeta(),
      days: {},
      currentView: "today",
      expandedRule: null,
      expandedMeal: null,
      showSaved: false,
      toast: null,

      getTodayData: () => {
        const key = todayKey()
        return get().days[key] || defaultDayData()
      },

      setTodayData: (data) => {
        const key = todayKey()
        set((state) => ({
          days: {
            ...state.days,
            [key]: { ...(state.days[key] || defaultDayData()), ...data },
          },
        }))
        get().updateStreak()
        get().flashSaved()
      },

      toggleMdcatTask: (id) => {
        set((state) => ({
          mdcatDone: { ...state.mdcatDone, [id]: !state.mdcatDone[id] },
        }))
        get().updateStreak()
        get().flashSaved()
      },

      toggleDayOpen: (day) => {
        set((state) => {
          const dayStr = String(day)
          const isOpen = state.mdcatOpen.includes(dayStr)
          return {
            mdcatOpen: isOpen
              ? state.mdcatOpen.filter((d) => d !== dayStr)
              : [...state.mdcatOpen, dayStr],
          }
        })
      },

      toggleNeetBlock: (id) => {
        const today = get().getTodayData()
        get().setTodayData({ blocks: { ...today.blocks, [id]: !today.blocks[id] } })
      },

      toggleMeal: (id) => {
        const today = get().getTodayData()
        get().setTodayData({ meals: { ...today.meals, [id]: !today.meals[id] } })
      },

      toggleStrength: () => {
        const today = get().getTodayData()
        get().setTodayData({ strength: !today.strength })
      },

      setMode: (mode) => {
        get().setTodayData({ dayType: mode })
      },

      setFocus: (focus) => {
        get().setTodayData({ focus })
      },

      addMcqs: (n) => {
        const today = get().getTodayData()
        get().setTodayData({ mcqs: Math.max(0, today.mcqs + n) })
      },

      setMcqs: (n) => {
        get().setTodayData({ mcqs: Math.max(0, n) })
      },

      setSteps: (n) => {
        const today = get().getTodayData()
        get().setTodayData({ steps: today.steps === n ? 0 : n })
      },

      setCardio: (n) => {
        const today = get().getTodayData()
        get().setTodayData({ cardio: today.cardio === n ? 0 : n })
      },

      setWater: (n) => {
        const today = get().getTodayData()
        get().setTodayData({ water: today.water === n ? Math.max(0, n - 1) : n })
      },

      addPomodoro: () => {
        const today = get().getTodayData()
        get().setTodayData({ pomodoroSessions: today.pomodoroSessions + 1 })
      },

      setNote: (note) => {
        get().setTodayData({ note })
      },

      setFitPhase: (id) => {
        set((state) => ({ meta: { ...state.meta, fitnessPhase: id } }))
      },

      saveWeight: (w) => {
        const key = todayKey()
        set((state) => ({
          weights: [
            ...state.weights.filter((x) => x.date !== key),
            { date: key, weight: w },
          ].sort((a, b) => a.date.localeCompare(b.date)),
        }))
      },

      deleteWeight: (date) => {
        set((state) => ({
          weights: state.weights.filter((x) => x.date !== date),
        }))
        get().showToast("Weight entry deleted")
      },

      setView: (view) => set({ currentView: view }),
      setExpandedRule: (num) => set({ expandedRule: num }),
      setExpandedMeal: (id) => set({ expandedMeal: id }),

      flashSaved: () => {
        set({ showSaved: true })
        setTimeout(() => set({ showSaved: false }), 900)
      },

      showToast: (msg) => {
        set({ toast: msg })
        setTimeout(() => set({ toast: null }), 2000)
      },

      getDayTargets: () => {
        const mode = get().getTodayData().dayType || "normal"
        return {
          blocks: { bad: 4, normal: 6, peak: 7 }[mode] || 6,
          mcq: { bad: 40, normal: 80, peak: 120 }[mode] || 80,
        }
      },

      getBlocksDone: () => {
        const today = get().getTodayData()
        return NEET_BLOCKS.filter((b) => today.blocks[b.id]).length
      },

      getMealsDone: () => {
        const today = get().getTodayData()
        return MEALS.filter((m) => today.meals[m.id]).length
      },

      getKcalDone: () => {
        const today = get().getTodayData()
        return MEALS.filter((m) => today.meals[m.id]).reduce((s, m) => s + m.kcal, 0)
      },

      getProDone: () => {
        const today = get().getTodayData()
        return MEALS.filter((m) => today.meals[m.id]).reduce((s, m) => s + m.pro, 0)
      },

      getCurrentPhase: () => {
        return FIT_PHASES[get().meta.fitnessPhase] || FIT_PHASES[0]
      },

      getFitDone: () => {
        const today = get().getTodayData()
        const cp = get().getCurrentPhase()
        const stepsHit = today.steps >= cp.steps
        const cardioHit = cp.cardio > 0 ? today.cardio >= cp.cardio : null
        const checks = [stepsHit, today.strength, ...(cardioHit !== null ? [cardioHit] : [])]
        return {
          done: checks.filter(Boolean).length,
          total: checks.length,
          stepsHit,
          cardioHit,
        }
      },

      getStudyPct: () => {
        const { blocks: bt, mcq: mt } = get().getDayTargets()
        const bd = get().getBlocksDone()
        const today = get().getTodayData()
        const bp = Math.round((bd / bt) * 100)
        const mp = Math.min(Math.round((today.mcqs / mt) * 100), 100)
        return Math.round(bp * 0.6 + mp * 0.4)
      },

      getDietPct: () => {
        return Math.round((get().getMealsDone() / 4) * 100)
      },

      getFitPct: () => {
        const { done, total } = get().getFitDone()
        return total === 0 ? 0 : Math.round((done / total) * 100)
      },

      getOverallPct: () => {
        return Math.round((get().getStudyPct() + get().getDietPct() + get().getFitPct()) / 3)
      },

      mdcatDayPct: (day) => {
        const { mdcatDone } = get()
        return Math.round((day.tasks.filter((t) => mdcatDone[t.id]).length / day.tasks.length) * 100)
      },

      mdcatDayDone: (day) => {
        const { mdcatDone } = get()
        return day.tasks.every((t) => mdcatDone[t.id])
      },

      mdcatTodayPlan: () => {
        return PLAN.find((d) => d.date === todayKey())
      },

      mdcatTotalDone: () => {
        return Object.values(get().mdcatDone).filter(Boolean).length
      },

      mdcatTotalTasks: () => {
        return PLAN.reduce((a, d) => a + d.tasks.length, 0)
      },

      updateStreak: () => {
        const op = get().getOverallPct()
        if (op >= 50) {
          const m = get().meta
          const key = todayKey()
          if (m.lastCompletedDate !== key) {
            const yest = new Date()
            yest.setDate(yest.getDate() - 1)
            const yk = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, "0")}-${String(yest.getDate()).padStart(2, "0")}`
            const newStreak = m.lastCompletedDate === yk ? m.streak + 1 : 1
            set((state) => ({
              meta: { ...state.meta, streak: newStreak, lastCompletedDate: key },
            }))
          }
        }
        set((state) => ({
          history: { ...state.history, [todayKey()]: get().getOverallPct() },
        }))
      },

      resetToday: () => {
        const key = todayKey()
        set((state) => ({
          days: {
            ...state.days,
            [key]: defaultDayData(),
          },
        }))
        get().showToast("Today's progress reset")
      },

      resetAllData: () => {
        set({
          mdcatDone: {},
          mdcatOpen: [],
          history: {},
          weights: [],
          meta: defaultMeta(),
          days: {},
          currentView: "today",
          expandedRule: null,
          expandedMeal: null,
        })
        get().showToast("All data cleared")
      },
    }),
    {
      name: "command-center-storage",
    }
  )
)
