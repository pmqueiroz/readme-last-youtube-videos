import axios from 'axios'
import { getInput } from '@actions/core'
import { compile } from 'handlebars'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import type { PlaylistItems, PlaylistItem } from './entities'

const playlistItemEnhancer = (item: PlaylistItem) => ({ 
   videoId: item.snippet.resourceId.videoId,
   thumbnail: item.snippet.thumbnails.standard.url,
   title: item.snippet.title
})

async function fetchLatestVideos({ channelId, maxResults, apiKey }:{ channelId: string; maxResults: string; apiKey: string }) {
   const { data } = await axios<PlaylistItems>({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      url: '/playlistItems',
      params: {
         playlistId: channelId,
         part: 'snippet',
         maxResults,
         key: apiKey
      }
   })

   return data.items.map(playlistItemEnhancer)
}

;(async () => {
   const API_KEY = process.env.YOUTUBE_API_KEY

   if (!API_KEY) throw new Error('Missing Youtube Api Key')
   
   const inputtedMaxResults = getInput('max_results')
   const inputtedChannelId = getInput('channel_id')
   const inputtedEntryFile = getInput('entry_file')
   const inputtedOutputFile = getInput('output_file')
   
   if (!inputtedChannelId) throw new Error('Missing Channel Id')
   if (!existsSync(inputtedEntryFile)) throw new Error(`File ${inputtedEntryFile} does not exists. Did you remember to use checkout action`)

   const videos = await fetchLatestVideos({ channelId: inputtedChannelId, maxResults: inputtedMaxResults, apiKey: API_KEY })

   const templateFile = await readFile(inputtedEntryFile, { encoding: 'utf-8' })

   const templateRenderer = compile(templateFile)

   const finalResult = templateRenderer({ videos })

   await writeFile(inputtedOutputFile, finalResult)
})()
