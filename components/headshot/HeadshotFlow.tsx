"use client"

import { useReducer, useCallback, useRef, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { SplitLayout } from "./SplitLayout"
import { StepTransition } from "./StepTransition"
import { WelcomeMosaic } from "./panels/WelcomeMosaic"
import { WelcomeSidebar } from "./sidebar/WelcomeSidebar"
import { UploadPanel } from "./panels/UploadPanel"
import { UploadSidebar } from "./sidebar/UploadSidebar"
import { GeneratingGrid } from "./panels/GeneratingGrid"
import { GeneratingSidebar } from "./sidebar/GeneratingSidebar"
import { HeadshotGrid } from "./panels/HeadshotGrid"
import { SelectionSidebar } from "./sidebar/SelectionSidebar"
import { SelectedDisplay } from "./panels/SelectedDisplay"
import { CompleteSidebar } from "./sidebar/CompleteSidebar"

// ─── Types ───────────────────────────────────────────────

export interface UploadedFile {
  id: string
  name: string
  thumbnailSrc: string
  status: "validating" | "valid" | "error"
  errorMessage?: string
}

export interface Headshot {
  id: string
  src: string
}

interface State {
  step: number
  direction: number
  files: UploadedFile[]
  generatedHeadshots: Headshot[]
  selectedHeadshotId: string | null
  generationProgress: number
  guidelinesOpen: boolean
  lightboxHeadshotId: string | null
}

// ─── Actions ─────────────────────────────────────────────

type Action =
  | { type: "GO_NEXT" }
  | { type: "GO_BACK" }
  | { type: "ADD_FILES"; files: UploadedFile[] }
  | { type: "REMOVE_FILE"; id: string }
  | { type: "SET_FILE_STATUS"; id: string; status: UploadedFile["status"]; errorMessage?: string }
  | { type: "SET_GENERATION_PROGRESS"; progress: number }
  | { type: "SET_GENERATED_HEADSHOTS"; headshots: Headshot[] }
  | { type: "SELECT_HEADSHOT"; id: string }
  | { type: "OPEN_GUIDELINES" }
  | { type: "CLOSE_GUIDELINES" }
  | { type: "OPEN_LIGHTBOX"; id: string }
  | { type: "CLOSE_LIGHTBOX" }

const TOTAL_STEPS = 5
const MAX_PHOTOS = 6

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "GO_NEXT":
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS - 1), direction: 1 }
    case "GO_BACK":
      return { ...state, step: Math.max(state.step - 1, 0), direction: -1 }
    case "ADD_FILES":
      return {
        ...state,
        files: [...state.files, ...action.files].slice(0, MAX_PHOTOS),
      }
    case "REMOVE_FILE":
      return { ...state, files: state.files.filter((f) => f.id !== action.id) }
    case "SET_FILE_STATUS":
      return {
        ...state,
        files: state.files.map((f) =>
          f.id === action.id
            ? { ...f, status: action.status, errorMessage: action.errorMessage }
            : f
        ),
      }
    case "SET_GENERATION_PROGRESS":
      return { ...state, generationProgress: action.progress }
    case "SET_GENERATED_HEADSHOTS":
      return { ...state, generatedHeadshots: action.headshots }
    case "SELECT_HEADSHOT":
      return { ...state, selectedHeadshotId: action.id }
    case "OPEN_GUIDELINES":
      return { ...state, guidelinesOpen: true }
    case "CLOSE_GUIDELINES":
      return { ...state, guidelinesOpen: false }
    case "OPEN_LIGHTBOX":
      return { ...state, lightboxHeadshotId: action.id }
    case "CLOSE_LIGHTBOX":
      return { ...state, lightboxHeadshotId: null }
    default:
      return state
  }
}

const initialState: State = {
  step: 0,
  direction: 1,
  files: [],
  generatedHeadshots: [],
  selectedHeadshotId: null,
  generationProgress: 0,
  guidelinesOpen: false,
  lightboxHeadshotId: null,
}

// ─── Mock headshot images (placeholder paths) ────────────

const MOCK_HEADSHOTS: Headshot[] = Array.from({ length: 12 }, (_, i) => ({
  id: `headshot-${i}`,
  src: `/headshots/headshot-${(i % 36) + 1}.jpg`,
}))

// ─── Component ───────────────────────────────────────────

