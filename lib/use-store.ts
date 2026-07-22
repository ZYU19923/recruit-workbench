'use client'

import { useSyncExternalStore, useMemo } from 'react'
import { db } from './storage'

export function useStore() {
  return useSyncExternalStore(db.subscribe, db.version, db.version)
}

export function useJobs() {
  const tick = useStore()
  return useMemo(() => db.getJobs(), [tick])
}

export function useJob(id: string) {
  const tick = useStore()
  return useMemo(() => db.getJob(id), [tick, id])
}

export function useCandidates() {
  const tick = useStore()
  return useMemo(() => db.getCandidates(), [tick])
}

export function useCandidate(id: string) {
  const tick = useStore()
  return useMemo(() => db.getCandidate(id), [tick, id])
}

export function useCandidatesByJob(jobId: string) {
  const tick = useStore()
  return useMemo(() => db.getCandidatesByJob(jobId), [tick, jobId])
}

export function useCommunications(candidateId?: string) {
  const tick = useStore()
  return useMemo(() => db.getCommunications(candidateId), [tick, candidateId])
}

export function useInterviews() {
  const tick = useStore()
  return useMemo(() => db.getInterviews(), [tick])
}

export function useInterviewsByCandidate(candidateId: string) {
  const tick = useStore()
  return useMemo(() => db.getInterviewsByCandidate(candidateId), [tick, candidateId])
}

export function useOffers() {
  const tick = useStore()
  return useMemo(() => db.getOffers(), [tick])
}

export function useOffer(id: string) {
  const tick = useStore()
  return useMemo(() => db.getOffer(id), [tick, id])
}

export function useWorkLogs() {
  const tick = useStore()
  return useMemo(() => db.getWorkLogs(), [tick])
}

export function useTodos() {
  const tick = useStore()
  return useMemo(() => db.getTodos(), [tick])
}

export function useDashboardStats() {
  const tick = useStore()
  return useMemo(() => db.getDashboardStats(), [tick])
}

export function useJobsOverview() {
  const tick = useStore()
  return useMemo(() => db.getJobsOverview(), [tick])
}
