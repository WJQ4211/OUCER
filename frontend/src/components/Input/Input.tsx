import { FC, useState } from 'react'
import { Input as TaroInput, View, Text } from '@tarojs/components'
import styles from './Input.module.scss'

export type InputType = 'text' | 'password' | 'number' | 'email' | 'tel'

export interface InputProps {
  /** ��������� */
  type?: InputType
  /** �����ֵ */
  value?: string
  /** ռλ�� */
  placeholder?: string
  /** �Ƿ���� */
  disabled?: boolean
  /** �Ƿ�ֻ�� */
  readOnly?: boolean
  /** ��󳤶� */
  maxLength?: number
  /** ��ǩ�ı� */
  label?: string
  /** ������Ϣ */
  error?: string
  /** �Ƿ���ʾ�����ʶ */
  required?: boolean
  /** �����¼� */
  onChange?: (value: string) => void
  /** ʧ���¼� */
  onBlur?: () => void
  /** �۽��¼� */
  onFocus?: () => void
  /** �Զ���className */
  className?: string
  /** ǰ��ͼ�� */
  prefix?: string
  /** ���ð�ť */
  suffix?: string
}

const Input: FC<InputProps> = ({
  type = 'text',
  value = '',
  placeholder = '',
  disabled = false,
  readOnly = false,
  maxLength,
  label,
  error,
  required,
  onChange,
  onBlur,
  onFocus,
  className = '',
  prefix,
  suffix,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: any) => {
    onChange?.(e.detail.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const wrapperClass = `
    ${styles['input-wrapper']}
    ${error ? styles['input-error'] : ''}
    ${className}
  `.trim()

  const containerClass = `
    ${styles['input-container']}
    ${isFocused ? styles['input-focused'] : ''}
    ${disabled ? styles['input-disabled'] : ''}
  `.trim()

  return (
    <View className={wrapperClass}>
      {label && (
        <Text className={styles['input-label']}>
          {label}
          {required && <Text className={styles['input-required']}>*</Text>}
        </Text>
      )}

      <View className={containerClass}>
        {prefix && <Text className={styles['input-prefix']}>{prefix}</Text>}

        <TaroInput
          // @ts-ignore Taro Input type supports these values at runtime
          type={type === 'password' ? 'text' : type}
          password={type === 'password' ? true : false}
          value={value}
          placeholder={placeholder}
          disabled={disabled || readOnly}
          maxlength={maxLength && maxLength > 0 ? maxLength : 9999}
          onInput={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={styles['input-field']}
        />

        {suffix && <Text className={styles['input-suffix']}>{suffix}</Text>}
      </View>

      {error && (
        <Text className={styles['input-error-text']}>
          {error}
        </Text>
      )}
    </View>
  )
}

export default Input
