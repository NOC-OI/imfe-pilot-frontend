import React from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './FlashMessages.module.css'
import classnames from 'classnames'

interface FlashMessagesProps {
  message: any
  width: any
  type: any
  duration: any
  position: any
  active: any
  setActive: any
}

export function FlashMessages({
  message,
  width,
  type,
  duration,
  position,
  active,
  setActive,
}: FlashMessagesProps) {
  const ToastClassNames = {
    [styles.error]: type === 'error',
    [styles.warning]: type === 'warning',
    [styles.success]: type === 'success',
    [styles.bleft]: position === 'bleft',
    [styles.bright]: position === 'bright',
    [styles.tright]: position === 'tright',
    [styles.tleft]: position === 'tleft',
    [styles.tcenter]: position === 'tcenter',
    [styles.bcenter]: position === 'bcenter',
    [styles.bcenter]: position === 'bcenter',
    [styles.fullWidth]: width === 'full',
    [styles.smallWidth]: width === 'small',
    [styles.mediumWidth]: width === 'medium',
    [styles.largeWidth]: width === 'large',
  }

  setTimeout(() => {
    setActive(false)
  }, duration)

  return (
    <CSSTransition
      in={active}
      timeout={duration}
      classNames="toast"
      unmountOnExit
      onExit={() => setActive((state: any) => !state)}
    >
      <div
        id="flash-message"
        className={classnames(styles.toast, ToastClassNames)}
      >
        <div className={styles.toastMessage}>{message}</div>
        <button
          className={styles.toastDismiss}
          onClick={() => setActive((state: any) => !state)}
        >
          &#10005;
        </button>
      </div>
    </CSSTransition>
  )
}
