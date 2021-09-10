import { useLocation } from '@/ability'

export const useQuery = () => new URLSearchParams(useLocation().search)
