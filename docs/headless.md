# Headless Chrome testing

Chrome must be installed and must support headless mode.

Chrome can be installed on Travis by adding the following to your `.travis.yml`:

```
addons:
  apt:
    packages:
      - google-chrome-stable
```
