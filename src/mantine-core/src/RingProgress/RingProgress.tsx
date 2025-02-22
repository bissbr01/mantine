import React, { forwardRef } from 'react';
import { DefaultProps, MantineColor, Selectors, useComponentDefaultProps } from '@mantine/styles';
import { Box } from '../Box';
import { Curve } from './Curve/Curve';
import { getCurves } from './get-curves/get-curves';
import useStyles from './RingProgress.styles';

export type RingProgressStylesNames = Selectors<typeof useStyles>;

interface RingProgressSection extends React.ComponentPropsWithRef<'circle'> {
  value: number;
  color: MantineColor;
  tooltip?: React.ReactNode;
}

export interface RingProgressProps
  extends DefaultProps<RingProgressStylesNames>,
    React.ComponentPropsWithoutRef<'div'> {
  /** Label displayed in the center of the ring */
  label?: React.ReactNode;

  /** Ring thickness */
  thickness?: number;

  /** Width and height of the progress ring in px */
  size?: number;

  /** Sets whether the edges of the progress circle are rounded */
  roundCaps?: boolean;

  /** Ring sections */
  sections: RingProgressSection[];
}

const defaultProps: Partial<RingProgressProps> = {
  size: 120,
  thickness: 12,
};

export const RingProgress = forwardRef<HTMLDivElement, RingProgressProps>((props, ref) => {
  const {
    className,
    style,
    label,
    sections,
    size,
    thickness,
    classNames,
    styles,
    roundCaps,
    unstyled,
    ...others
  } = useComponentDefaultProps('RingProgress', defaultProps, props);

  const { classes, cx } = useStyles(null, { classNames, styles, unstyled, name: 'RingProgress' });

  const curves = getCurves({
    size,
    thickness,
    sections,
    renderRoundedLineCaps: roundCaps,
  }).map(({ data, sum, root, lineRoundCaps, offset }, index) => (
    <Curve
      {...data}
      key={index}
      value={data?.value}
      size={size}
      thickness={thickness}
      sum={sum}
      offset={offset}
      color={data?.color}
      root={root}
      lineRoundCaps={lineRoundCaps}
      tooltip={data?.tooltip}
    />
  ));

  return (
    <Box
      style={{ width: size, height: size, ...style }}
      className={cx(classes.root, className)}
      ref={ref}
      {...others}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {curves}
      </svg>

      {label && (
        <div className={classes.label} style={{ right: thickness * 2, left: thickness * 2 }}>
          {label}
        </div>
      )}
    </Box>
  );
});

RingProgress.displayName = '@mantine/core/RingProgress';
