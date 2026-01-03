# `yr-cli` - Command line tools for `yr`

`yr` is a **domain-specific language (DSL)** designed to streamline multi-stack development projects. Built for frontend, backend, and DevOps workflows, it merges stacks such as HTML, CSS, JS, Bash, and Python into a single cohesive language. It eliminates the need for heavy frameworks and excessive boilerplate by using indentation-based syntax, reusable macros, and modular wrapper files.

## Input and Output

### Input:

- `.yr` files containing indentation-based syntax, macros, wrappers, scripts, and configuration triggers

### Output:

`yr` can output in three primary formats:

1. **Plain Output (default)**:

   - HTML, CSS, and JS compiled and output as inline or separated files.

2. **Full Project Structure**:

```
projectname/
├─ actions/         # Executable scripts (serve, build, deploy)
│  ├─ serve
│  ├─ build
│  └─ deploy
├─ app/
│  ├─ assets/static/
│  ├─ app.js
│  └─ modules/
├─ config.json
├─ db/
├─ www/             # Compiled HTML, CSS, JS
└─ yr/              # Parsed .yr files
```

3. **JSON Mode** *(optional)*:
   - All parsed data (HTML structure, scripts, styles, macros, references) structured into JSON for advanced programmatic usage.

## Installation

The installation process is described in `install.sh` file

## Usage

When calling `$ yr` without arguments, it simply executes a prompt to write `yr`. The result will be displayed and you will be able to use all the tolls of the `yr` programming language.

Execute `$ yr -h` for more information on how to run tests or parse a `yrlib`.

## License

Read the LICENSE for information on how to use or distribute this software. This license should always be available.

> For more information on how to use the API or syntax description with examples, read the docs/ files for concise explanation or lib/Yrci/ for code snippets
