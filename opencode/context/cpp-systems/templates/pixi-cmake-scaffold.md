# Pixi + CMake + Nushell Project Scaffold

## Project Structure

```
project-root/
├── pixi.toml              # dependencies, tasks, channels, platforms
├── pixi.lock              # locked dependency versions
├── CMakeLists.txt         # root CMake
├── CMakePresets.json      # all build presets (configure + build + test)
├── src/
├── tests/
├── benchmarks/
├── docs/
└── scripts/               # nushell scripts called by pixi tasks
    ├── configure.nu
    ├── build.nu
    └── test.nu
```

## pixi.toml Template

```toml
[project]
name = "my-project"
version = "0.1.0"
channels = [
    "https://prefix.dev/code-accelerate",
    "conda-forge"
]
platforms = ["linux-64"]  # add osx-arm64, linux-aarch64 as needed

[dependencies]
# Compiler: platform-sysroot variants for reproducibility
clangxx_linux-64 = "*"    # pins sysroot, fully reproducible
clang_linux-64 = "*"
# Alternative when sysroot isn't practical:
# clangxx = "*"
# clang = "*"

cmake = ">=3.28"
ninja = "*"
nushell = "*"

# Testing
catch2 = "*"           # or: gtest = "*"

# Benchmarking (optional)
benchmark = "*"        # Google Benchmark

[tasks]
configure = { cmd = "nu scripts/configure.nu", description = "Configure default preset" }
build     = { cmd = "nu scripts/build.nu",     description = "Build default preset" }
test      = { cmd = "nu scripts/test.nu",      description = "Test default preset" }

# Preset override: pixi run configure <preset>
# Handled inside nushell scripts via $env.PRESET or CLI arg
```

## CMakePresets.json Template

```json
{
    "version": 6,
    "configurePresets": [
        {
            "name": "default",
            "displayName": "Default (Clang, Debug)",
            "generator": "Ninja",
            "binaryDir": "${sourceDir}/build/default",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug",
                "CMAKE_C_COMPILER": "clang",
                "CMAKE_CXX_COMPILER": "clang++",
                "CMAKE_EXPORT_COMPILE_COMMANDS": "ON"
            }
        },
        {
            "name": "release",
            "inherits": "default",
            "displayName": "Release (Clang, O3)",
            "binaryDir": "${sourceDir}/build/release",
            "cacheVariables": { "CMAKE_BUILD_TYPE": "Release", "CMAKE_CXX_FLAGS": "-O3 -march=native" }
        },
        {
            "name": "asan",
            "inherits": "default",
            "displayName": "ASan + UBSan",
            "binaryDir": "${sourceDir}/build/asan",
            "cacheVariables": {
                "CMAKE_CXX_FLAGS": "-fsanitize=address,undefined -fno-omit-frame-pointer",
                "CMAKE_EXE_LINKER_FLAGS": "-fsanitize=address,undefined"
            }
        }
    ],
    "buildPresets": [
        { "name": "default", "configurePreset": "default" },
        { "name": "release", "configurePreset": "release" },
        { "name": "asan",    "configurePreset": "asan" }
    ],
    "testPresets": [
        { "name": "default", "configurePreset": "default", "output": { "outputOnFailure": true } },
        { "name": "release", "configurePreset": "release", "output": { "outputOnFailure": true } },
        { "name": "asan",    "configurePreset": "asan",    "output": { "outputOnFailure": true } }
    ]
}
```

## Nushell Scripts

All scripts follow the same pattern — accept optional preset name (default: "default"):

### scripts/configure.nu
```nu
#!/usr/bin/env nu
def main [preset: string = "default"] {
    print $"Configuring preset: ($preset)"
    cmake --preset $preset
}
```

### scripts/build.nu
```nu
#!/usr/bin/env nu
def main [preset: string = "default"] {
    print $"Building preset: ($preset)"
    cmake --build --preset $preset
}
```

### scripts/test.nu
```nu
#!/usr/bin/env nu
def main [preset: string = "default"] {
    print $"Testing preset: ($preset)"
    ctest --preset $preset
}
```

## Build Directory Convention

```
build/
├── default/    # Debug, plain clang
├── release/    # Release, -O3 -march=native
├── asan/       # AddressSanitizer + UBSan
└── tsan/       # ThreadSanitizer (add preset if needed)
```

`compile_commands.json` generated in each build dir — symlink default to root for tooling:
```bash
ln -sf build/default/compile_commands.json compile_commands.json
```

## CMakeLists.txt Patterns

```cmake
cmake_minimum_required(VERSION 3.28)
project(my_project VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Warnings (Clang)
add_compile_options(
    -Wall -Wextra -Wpedantic
    -Wno-unused-parameter   # remove once stable
    -Werror                 # CI: treat warnings as errors
)

# Main library
add_library(my_lib STATIC src/foo.cpp src/bar.cpp)
target_include_directories(my_lib PUBLIC include/)

# Tests (Catch2)
find_package(Catch2 3 REQUIRED)
add_executable(tests tests/foo_test.cpp tests/bar_test.cpp)
target_link_libraries(tests PRIVATE my_lib Catch2::Catch2WithMain)
include(CTest)
include(Catch)
catch_discover_tests(tests)

# Benchmarks (optional)
find_package(benchmark REQUIRED)
add_executable(benchmarks bench/foo_bench.cpp)
target_link_libraries(benchmarks PRIVATE my_lib benchmark::benchmark)
```

## Compiler Package Selection Guide

| Package | Use Case | Notes |
|---|---|---|
| `clangxx_linux-64` | Reproducible Linux builds | Pins conda sysroot |
| `clangxx_osx-arm64` | Reproducible macOS ARM builds | Uses macOS SDK from conda |
| `clangxx` | Cross-platform / system sysroot | Uses system headers |

Use `_<platform>` variants for team/CI. Use base `clangxx` for quick local experiments.
