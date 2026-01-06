
export interface Lap {
  id: number;
  time: number;
  overallTime: number;
}

export type StopwatchStatus = 'idle' | 'running' | 'paused';
