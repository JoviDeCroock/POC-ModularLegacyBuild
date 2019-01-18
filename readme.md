# Module builds

This proof of concept shows us:

1. the power of a module build vs a legacy one (smaller and faster)
2. the endless possibilities of this approach

One thing that would need to evolve in the community for this approach to work is to
get rid off the notion that library authors should decide what the minimum down transpiled
code is for their distribution.

This allows developers to choose their crowd and transpile down how much they want to.

To see this code in action:

1. `yarn build`
2. `cd dist && http-server -o`
3. open in chrome, look at network tab
4. open in IE/Safari and look at network tab.

You'll see that your legacy nevergreen browser pulls the old version while the newer one pulls the recent version.

NEVERGREEN:
```
                                  Asset       Size  Chunks             Chunk Names
           main-a7dccdced5e63d2e3fa9.js   1.42 KiB       0  [emitted]  main
       main-a7dccdced5e63d2e3fa9.js.map   1.11 KiB       0  [emitted]  main
```

EVERGREEN:
```
                                  Asset       Size  Chunks             Chunk Names
           main-134a83a4df9e42806ef7.mjs  302 bytes       0  [emitted]  main
       main-134a83a4df9e42806ef7.mjs.map  651 bytes       0  [emitted]  main
```
