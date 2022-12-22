export interface PlaylistItem {
   snippet: {
      title: string
      description: string
      thumbnails: {
         standard: {
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
