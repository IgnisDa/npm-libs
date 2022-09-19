import type {
  CompilationOptions,
  DisplayOptions,
  FeatureSelection,
  OutputOptions,
  ManifestOptions,
  WatchModeOptions,
} from '../../common/schema';

/**
 * Run a particular project
 */
type Options = FeatureSelection &
  CompilationOptions &
  OutputOptions &
  DisplayOptions &
  ManifestOptions &
  WatchModeOptions & {
    /**
     * The project binary to run.
     *
     * By default this will be set to the name of the project that the executor is being
     * run for.
     */
    bin?: string;
  };

export default Options;
