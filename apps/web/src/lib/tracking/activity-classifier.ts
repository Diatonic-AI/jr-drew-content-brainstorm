import type { ActivityCategory, ActivityEvent } from '@/types/activity'

const keywordCategoryMap: Record<ActivityCategory, string[]> = {
  focus: ['code', 'editor', 'ide'],
  meeting: ['zoom', 'meet', 'teams'],
  communication: ['slack', 'email', 'inbox'],
  documentation: ['docs', 'notion', 'confluence'],
  design: ['figma', 'sketch'],
  development: ['github', 'gitlab'],
  research: ['wiki', 'research'],
  break: ['spotify', 'youtube'],
  administrative: ['jira', 'asana'],
  misc: [],
}

export const classifyActivity = (event: ActivityEvent): ActivityCategory => {
  const haystack = `${event.windowTitle ?? ''} ${event.application.name} ${event.url ?? ''}`.toLowerCase()
  for (const [category, keywords] of Object.entries(keywordCategoryMap) as [ActivityCategory, string[]][]) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return category
    }
  }
  return 'misc'
}

export default classifyActivity
