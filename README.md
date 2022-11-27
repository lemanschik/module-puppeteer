# package-puppeteer-core-esm
This is a Incremental Pre step before we refactored it complet


## Init for dev

```
git clone ...
npm i --no-save puppeteer-core@latest
npx rollup node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js --dir .
cp node_modules/puppeteer-core/lib/types.d.ts ./puppeteer-core.d.ts
```

commit new puppeteer-core.js if there is something in it 
