# INTERNAL RULES

- Only core components can add more mutable functions (you need to include `getComponent` function and return the new `$mutable` to be able to be visible outside)