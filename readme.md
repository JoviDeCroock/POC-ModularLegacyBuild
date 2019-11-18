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

```
Evergreen
main: 2.38KiB
vendors: 48KiB

Nevergreen
main: 2.85KiB
vendors: 78KiB
fetch-polyfill: 8.7KiB
```

Total legacy: 89.55KiB
Total vendors: 50.40KiB
