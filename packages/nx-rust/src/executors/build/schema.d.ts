import {
  CompilationOptions,
  DisplayOptions,
  FeatureSelection,
  OutputOptions,
  ManifestOptions,
  WatchModeOptions,
  BinaryOptions,
} from '../../common/schema';

/**
 * Build a particular project
 */
type Options = FeatureSelection &
  CompilationOptions &
  OutputOptions &
  DisplayOptions &
  ManifestOptions &
  WatchModeOptions &
  BinaryOptions;

export default Options;
