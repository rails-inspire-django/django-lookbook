# Dark Mode

This package has theme switching functionality. You can switch between light and dark mode by clicking the button in the top right corner of the page.

It will set something like `data-theme="dark"` to the root HTML element.

## Tailwind CSS

If your project use Tailwind CSS, please config `tailwind.config.js`

```js
module.exports = {
    darkMode: ["selector", '[data-theme="dark"]'],
}
```

If TailwindCSS detect `data-theme="dark"` in the root HTML element, it will apply dark mode styles.
