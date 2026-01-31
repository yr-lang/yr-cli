#!/bin/bash
git clone https://github.com/mwtheus/yr ~/.yr-lang/yr
rcpath="alias yr=\"node $(pwd)/main.js\""
grep -E "$rcpath" ~/.bashrc || echo -e "\n$rcpath" >> ~/.bashrc
if [[ "$1" == '-p' || "$1" == '--path' ]]; then exit 0; fi
