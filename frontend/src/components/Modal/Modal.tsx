import { FC, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { Button } from '../Button'
import styles from './Modal.module.scss'

export interface ModalProps {
  /** �Ƿ���ʾ */
  visible: boolean
  /** ���� */
  title?: string
  /** ���� */
  content?: ReactNode
  /** ȷ�ϰ�ť�ı� */
  okText?: string
  /** ȡ����ť�ı� */
  cancelText?: string
  /** ȷ���¼� */
  onOk?: () => void
  /** ȡ���¼� */
  onCancel?: () => void
  /** �Ƿ���ʾȡ����ť */
  showCancel?: boolean
  /** ȷ�ϰ�ť�Ƿ������ */
  confirmLoading?: boolean
  /** �Զ���className */
  className?: string
  /** ��Ԫ�����ݣ�����content�� */
  children?: ReactNode
}

const Modal: FC<ModalProps> = ({
  visible,
  title,
  content,
  okText = 'ȷ��',
  cancelText = 'ȡ��',
  onOk,
  onCancel,
  showCancel = true,
  confirmLoading = false,
  className = '',
  children,
}) => {
  if (!visible) return null

  const handleOk = () => {
    onOk?.()
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <View className={`${styles['modal-overlay']} ${className}`.trim()}>
      <View className={styles['modal-container']}>
        {title && (
          <View className={styles['modal-header']}>
            <Text className={styles['modal-title']}>
              {title}
            </Text>
          </View>
        )}

        <View className={styles['modal-body']}>
          {children || content}
        </View>

        <View className={styles['modal-footer']}>
          {showCancel && (
            <Button
              type="tertiary"
              size="md"
              onClick={handleCancel}
              disabled={confirmLoading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="primary"
            size="md"
            onClick={handleOk}
            loading={confirmLoading}
          >
            {okText}
          </Button>
        </View>
      </View>
    </View>
  )
}

export default Modal
