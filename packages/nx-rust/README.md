# @ignisda/nx-rust

This is a plugin for `@nrwl/nx` adding support for Rust applications and libraries.

## Installation

Installing the correct version is important. Read [versioning](#versioning).

```bash
pnpm install --save-dev @ignisda/nx-rust@latest
```

Then add the plugin to your `nx.json`:

```json
{
  "plugins": ["@ignisda/nx-rust"]
}
```

## Generators

```sh
> nx generate @ignisda/nx-rust:app my-rust-app # generate binary
> nx generate @ignisda/nx-rust:lib my-rust-lib # generate library
```

## Executors

```sh
# Build a library or binary
> nx build my-rust-app
# Run unit tests in a library, and enable watch mode
> nx test my-rust-lib --watch
# Check a Rust project with `clippy`
> nx lint my-rust-app
# Don't fail on warnings:
> nx lint my-rust-app --fail-on-warnings false
```

This plugin also provides the `@ignisda/nx-rust:nextest` executor to run the tests using
[nextest](https://nexte.st/).

**NOTE**: This plugin uses [cargo-watch](https://github.com/watchexec/cargo-watch) to
enable watch mode. Please follow its installation instructions to be able to use it.

### Options

The executors accept most of the same CLI args as the corresponding `cargo` commands. When
in doubt, run with the `--help` flag to see all options with descriptions:

```sh
> nx build my-rust-app --help
```

## Versioning

I try to keep the minor versions of the package in sync with NX to preserve compatibility.
As of writing this, the latest version of NX is `14.5.1`. So I released version
`@ignisda/nx-rust@14.5.0` which is compatible with NX `14.5.x`. The package might also be
compatible with future versions of NX (like `14.6.x`) but that is not guaranteed since NX
internals change often. It will be compatible once I release `14.6.x` of
`@ignisda/nx-rust`.

**NOTE**: It is generally a good practice to keep your NX and NX plugins version pinned.

As a general rule, if you are using the latest version of NX, chances are that this package
already works with it. If not, try downgrading `@ignisda/nx-rust` a few times. If that does
not work, please create a new issue in the project repository.

## Acknowledgements

This project uses code from [@nxrs/cargo](https://github.com/nxrs/cargo).
