# Readme Last Youtube Videos

## Requirements

First you need in hand as Youtube v3 api key, you can grab it in [here][youtube-api-key]

Then you must save this key as an environment variable in the repository you will use this action (Refer to <kbd>Settings</kbd> > <kbd>Secrets</kbd>)

## Setup

To set up this action create a github workflow following the example bellow

```yaml
on:
   workflow_dispatch:
   schedule:
      - cron: "0 15 * * *" # runs everyday at 3:00pm
jobs:
   update_readme:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v2
         - name: Get Youtube Videos
           uses: pmqueiroz/readme-last-youtube-videos@v1.0.2
           env:
              YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
           with:
              channel_id: "UUQ4zIVlfhsmvds7WuKeL2Bw"
         - run: |
              git config user.name pmqueiroz
              git config user.email your@mail.com
              git add README.md
              git commit -m "docs: update readme"
              git push origin master
         
```

> **Warning** the id you get from your channel url starts with `UC`, for some reason this api only works replacing by `UU`. (I didn't figured out why yet)

You must have a [Handlebars][handlebars] template file, this action provides an array of videos in the key `videos`. So your template would be written like this:

```hbs
<!-- ./github/templates/README.md.hbs -->

### Here are my last youtube videos:

{{#each videos}}

<a href="https://youtu.be/{{videoId}}">
   <img width="30%" src="{{thumbnail}}" alt="{{title}}"></img>
</a>

{{/each}}
```

The videos key contain an array of these objects:

```yaml
videoId: string
thumbnail: string
title: string
```

## Options

| Key | Description | Required | Default |
| --- | ----------- | -------- | ------- |
| `channel_id` | The id of the channel to search videos | true | - |
| `max_results` | Set the amount of videos to display | false | 3 |
| `entry_file` | Template file to render with the videos | false | ./.github/templates/README.md.hbs |

<!-- VARS -->

[youtube-api-key]: https://developers.google.com/youtube/v3
[handlebars]: https://handlebarsjs.com/
