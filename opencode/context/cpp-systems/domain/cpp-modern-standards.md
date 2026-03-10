# Modern C++ Standards (C++17/20/23)

## C++17 Key Features

### Structured Bindings
```cpp
auto [it, inserted] = map.emplace(key, val);
auto& [x, y, z] = vec3;
```

### `if constexpr`
```cpp
template<typename T>
void process(T val) {
    if constexpr (std::is_floating_point_v<T>) {
        // float-specific path — dead code eliminated at compile time
    } else {
        // integer path
    }
}
```

### Parallel STL (execution policies)
```cpp
#include <execution>
std::sort(std::execution::par_unseq, v.begin(), v.end());
std::transform(std::execution::par_unseq, in.begin(), in.end(), out.begin(), op);
// libstdc++ requires TBB linkage for par/par_unseq; libc++ uses its own backend
```

### `std::optional`, `std::variant`, `std::any`
- `optional<T>`: nullable value without heap — prefer over pointer-as-optional
- `variant<Ts...>`: type-safe union — good for dispatch tables, error/value sum types
- `any`: type-erased value — use sparingly; prefer `variant` when types are known

### `std::string_view`, `std::span` (C++20 backport common)
```cpp
void parse(std::string_view sv);          // no copy, no allocation
void process(std::span<float> data);      // non-owning view of contiguous range
```

### Filesystem
```cpp
#include <filesystem>
namespace fs = std::filesystem;
for (auto& p : fs::recursive_directory_iterator(path)) { ... }
```

## C++20 Key Features

### Concepts
```cpp
template<typename T>
concept Arithmetic = std::is_arithmetic_v<T>;

template<Arithmetic T>
T add(T a, T b) { return a + b; }

// Constraint on callable
template<typename F, typename T>
concept Reducer = requires(F f, T a, T b) { { f(a, b) } -> std::convertible_to<T>; };
```

### Ranges
```cpp
#include <ranges>
auto result = data
    | std::views::filter([](int x) { return x > 0; })
    | std::views::transform([](int x) { return x * 2; })
    | std::ranges::to<std::vector>();  // C++23 — use ranges::copy for C++20
```

### Coroutines
- `co_await`, `co_yield`, `co_return` — stackless coroutines
- Useful for async I/O pipelines; not typically used in compute kernels
- Requires coroutine promise/handle boilerplate or a library (cppcoro, libcoro)

### `std::jthread` & stop tokens (see HPC patterns)

### `std::latch`, `std::barrier`, `std::semaphore`
```cpp
std::latch done{N};
// Each of N threads: done.count_down();
// Main thread: done.wait();  // blocks until all counted down

std::barrier sync{N, []{ /* completion fn after each phase */ }};
// Each thread: sync.arrive_and_wait();  // phase synchronization
```

### `std::atomic<std::shared_ptr<T>>` — lock-free shared ownership (implementation-dependent)

### Three-way comparison (`<=>`)
```cpp
auto operator<=>(const MyType&) const = default;  // compiler-generated total order
```

### Modules (C++20) — adoption status
- Clang 16+: supported behind flags; adoption growing but not yet universal
- GCC 14+: partial support, improving rapidly
- CMake 3.28+: `target_sources(tgt PUBLIC FILE_SET CXX_MODULES FILES mod.ixx)`
- Recommendation: viable for new projects with single-compiler builds; defer for multi-compiler portability

## C++23 Key Features

### `std::expected<T, E>`
```cpp
#include <expected>
std::expected<Result, ErrorCode> compute(Input in) {
    if (invalid(in)) return std::unexpected{ErrorCode::InvalidInput};
    return Result{process(in)};
}
// Monadic: result.and_then(next_step).or_else(handle_error)
```

### `std::flat_map`, `std::flat_set`
- Sorted contiguous storage — better cache performance than `std::map` for read-heavy workloads

### `std::mdspan`
```cpp
#include <mdspan>
// Non-owning multi-dimensional view — critical for HPC array operations
std::mdspan<float, std::extents<int, 4, 4>> mat{data.data()};
mat[1, 2] = 3.14f;  // C++23 multi-dimensional subscript

// Custom layouts
using col_major = std::layout_left;
std::mdspan<float, std::dextents<int, 2>, col_major> col_mat{data.data(), rows, cols};
```

### `std::print` / `std::println`
```cpp
std::println("Result: {}, time: {:.3f}ms", val, elapsed);
```

### `ranges::to<Container>()` — materializes range into container

### Deducing `this` (explicit object parameter)
```cpp
template<typename Self>
auto& value(this Self&& self) { return std::forward<Self>(self).val_; }
// Enables CRTP without templates, recursive lambdas, etc.
```

## Type Traits Cheatsheet

```cpp
std::is_trivially_copyable_v<T>    // safe for memcpy, serialization, low-level buffer ops
std::is_standard_layout_v<T>       // C-compatible layout
std::alignment_of_v<T>             // alignment requirement
std::has_unique_object_representations_v<T>  // bitwise comparison safe
std::remove_cvref_t<T>             // strips const, volatile, reference
std::type_identity_t<T>            // prevents deduction (useful in template params)
```

## Compiler Feature Macros
```cpp
// Check C++ standard
#if __cplusplus >= 202302L  // C++23
#elif __cplusplus >= 202002L  // C++20
#elif __cplusplus >= 201703L  // C++17
#endif

// Clang-specific
__has_builtin(__builtin_expect)
__has_feature(address_sanitizer)
__has_attribute(likely)

// Likely/unlikely (C++20 attributes)
if (x > 0) [[likely]] { fast_path(); }
else [[unlikely]] { slow_path(); }
```
