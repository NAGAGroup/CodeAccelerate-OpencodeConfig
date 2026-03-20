# Getting Started

## Install

Clone the repo:

```sh
git clone https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig
```

## Configure

Symlink `opencode/` to your OpenCode config directory (recommended — keeps your config in sync with upstream):

```sh
ln -s /path/to/CodeAccelerate-OpencodeConfig/opencode ~/.config/opencode
```

Or copy it if you prefer a local snapshot:

```sh
cp -r /path/to/CodeAccelerate-OpencodeConfig/opencode ~/.config/opencode
```

> If `~/.config/opencode` already exists, back it up or remove it first.

## API Keys

Make sure you have API keys set for whatever model providers are referenced in `opencode.json`. The config ships with specific model choices — swap them out freely if you use different providers.

## Run

```sh
opencode
```

That's it. Run `opencode` from any project directory and the config is picked up automatically.
