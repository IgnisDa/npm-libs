# @ignisda/nx-rust

This is a plugin for `@nrwl/nx` adding support for Rust applications and libraries.

## Installation

```bash
pnpm install @ignisda/nx-rust@14.5.0
```

Installing the correct version is important. Read [versioning](#versioning).

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

## Versioning

I try to keep the minor versions of the package in sync so that they are compatible. As of
writing this, the latest version of NX is `14.5.1`. So I released version
`@ignisda/nx-rust@14.5.0` which is compatible with NX `14.5.x`. The package might also be
compatible with future versions of NX (like `14.6.x`) but that is not guaranteed since NX
internals change often. It will be compatible once I release `14.6.x` of
`@ignisda/nx-rust`.

## Acknowledgements

This project uses code from [@nxrs/cargo](https://github.com/nxrs/cargo).
