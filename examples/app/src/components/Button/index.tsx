import type { CSSProperties, FC, MouseEvent, PropsWithChildren, ReactElement } from 'react'
import React from 'react'

export type ButtonProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  endIcon?: ReactElement;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  startIcon?: ReactElement;
  style?: CSSProperties;
  tabIndex?: number;
}>

export const Button: FC<ButtonProps> = (props) => {
  const classNames = [
    'wallet-adapter-button',
    'bg-gradient-btn',
    'text-sm',
    'px-4 py-2',
    'h-[36px]',
    'rounded-[100px]',
    props.className,
  ]
  return (
    <button
      className={classNames.join(' ')}
      disabled={props.disabled}
      style={props.style}
      onClick={props.onClick}
      tabIndex={props.tabIndex || 0}
      type="button"
    >
      {props.startIcon && <i className="wallet-adapter-button-start-icon w-[20px] h-[20px] mr-2">{props.startIcon}</i>}
      {props.children}
      {props.endIcon && <i className="wallet-adapter-button-end-icon w-[20px] h-[20px]">{props.endIcon}</i>}
    </button>
  )
}
