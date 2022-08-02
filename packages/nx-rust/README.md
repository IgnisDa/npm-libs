# @ignisda/nx-rust

This is a plugin for `@nrwl/nx` adding support for Rust applications and libraries.

## Generators

```sh
# @ignisda/nx-rust:bin also works
> nx generate @ignisda/nx-rust:app my-rust-app
```

```sh
> nx generate @ignisda/nx-rust:lib my-rust-lib
```

## Executors

```sh
# Build a library or binary
> nx build my-rust-app

# Run unit tests in a library
> nx test my-rust-lib

# Check a Rust project with `clippy`
> nx lint my-rust-app
# Don't fail on warnings:
> nx lint my-rust-app --fail-on-warnings false
```

### Options

The executors accept most of the same CLI args as the corresponding `cargo` commands. When
in doubt, run with the `--help` flag to see all options with descriptions:

```sh
> nx build my-rust-app --help
```

### Acknowledgements

This project uses a lot of code from [@nxrs/cargo](https://github.com/nxrs/cargo).
