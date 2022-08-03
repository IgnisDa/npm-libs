import {
  CompilationOptions,
  DisplayOptions,
  FeatureSelection,
  ManifestOptions,
  OutputOptions,
} from '../../common/schema';

/**
 * Run tests for a particular project
 */
type Options = FeatureSelection &
  CompilationOptions &
  OutputOptions &
  DisplayOptions &
  ManifestOptions & {
    /**
     * Whether to launch the test runner in watch mode. This uses `cargo-watch` under the
     * hood to watch for file changes.
     * @default false
     */
    watch?: boolean;
  };

export default Options;
