### set env (oneliner)
```env $(paste *.env -s -d '\n' | grep -v '^#' | xargs -d '\n')```