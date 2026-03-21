#!/bin/bash

ocx profile rm naga --global
ocx profile rm naga-copilot --global
ocx profile rm naga-free --global

ocx profile add naga --global --source naga-group/ocx-default
ocx profile add naga-copilot --global --source naga-group/ocx-copilot
ocx profile add naga-free --global --source naga-group/ocx-free
