# C++ Code Quality Standards

## Core Principles

These standards apply to all C++ code. Expert-level assumed — no justifications for basics.

## Resource Management

### RAII — Non-Negotiable
Every resource must have a clear owner. If a resource doesn't have RAII wrapper, write one before using it.

```cpp
// WRONG: manual resource management
void* handle;
api_create_resource(&desc, &handle);
// ... (exception possible here)
api_destroy_resource(handle);  // skipped on exception

// RIGHT: RAII wrapper
struct ManagedResource {
    void* handle{};
    ~ManagedResource() { if (handle) api_destroy_resource(handle); }
    ManagedResource(ManagedResource&&) = default;
    ManagedResource(const ManagedResource&) = delete;
};
```

### Ownership Rules
- Single ownership: `std::unique_ptr<T>`
- Shared ownership (rare, justified): `std::shared_ptr<T>`
- Non-owning observation: raw pointer `T*` or `std::span<T>` — document that it's non-owning
- Never: owning raw pointer, `new` without immediate wrapping, `delete` outside destructor

### Move Semantics
```cpp
// Rule of Zero: prefer — let compiler generate if members are all RAII
struct Kernel { std::unique_ptr<Impl> impl_; };  // move-only, copyable if impl copyable

// Rule of Five: when managing raw resource
class Buffer {
    void* ptr_{};
public:
    Buffer(Buffer&& o) noexcept : ptr_{std::exchange(o.ptr_, nullptr)} {}
    Buffer& operator=(Buffer&& o) noexcept {
        if (this != &o) { release(); ptr_ = std::exchange(o.ptr_, nullptr); }
        return *this;
    }
    Buffer(const Buffer&) = delete;
    Buffer& operator=(const Buffer&) = delete;
    ~Buffer() { release(); }
private:
    void release() noexcept { if (ptr_) { free_resource(ptr_); ptr_ = nullptr; } }
};
```

## Undefined Behavior Prevention

### Integer Operations
```cpp
// Signed overflow: UB
int a = INT_MAX; int b = a + 1;  // UB

// Safe alternatives
#include <limits>
if (a > std::numeric_limits<int>::max() - b) { /* overflow */ }

// Or use unsigned for bit manipulation, sizes, indices
std::size_t idx = ...;  // not int
```

### Pointer Safety
```cpp
// Null dereference
assert(ptr != nullptr);  // debug builds
if (!ptr) [[unlikely]] throw std::runtime_error{"null ptr"};

// Dangling reference: never return reference to local
// WRONG: const std::string& get() { std::string s = compute(); return s; }
// RIGHT: std::string get() { return compute(); }

// Pointer arithmetic bounds
// Use std::span to carry bounds information
void process(std::span<float> data) {
    for (auto& x : data) { ... }  // no manual bounds math
}
```

### Strict Aliasing
```cpp
// WRONG: type-punning via pointer cast (UB under strict aliasing)
float f = 3.14f;
int i = *reinterpret_cast<int*>(&f);  // UB

// RIGHT: memcpy or std::bit_cast (C++20)
int i = std::bit_cast<int>(f);  // defined, compiler optimizes away copy
```

### Uninitialized Values
- Always initialize members in constructor or member initializer
- Prefer `= default` member initialization: `int x_{0}`
- Use `-Wuninitialized -Wconditional-uninitialized` (both enabled via our clang config)

## Memory Safety

### No Raw new/delete in Application Code
- Exception: inside RAII wrapper constructors/destructors
- Exception: custom allocators implementing `operator new`

### Container Safety
```cpp
// Bounds-checked access in debug builds
vec.at(i)      // throws std::out_of_range
span[i]        // UB if out of bounds — use at() or assert
// In hot paths: assert(i < vec.size()); vec[i]
```

## Error Handling

### Error Propagation
```cpp
// Preferred for new code (C++23)
std::expected<T, Error> compute(Input in);

// Pre-C++23
std::optional<T> try_compute(Input in);  // when error detail not needed
// Or: error output parameter
bool compute(Input in, T& out, Error& err);
```

### No Silent Failures
- Every error code from C APIs must be checked
- Provide `THROW_IF_FAILED(result)` style macros for C API wrappers
- Log or propagate — never swallow

### Exception Policy
- Exceptions: acceptable for initialization paths and configuration
- No exceptions in hot paths or performance-critical code

## Naming & Style

```
Types:          PascalCase     → KernelBuffer, WorkGroupConfig
Functions:      snake_case     → compute_reduction(), get_device_info()
Variables:      snake_case     → work_group_size, num_elements
Constants:      kPascalCase    → kMaxBufferSize, kDefaultAlignment
Private members: trailing_     → buffer_, config_
Macros:         UPPER_SNAKE    → THROW_IF_FAILED, ASSERT_VALID
Template params: T, U, or descriptive PascalCase → ElementType, PolicyType
```

## Code Review Checklist

```
□ Every resource has a clear RAII owner
□ No owning raw pointers
□ No signed integer overflow risk in index/size math
□ No dangling references (especially in return values, captures)
□ All error codes checked; no silent failures
□ No uninitialized variables
□ Move semantics correct (rule of zero or rule of five, not three)
□ Thread-shared mutable state protected or documented as intentionally racy
□ Hot paths exception-free
```
