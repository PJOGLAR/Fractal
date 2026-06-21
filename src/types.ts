export interface TokenData {
  id: string
  name: string
  collection: string
  type: string
  value: unknown
  hex?: string
  scopes: string[]
  aliasOf?: string
  aliasName?: string
  aliasCollection?: string
  isPrimitive: boolean
}

export interface TokenBinding {
  property: string
  layerName: string
  tokenId: string
  tokenName?: string
}

export interface ComponentTokenBinding {
  componentName: string
  componentId: string
  category: string
  bindings: TokenBinding[]
  hardcodedCount?: number
}

export interface HardcodedValue {
  componentName: string
  componentId: string
  layerName: string
  property: string
  value: string
}

export interface DashboardData {
  extractedAt: string
  foundations: {
    collections: string[]
    primitiveTokens: TokenData[]
    semanticTokens: TokenData[]
  }
  components: ComponentTokenBinding[]
  orphanTokens: TokenData[]
  hardcodedValues?: HardcodedValue[]
}

export type LibraryId = 'components' | 'templates' | 'assets' | 'all'

export interface LibraryMeta {
  id: LibraryId
  label: string
  data: DashboardData | null
}
