/**
 * TODO
 * 2 下拉的动画补充
 */

import React, { FC, useEffect, useState, useRef, ReactNode } from 'react';
import TreeItem from './treeItem';
import { flattenTreeData, arrAdd, arrDel, getTreeNodeProps, getTreeNodeLevel, conductCheck } from './util';
import { EventDataNode, FlattenNode, TreeItemProps, EntityNode } from './type';
import { ScrollView } from 'react-native';
export interface TreeProps {
  /** 组件的高度 */
  height?: number;
  /** 树的节点数据 */
  treeData?: TreeItemProps[];
  /** 禁用整棵树 */
  disabled?: boolean;
  /** 是否可以选择的 */
  checkable?: boolean;
  /** 选中的节点受控的  */
  checkedKeys?: string[] | [];
  /** checkable 状态下节点选择完全受控（父子节点选中状态不再关联） */
  checkStrictly?: boolean;
  /** 默认选中的key第一次加载有效 */
  defaultCheckedKeys?: string[];
  /** 默认全部展开 */
  defaultExpandAll?: boolean;
  /** 默认展开节点 */
  defaultExpandedKeys?: string[];
  /** 展开的节点 */
  expandedKeys?: string[];
  /**是否显示尾部的图标 */
  switcherIcon?: boolean;
  /** 选中事件回调 */
  onCheck?: (keys: string[]) => void;
  /** 展开事件回调 */
  onExpand?: (treeNode: EventDataNode) => void;
  /** 自定义icon */
  icon?: (checked: boolean) => ReactNode;
}

const Tree: FC<TreeProps> = props => {
  const {
    height,
    treeData = [],
    disabled = false,
    onExpand,
    onCheck,
    checkable = true,
    checkStrictly = false,
    defaultCheckedKeys = [],
    defaultExpandAll = false,
    defaultExpandedKeys = [],
    switcherIcon = true,
    icon,
  } = props;

  const defaultProps = useRef<Partial<TreeProps>>();

  const [flattenNodes, setFlattenNodes] = useState<Array<FlattenNode>>([]);

  const [expandedKeys, setExpandedKeys] = useState<Array<string>>(defaultExpandedKeys);
  const [checkedKeys, setCheckedKeys] = useState<Array<string>>(defaultCheckedKeys);
  const [keyEntities, setKeyEntities] = useState<Record<string, EntityNode>>();

  /**
   * 只更新props中没有的值使,其可以受控也可以不受控
   */
  const setUncontrolledState = <T extends unknown>(name: keyof TreeProps, state: T, callback: (state: T) => void) => {
    if (!props[name]) {
      callback(state);
    }
  };

  /** 根据展开的数据渲染视图 */
  useEffect(() => {
    const data = flattenTreeData(treeData, expandedKeys);
    setFlattenNodes(data);
  }, [treeData, expandedKeys]);

  /**
   * 获取节点实体类
   * 判断是否默认展开所有
   */
  useEffect(() => {
    const keyEntities = getTreeNodeLevel(treeData);
    if (defaultProps?.current?.defaultExpandAll === undefined && defaultExpandAll) {
      const expandedKeys = Object.keys(keyEntities);
      setExpandedKeys(expandedKeys);
    }
    defaultProps.current = {
      defaultExpandAll: defaultExpandAll,
    };
    setKeyEntities(keyEntities);
  }, [defaultExpandAll, treeData]);

  /**
   * 展开节点受控
   */
  useEffect(() => {
    if (props.expandedKeys) {
      setExpandedKeys(props.expandedKeys);
    }
  }, [props.expandedKeys]);

  /**
   * 节点选中受控
   */
  useEffect(() => {
    if (props.checkedKeys) {
      setCheckedKeys(props.checkedKeys);
    }
  }, [props.checkedKeys]);

  /**更新展开的值*/
  const updataExpandedKeys = (keyArr: string[]) => {
    setExpandedKeys(keyArr);
  };
  /**
   * 节点展开,回调上层的onExpand事件
   */
  const onNodeExpand = (treeNode: EventDataNode) => {
    const { key, expanded } = treeNode;

    let arrKeys = [];

    const targetExpanded = !expanded;

    if (targetExpanded) {
      arrKeys = arrAdd(expandedKeys, key);
    } else {
      arrKeys = arrDel(expandedKeys, key);
    }
    updataExpandedKeys(arrKeys);
    onExpand?.(treeNode);
  };

  const handlerClick = (treeNode: EventDataNode) => {
    onNodeExpand(treeNode);
  };

  /**
   *
   * @param treeNode
   * 选中处理
   */
  const handlerCheck = (treeNode: EventDataNode) => {
    const { key, checked } = treeNode;

    let arrKeys: string[] = [];
    const targetChecked = !checked;

    //判断是否需要关联父子节点
    if (checkStrictly) {
      if (targetChecked) {
        arrKeys = arrAdd(checkedKeys, key);
      } else {
        arrKeys = arrDel(checkedKeys, key);
      }
    } else {
      arrKeys = conductCheck([...checkedKeys, key], keyEntities || {}, true);

      if (checked) {
        const keySet = new Set(checkedKeys);
        keySet.delete(key);
        arrKeys = conductCheck(Array.from(keySet), keyEntities || {}, { checked: false });
      }
    }

    onCheck?.(arrKeys);
    setUncontrolledState('checkedKeys', arrKeys, setCheckedKeys);
  };

  const treeRender = (item: FlattenNode) => {
    const treeNodeProps = getTreeNodeProps(item.key, {
      expandedKeys,
      checkedKeys: checkedKeys,
    });
    const level = keyEntities?.[item.key].level;
    const itemIcon = keyEntities?.[item.key].data.icon || icon;
    return (
      <TreeItem
        icon={itemIcon}
        checkable={checkable}
        disabled={disabled}
        {...treeNodeProps}
        {...item}
        switcherIcon={switcherIcon}
        onClick={handlerClick}
        onCheck={handlerCheck}
        level={!!level || level == 0 ? level : 1}
      />
    );
  };
  const containerStyle = height ? { height: height } : { flex: 1 };
  return <ScrollView style={containerStyle}>{flattenNodes.map(item => treeRender(item))}</ScrollView>;
};

export default React.memo(Tree);
