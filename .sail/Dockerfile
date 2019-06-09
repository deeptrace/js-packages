FROM codercom/ubuntu-dev

##
# Installing node v12
##
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - \
    && sudo apt-get install -y nodejs direnv gnupg2

ENV PATH $PATH:./node_modules/.bin

##
# Project extensions
##
RUN installext editorconfig.editorconfig
RUN installext wmaurer.change-case
RUN installext sallar.json-to-js-object
RUN installext ms-vscode.node-debug2
RUN installext mohsen1.prettify-json
RUN installext ms-vscode.sublime-keybindings

##
# Shared between host and container
##
LABEL share.npmrc="~/.npmrc:~/.npmrc"
LABEL share.gitconfig="~/.gitconfig:~/.gitconfig"
