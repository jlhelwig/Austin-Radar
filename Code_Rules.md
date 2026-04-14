# Austin Radar: Mission-Critical Code Rules
*NASA Power of Ten + Modern Extensions for Mobile Reliability.*

## 1. NASA Power of Ten
1. **Simple Control**: No `goto`, `setjmp`, `longjmp`, or recursion (Library implementations are exempt).
2. **Fixed Loops**: All loops must have statically provable upper bounds.
3. **Static Allocation**: Minimize excessive allocation; no dynamic memory allocation in core loop/logic after boot.
4. **Function Limit**: Max 60 lines per function.
5. **Assertions**: Min 2 side-effect-free assertions per function.
6. **Data Scope**: Declare data at the smallest possible visibility scope.
7. **Validation**: Validate all function returns and input parameters.
8. **Preprocessor**: Use only for header inclusions and simple macros.
9. **Pointers**: Max 1 level of dereferencing; no function pointers.
10. **Zero Warnings**: Pedantic compilation; zero warnings on all static checks.

## 2. Modern Extensions
11. **Immutability**: `const` only. State/Props are strictly immutable.
12. **Pure UI**: Components must be deterministic pure functions.
13. **Error Boundaries**: Mandatory wrappers for all top-level screens.
14. **Secure Storage**: No plain-text tokens. Use Keychain/Keystore via MMKV.
15. **Fail-Closed Net**: 5s timeout on all IO; default to safe-empty state.
16. **Documentation**: Comments required for every function and data definition.
