export interface PlaylistItem {
   snippet: {
      title: string
      description: string
      thumbnails: {
         standard?: {
            url: string
         }
         medium: {
            url: string
         }
      },
      resourceId: {
         videoId: string
      }
   }
}

export interface PlaylistItems {
   items: PlaylistItem[]
}
