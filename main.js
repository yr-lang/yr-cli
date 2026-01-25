#!/usr/bin/env node
if (require.main !== module) return;

const man = `yr - Parse .yr files and build full projects

yr -h||--help

Console manual

yr

If no argument, run a parser to read from stdin. Every line will be added
to the parsed file until reaching <<<
  >>>: display the manual
  <<<: means EOF
  [OPTIONS]: only if no content is being set
    REQ=[VALUE]: requires a file and display its yr content
    PARSE=[VALUE]: parse a required file

yr -t||--test [WRAPPER_NAME]
  Wrapper name is optional. If present, parse the wrapper and console

yr // [OPTIONS]=[VALUE] // [FLAGS]
  [OPTIONS]: always have an equal sign (=) and a value after, case insensitive
    NAME: string, will be the name of the dir
    BUILDS: path, where the build will be saved
    CONFIG: path, yrconfig.json file with configurations
    TREE: paths, separated by comma (,), where to reach for .yr files to be required with (!!)
    VIEWS: custom (category1:view1;view2,category2:view1;category3)
      separated by comma (,)
      [CATEGORY]:[VIEWS]
        CATEGORY: which category to be found at libs
        VIEWS: optional
          If empty, parse all the views (views are wrappers that ends with _)
          if not empty, parse only the views described, separated by semicolon (;)
  [FLAGS]: optional
    --console
      Activate debug optional and console the parsed files
    --exec
      Execute app.js after parsing
    --ignore-save
      Don't save the build files

Examples:

$ clear; yr name=yrci config=~/.yr/yr-cli tree=~/.yr,~/.yrlibs views=yrci:index builds=~/.yrb --exec --console`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(man);
  return;
}

const yr = require(`${process.env.HOME}/.yr/yr/node`);

if (process.argv.length === 2) {
  function getCode(repeat=false) {
    console.log('>>>');

    const readline = require('readline').createInterface({
      input: process.stdin, output: process.stdout
    });

    const required = {};

    let code = '', close;
    readline.on('line', (line) => {
      if ((line.trim() === '' || line === '--help') && code === '') {
        console.log(man);
        console.log('>>>');
        return;
      }

      if (code === ''){
        for (let item of ['REQ', 'PARSE']) {
          if (!line.startsWith(`${item}=`)) continue;
          line = line.split(`${item}=`).join('');
          const wrapperName = line.split('/');
          if (wrapperName.length === 1) wrapperName.unshift('__');

          if (item === 'REQ') {
            required[line] = yr.lib(wrapperName[0], wrapperName[1], {
              onlySections: true
            }).output.yr;

            console.log(required[line]);
          } else if (item === 'PARSE') {
            if (!required[line]) {
              required[line] = yr.lib(wrapperName[0], wrapperName[1], {
                onlySections: true
              }).output.yr;
            }

            console.log(required[line].extensions);
            console.log(required[line].code);
            console.log('===============================');
            console.log(yr.parse(required[line].code, {
              extensions: required[line].extensions
            }));
          }
        }
      }

      if (line.endsWith('<<<')) {
        line = line.slice(0, -3);
        close = true;
      }

      code += line;

      if (close) {
        console.log('===');
        console.log(yr.parse(code));
        readline.close();
        code = '';
        if (repeat) getCode(repeat);
        return;
      }

      code += '\n';
    });
  }

  console.log('Welcome to yr v0.0.2.');
  console.log('Type "--help" for more information.');
  console.log('Type "<<<" to parse the code block.');
  console.log('\nPress "Ctrl + C" to exit.');
  getCode(true);
  return;
}

const fs = require('fs');
const utils = yr.require('utils');

const env = {
  HOME: process.env.HOME,
  LIBS: [process.env.HOME + '/.yrlibs'],
  BUILDS: process.env.HOME + '/.yrb',
  CONFIG: __dirname
};

for (let item of process.argv) {
  if (!item.includes('=')) continue;
  const vars = item.split('=');
  vars[0] = vars[0].toUpperCase();

  if (vars[0] === 'NAME') {
    env[vars[0]] = vars[1];
  } else if (vars[0] === 'BUILDS' || vars[0] === 'CONFIG') {
    env[vars[0]] = vars[1];
  } else if (vars[0] === 'TREE') {
    env[vars[0]] = vars[1].split(',');
  } else if (vars[0] === 'VIEWS') {
    env[vars[0]] = [];

    for (let value of vars[1].split(',')) {
      if (value.includes(':')) {
        parsed = value.split(':');
        value = [];

        for (let key of parsed) value.push(utils.capitalize(key));
        value = value.join('/');
      }

      env[vars[0]].push(utils.capitalize(value));
    }
  }
}

yr.set(env);
if (process.argv[2] === '--test' || process.argv[2] === '-t') {
  let wrapper = [];

  try {
    wrapper = process.argv[3].split('/');
    if (wrapper.length === 1) wrapper.unshift('__');
  } catch(error) {/* pass */}

  console.log(`Starting CI... ${wrapper.join('/')}`);
  yr.ci(wrapper[0], wrapper[1]);
  return;
}

yr.build(env.NAME, {
  save: (!process.argv.includes('--ignore-save') && !process.argv.includes('-is')),
  debug: (process.argv.includes('--console') || process.argv.includes('-c')),
  exec: (process.argv.includes('--exec') || process.argv.includes('-e'))
});
