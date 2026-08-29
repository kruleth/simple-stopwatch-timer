import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

type ScreenProps = {
  title: string;
  /** Optional control rendered opposite the title, e.g. a "Clear" button. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Shared page frame: safe-area padding, canvas colour, and a plain text title.
 *
 * The tab navigator's own header is switched off in favour of this so every
 * screen shares one layout and the type scale stays consistent.
 */
export function Screen({ title, action, children, className }: ScreenProps) {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas dark:bg-canvas-dark">
      <View className="flex-row items-center justify-between px-6 pb-4 pt-3">
        <Text
          accessibilityRole="header"
          className="text-[28px] font-semibold tracking-tight text-ink dark:text-ink-dark">
          {title}
        </Text>
        {action}
      </View>

      <View className={cn('flex-1', className)}>{children}</View>
    </SafeAreaView>
  );
}
