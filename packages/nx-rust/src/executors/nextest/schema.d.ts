import {
  CompilationOptions,
  DisplayOptions,
  FeatureSelection,
  ManifestOptions,
  OutputOptions,
  WatchModeOptions,
} from '../../common/schema';

/**
 * Run tests using nextest for a particular project
 */
type Options = FeatureSelection &
  CompilationOptions &
  OutputOptions &
  DisplayOptions &
  ManifestOptions &
  WatchModeOptions;

export default Options;
