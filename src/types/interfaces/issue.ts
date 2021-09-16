export interface MetaData {
  type: string
  message: string
  filename?: string
  stack?: string
  others?: string
  [key: string]: any
}

export interface Issue {
  id: number
  intro: string
  apiKey: string
  type: string
  createdAt: Date
  updatedAt: Date
  metadata: MetaData
  eventsCount: number
  usersCount: number
}
