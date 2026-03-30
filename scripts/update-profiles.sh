#!/bin/bash

ocx profile rm naga --global
ocx profile rm naga-copilot --global
ocx profile rm naga-free --global
ocx profile rm naga-haiku --global
ocx profile rm naga-haiku-copilot --global
ocx profile rm naga-ollama --global

ocx profile add naga --global --source naga-group/ocx-default
ocx profile add naga-copilot --global --source naga-group/ocx-copilot
ocx profile add naga-free --global --source naga-group/ocx-free
ocx profile add naga-haiku --global --source naga-group/ocx-haiku
ocx profile add naga-haiku-copilot --global --source naga-group/ocx-haiku-copilot
ocx profile add naga-ollama --global --source naga-group/ocx-ollama
