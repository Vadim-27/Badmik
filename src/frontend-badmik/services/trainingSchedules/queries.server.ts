// src/services/_shared/queryKeys.ts
export const qk = {
  trainingSchedules: {
    root: () => ['trainingSchedules'] as const,

    byId: (id: string) => ['trainingSchedules', 'byId', id] as const,

    list: (params: Record<string, unknown>) =>
      ['trainingSchedules', 'list', params] as const,
  },
} as const;