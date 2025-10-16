# Sprites

For obvious reasons I will not be putting the 50k sprites deltarune has in this repo

## Exporting/Getting the sprites

1. Download https://github.com/UnderminersTeam/UndertaleModTool
2. Open the chapter's data.win via undertalemodtool
3. In the top bar, Scripts > Resource Exporters > ExportAllSprites.csx
4. No padding, Yes for subfolders
5. Copy the subfolders into the Chapter[.] folders ofc

## Uploading to any server

I will be using Caddy for this

1. Upload files to server
2. Setup Caddyfile to look like something like this:
  ```caddy
    root * /home/youruser/deltapagesprites
    file_server {
        browse
        hide .git .env
    }
  ```
3. Set the SPRITES_CDN_BASE in `.env`
4. Profit???

Pro tip: Don't try to use vercel blobs for this. It will not end up well.