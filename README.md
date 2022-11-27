# module-puppeteer
Puppeteer Build as single ESModule includes injectes as variable ```source =  ```

## TODO:
- Update to work with base64 import of injects
- improve the gitrepo build which is wired or lets say wiered
- Build the Browser Version
- https://github.com/lemanschik/puppeteer includes some incremental changes.


## Init for dev

```
git clone ...
npm i --no-save puppeteer-core@latest
npx rollup node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js --dir .
cp node_modules/puppeteer-core/lib/types.d.ts ./puppeteer-core.d.ts
```

commit new puppeteer-core.js if there is something in it 
