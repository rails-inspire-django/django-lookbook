const Path = require("path");
const pwd = process.env.PWD;
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

// We can add current project paths here
const projectPaths = [
  Path.join(pwd, "./frontend/src/**/*.js"),
  Path.join(pwd, "./src/django_lookbook/templates/**/*.html"),
  // add js file paths if you need
  Path.join(pwd, "./node_modules/tailwindcss-stimulus-components/dist/*.js"),
];

const contentPaths = [...projectPaths];
console.log(`tailwindcss will scan ${contentPaths}`);

// We can add some alias here
const newColors = {
  ...colors,
  primary: colors.blue,
  secondary: colors.green,
  success: colors.green,
  danger: colors.red,
};

module.exports = {
  content: contentPaths,
  theme: {
    fontFamily: {
      sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono],
    },
    colors: newColors,
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            a: {
              color: theme("colors.primary.500"),
              "&:hover": {
                color: `${theme("colors.primary.600")} !important`,
              },
              code: { color: theme("colors.primary.400") },
            },
            h1: {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
              color: theme("colors.gray.900"),
            },
            h2: {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
              color: theme("colors.gray.900"),
            },
            h3: {
              fontWeight: "600",
              color: theme("colors.gray.900"),
            },
            "h4,h5,h6": {
              color: theme("colors.gray.900"),
            },
            pre: {
              backgroundColor: theme("colors.gray.800"),
              padding: 0,
            },
            code: {
              backgroundColor: theme("colors.gray.100"),
              paddingLeft: "4px",
              paddingRight: "4px",
              paddingTop: "2px",
              paddingBottom: "2px",
              borderRadius: "0.25rem",
              wordWrap: "break-word",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
            details: {
              backgroundColor: theme("colors.gray.100"),
              paddingLeft: "4px",
              paddingRight: "4px",
              paddingTop: "2px",
              paddingBottom: "2px",
              borderRadius: "0.25rem",
            },
            hr: { borderColor: theme("colors.gray.200") },
            "ol li::marker": {
              fontWeight: "600",
              color: theme("colors.gray.500"),
            },
            "ul li::marker": {
              backgroundColor: theme("colors.gray.500"),
            },
            strong: { color: theme("colors.gray.600") },
            blockquote: {
              color: theme("colors.gray.900"),
              borderLeftColor: theme("colors.gray.200"),
              fontStyle: "normal",
            },
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false,
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
