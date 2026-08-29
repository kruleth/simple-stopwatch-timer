import { FlatList, Text, View } from 'react-native';

import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';
import { monoFont } from '@/lib/theme';

type LapListProps = {
  /** Each lap's own length, in the order they were recorded. */
  laps: number[];
  /** Renders inside a parent that is already scrolling (the session detail screen). */
  scrollEnabled?: boolean;
};

type Row = { index: number; split: number; total: number };

/** Fastest and slowest are only worth calling out once there is a spread to compare. */
const MIN_LAPS_FOR_EXTREMES = 3;

function buildRows(laps: number[]): Row[] {
  let running = 0;

  return laps
    .map((split, i) => {
      running += split;
      return { index: i + 1, split, total: running };
    })
    .reverse(); // Newest lap on top.
}

export function LapList({ laps, scrollEnabled = true }: LapListProps) {
  const rows = buildRows(laps);
  const showExtremes = laps.length >= MIN_LAPS_FOR_EXTREMES;
  const fastest = showExtremes ? Math.min(...laps) : null;
  const slowest = showExtremes ? Math.max(...laps) : null;

  return (
    <FlatList
      data={rows}
      scrollEnabled={scrollEnabled}
      keyExtractor={(row) => String(row.index)}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="px-6 pb-8"
      ListHeaderComponent={
        <View className="flex-row border-b border-line pb-2 dark:border-line-dark">
          <Text className="flex-1 text-xs uppercase tracking-wider text-muted dark:text-muted-dark">
            Lap
          </Text>
          <Text className="w-28 text-right text-xs uppercase tracking-wider text-muted dark:text-muted-dark">
            Split
          </Text>
          <Text className="w-28 text-right text-xs uppercase tracking-wider text-muted dark:text-muted-dark">
            Total
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const isFastest = fastest !== null && item.split === fastest;
        const isSlowest = slowest !== null && item.split === slowest && !isFastest;

        return (
          <View
            accessibilityLabel={`Lap ${item.index}, split ${formatDuration(item.split)}`}
            className="flex-row items-center border-b border-line/60 py-3 dark:border-line-dark/60">
            <View className="flex-1 flex-row items-center gap-2">
              <Text className="text-[15px] text-ink dark:text-ink-dark">{item.index}</Text>
              {isFastest ? <Tag label="Fastest" /> : null}
              {isSlowest ? <Tag label="Slowest" /> : null}
            </View>

            <Text
              style={{ fontFamily: monoFont }}
              className={cn(
                'w-28 text-right text-[15px]',
                isFastest
                  ? 'text-accent dark:text-accent-dark'
                  : isSlowest
                    ? 'text-danger dark:text-danger-dark'
                    : 'text-ink dark:text-ink-dark'
              )}>
              {formatDuration(item.split)}
            </Text>

            <Text
              style={{ fontFamily: monoFont }}
              className="w-28 text-right text-[15px] text-muted dark:text-muted-dark">
              {formatDuration(item.total)}
            </Text>
          </View>
        );
      }}
    />
  );
}

const Tag = ({ label }: { label: string }) => (
  <Text className="text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark">
    {label}
  </Text>
);
