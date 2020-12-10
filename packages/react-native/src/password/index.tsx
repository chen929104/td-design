import React, { FC, useState } from 'react';
import Flex from '../flex';
import Box from '../box';
import NumberKeyboard from '../number-keyboard';
import { TouchableOpacity } from 'react-native';
import { px } from '../helper';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../config/theme';
import Modal from '../modal';
import Icon from '../icon';
import PasswordModal, { PasswordModalProps } from './PasswordModal';
import Portal from '../portal';

interface PasswordProps {
  /** 密码框长度 */
  length?: number;
  /** 完成事件 */
  onDone?: (password: string) => void;
  /** 是否清除 */
  clean?: boolean;
  /** 密码改变 */
  onChange?: (password: string) => void;
}

export interface PasswordInputRef {
  show: () => void;
  hide: () => void;
  clearPassWord: () => void;
}

const Password: FC<PasswordProps> = React.forwardRef(
  ({ length = 6, onDone, clean = true, onChange }, ref: React.Ref<PasswordInputRef>) => {
    const theme = useTheme<Theme>();
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);

    /** 显示键盘 */
    const show = () => {
      if (clean) {
        setPassword('');
      }
      setVisible(true);
    };
    /** 隐藏键盘 */
    const hide = () => {
      setVisible(false);
    };

    /** 键盘删除事件 */
    const handleDelete = () => {
      const nextPassword = password.substring(0, password.length - 1);
      setPassword(nextPassword);
      onChange?.(nextPassword);
    };

    /** 按键 */
    const combineText = (text: string | number) => {
      const len = length;

      const nextPassword = password + text;
      if (nextPassword.length <= len) {
        setPassword(nextPassword);
        onChange?.(nextPassword);
        if (nextPassword.length === len) {
          onDone?.(nextPassword);
          hide();
        }
      }
    };

    /** 键盘提交事件 */
    const handleSubmit = () => {
      onDone?.(password);
      hide();
    };

    /** 清除密码 */
    const clearPassWord = () => {
      setPassword('');
    };
    React.useImperativeHandle(ref, () => {
      return {
        show: show,
        hide: hide,
        clearPassWord: clearPassWord,
      };
    });

    /** 密码框的render */
    const passwordItems: React.ReactNode[] = [];
    for (let i = 0; i < length; i++) {
      let borderRightWidth = px(1);
      if (i === length - 1) {
        borderRightWidth = 0;
      }
      passwordItems.push(
        <Box
          key={i}
          flex={1}
          height={px(48)}
          justifyContent="center"
          alignItems="center"
          borderRightWidth={borderRightWidth}
          borderColor="borderColor"
        >
          <Box
            width={px(10)}
            height={px(10)}
            borderRadius="roundedButton"
            backgroundColor="primaryTextColor"
            opacity={password.length > i ? 1 : 0}
          />
        </Box>
      );
    }

    return (
      <Box>
        <TouchableOpacity onPress={show}>
          <Flex borderWidth={px(1)} borderColor="borderColor" borderRadius="defaultButton">
            {passwordItems}
          </Flex>
        </TouchableOpacity>
        <Modal visible={visible} maskClosable={true} position="bottom" onClose={() => setVisible(false)}>
          <Flex justifyContent="center" alignItems="center" height={px(48)}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Icon name="down" color={theme.colors.keyboardIconColor} />
            </TouchableOpacity>
          </Flex>
          <NumberKeyboard onPress={combineText} onDelete={handleDelete} onSubmit={handleSubmit} />
        </Modal>
      </Box>
    );
  }
);

function modal(props: PasswordModalProps) {
  const key = Portal.add(<PasswordModal {...props} afterClose={() => Portal.remove(key)} />);

  return key;
}

export default Object.assign(Password, {
  modal,
});
