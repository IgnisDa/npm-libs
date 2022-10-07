import type {
  CompilationOptions,
  DisplayOptions,
  FeatureSelection,
  OutputOptions,
  ManifestOptions,
  WatchModeOptions,
  BinaryOptions,
} from '../../common/schema';

/**
 * Run a particular project
 */
type Options = FeatureSelection &
  CompilationOptions &
  OutputOptions &
  DisplayOptions &
  ManifestOptions &
  WatchModeOptions &
  BinaryOptions;

export default Options;