export function HeadshotFlow() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const isAnimating = useRef(false)

  const navigate = useCallback((action: Action) => {
    if (isAnimating.current) return
    isAnimating.current = true
    dispatch(action)
    setTimeout(() => {
      isAnimating.current = false
    }, 500)
  }, [])

  const goNext = useCallback(() => navigate({ type: "GO_NEXT" }), [navigate])
  const goBack = useCallback(() => navigate({ type: "GO_BACK" }), [navigate])

  // File upload handler
  const addFiles = useCallback(
    (fileList: File[]) => {
      const remaining = MAX_PHOTOS - state.files.length
      const toAdd = fileList.slice(0, remaining)

      const newFiles: UploadedFile[] = []

      toAdd.forEach((file) => {
        if (!file.type.startsWith("image/")) return
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const reader = new FileReader()
        reader.onload = (e) => {
          const uploaded: UploadedFile = {
            id,
            name: file.name,
            thumbnailSrc: e.target?.result as string,
            status: "validating",
          }
          dispatch({ type: "ADD_FILES", files: [uploaded] })

          // Mock validation — random delay, ~80% pass rate
          setTimeout(() => {
            const isValid = Math.random() > 0.2
            dispatch({
              type: "SET_FILE_STATUS",
              id,
              status: isValid ? "valid" : "error",
              errorMessage: isValid
                ? undefined
                : "Your face is being obscured by an object.",
            })
          }, 800 + Math.random() * 1200)
        }
        reader.readAsDataURL(file)
      })
    },
    [state.files.length]
  )

  // Generation timer
  useEffect(() => {
    if (state.step !== 2) return

    dispatch({ type: "SET_GENERATION_PROGRESS", progress: 0 })

    const duration = 10000
    const interval = 100
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += interval
      const progress = Math.min(Math.round((elapsed / duration) * 100), 100)
      dispatch({ type: "SET_GENERATION_PROGRESS", progress })

      if (progress >= 100) {
        clearInterval(timer)
        dispatch({ type: "SET_GENERATED_HEADSHOTS", headshots: MOCK_HEADSHOTS })
        setTimeout(() => {
          navigate({ type: "GO_NEXT" })
        }, 600)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [state.step, navigate])

  // Select headshot and advance
  const selectHeadshot = useCallback(
    (id: string) => {
      dispatch({ type: "SELECT_HEADSHOT", id })
      dispatch({ type: "CLOSE_LIGHTBOX" })
      setTimeout(() => goNext(), 300)
    },
    [goNext]
  )

  // ─── Step content ────────────────────────────────────────

  const stepKeys = ["welcome", "upload", "generating", "choose", "complete"]

  const leftContent = (
    <AnimatePresence mode="wait" custom={state.direction}>
      <StepTransition key={stepKeys[state.step]} direction={state.direction}>
        {state.step === 0 && <WelcomeMosaic />}
        {state.step === 1 && (
          <UploadPanel
            files={state.files}
            maxPhotos={MAX_PHOTOS}
            onAddFiles={addFiles}
            onRemoveFile={(id) => dispatch({ type: "REMOVE_FILE", id })}
          />
        )}
        {state.step === 2 && <GeneratingGrid progress={state.generationProgress} />}
        {state.step === 3 && (
          <HeadshotGrid
            headshots={state.generatedHeadshots}
            onSelect={(id) => dispatch({ type: "OPEN_LIGHTBOX", id })}
          />
        )}
        {state.step === 4 && (
          <SelectedDisplay
            headshot={state.generatedHeadshots.find(
              (h) => h.id === state.selectedHeadshotId
            )}
          />
        )}
      </StepTransition>
    </AnimatePresence>
  )

  const rightContent = (
    <AnimatePresence mode="wait" custom={state.direction}>
      <StepTransition key={stepKeys[state.step]} direction={state.direction}>
        {state.step === 0 && <WelcomeSidebar onNext={goNext} />}
        {state.step === 1 && (
          <UploadSidebar
            fileCount={state.files.length}
            hasValidFiles={state.files.some((f) => f.status === "valid")}
            onSubmit={goNext}
            onBack={goBack}
            onOpenGuidelines={() => dispatch({ type: "OPEN_GUIDELINES" })}
          />
        )}
        {state.step === 2 && (
          <GeneratingSidebar progress={state.generationProgress} />
        )}
        {state.step === 3 && <SelectionSidebar />}
        {state.step === 4 && (
          <CompleteSidebar onFinish={() => {}} onBack={goBack} />
        )}
      </StepTransition>
    </AnimatePresence>
  )

  return (
    <>
      <SplitLayout
        leftContent={leftContent}
        rightContent={rightContent}
        currentStep={state.step}
        totalSteps={TOTAL_STEPS}
      />

      {/* Guidelines modal */}
      {state.guidelinesOpen && (
        <GuidelinesModalLazy onClose={() => dispatch({ type: "CLOSE_GUIDELINES" })} />
      )}

      {/* Headshot lightbox */}
      {state.lightboxHeadshotId && (
        <HeadshotLightboxLazy
          headshot={state.generatedHeadshots.find(
            (h) => h.id === state.lightboxHeadshotId
          )}
          onSelect={() =>
            state.lightboxHeadshotId &&
            selectHeadshot(state.lightboxHeadshotId)
          }
          onClose={() => dispatch({ type: "CLOSE_LIGHTBOX" })}
        />
      )}
    </>
  )
}

// Lazy-loaded modals to avoid circular imports
import { GuidelinesModal as GuidelinesModalLazy } from "./shared/GuidelinesModal"
import { HeadshotLightbox as HeadshotLightboxLazy } from "./shared/HeadshotLightbox"
