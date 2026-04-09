#!/bin/bash

bun run deploy

sleep 10

rm -rf ~/.config/opencode/plugins/planning-enforcement.js ~/.config/opencode/planning ~/.config/opencode/.ocx/

npx ocx profile rm naga --global
npx ocx profile rm naga-copilot --global
npx ocx profile rm naga-free --global
npx ocx profile rm naga-haiku --global
npx ocx profile rm naga-haiku-copilot --global
npx ocx profile rm naga-ollama --global

npx ocx profile add naga --global --source naga-group/ocx-default
npx ocx profile add naga-copilot --global --source naga-group/ocx-copilot
npx ocx profile add naga-free --global --source naga-group/ocx-free
npx ocx profile add naga-haiku --global --source naga-group/ocx-haiku
npx ocx profile add naga-haiku-copilot --global --source naga-group/ocx-haiku-copilot
npx ocx profile add naga-ollama --global --source naga-group/ocx-ollama

npx ocx add --global naga-group/ocx-planning-plugin
