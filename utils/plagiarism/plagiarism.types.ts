export type Email = string

export type ScriptDescriptor = {
   script: string,
   culprit_assignment_name: string,
   culprit_count: number,
   culprits: Email[],
}
