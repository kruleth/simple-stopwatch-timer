import { Text, View } from 'react-native';

import { formatSpoken, toTimeParts } from '@/lib/format';
import { monoFont } from '@/lib/theme';

type Tone = 'default' | 'muted' | 'danger';

type TimeDisplayProps = {
  ms: number;
  showHundredths?: boolean;
  tone?: Tone;
  /** Prefix for the screen-reader label, e.g. "Elapsed" or "Remaining". */
  label?: string;
};

const toneClass: Record<Tone, string> = {
  default: 'text-ink dark:text-ink-dark',
  muted: 'text-muted dark:text-muted-dark',
  danger: 'text-danger dark:text-danger-dark',
};

/**
 * The main readout.
 *
 * Rendered in a monospaced face with the hundredths set smaller and dimmer, so
 * the fast-moving digits do not pull the eye away from the seconds. The whole
 * block is a single accessibility node reading a spoken duration, rather than
 * a screen reader announcing raw digits many times a second.
 */
export function TimeDisplay({
  ms,
  showHundredths = true,
  tone = 'default',
  label,
}: TimeDisplayProps) {
  const { main, hundredths } = toTimeParts(ms);

  return (
    <View
      accessible
      accessibilityRole="timer"
      accessibilityLabel={label ? `${label} ${formatSpoken(ms)}` : formatSpoken(ms)}
      className="flex-row items-baseline justify-center">
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        allowFontScaling={false}
        style={{ fontFamily: monoFont }}
        className={`text-[68px] leading-[80px] ${toneClass[tone]}`}>
        {main}
      </Text>

      {showHundredths ? (
        <Text
          allowFontScaling={false}
          style={{ fontFamily: monoFont }}
          className="text-[30px] leading-[40px] text-muted dark:text-muted-dark">
          .{hundredths}
        </Text>
      ) : null}
    </View>
  );
}
