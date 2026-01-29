import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import './index.scss';

interface VirtualListFixedProps<T> {
    items: T[]; // 列表数据,类型为泛型数组
    height: number; // 列表容器高度,单位为像素
    itemHeight: number; // 列表项高度,单位为像素
    overscan: number; // 预渲染数量,单位为项数
    renderItem: (item: T, index: number) => React.ReactNode; // 渲染列表项的函数,接收列表项数据和索引作为参数,返回渲染后的React节点
    className?: string; // 列表容器类名,可选
    itemClassName?: string; // 列表项类名,可选
}

/**
 * 虚拟滚动列表组件实现
 * 
 * @remarks
 * 核心实现原理：
 * 1. 只渲染可视区域内的元素
 * 2. 使用 padding 模拟列表总高度
 * 3. 动态计算元素位置
 */

function VirtualListFixed<T>(props: VirtualListFixedProps<T>) {
    const {
        items,
        height,
        itemHeight,
        overscan,
        renderItem,
        className = '',
        itemClassName = '',
    } = props;

    // 容器引用，用于获取滚动位置和容器高度
    const containerRef = React.useRef<HTMLDivElement>(null);
    // 滚动位置状态
    const [scrollTop, setScrollTop] = useState<number>(0);
    // 容器高度状态
    const [containerHeight, setContainerHeight] = useState<number>(height);
     /**
     * 计算可见元素范围
     * 
     * @remarks
     * 使用 useMemo 缓存计算结果，减少滚动时的计算开销
     * 依赖项：scrollTop, containerHeight, itemHeight, items.length, overscan
     */
    const visibleRange: { startIndex: number; endIndex: number } = useMemo(() => {
        // 起始索引计算：
        // 1. scrollTop / itemHeight: 计算当前滚动位置对应的元素索引（可能是小数）
        // 2. Math.floor(): 向下取整，得到当前可见区域顶部的元素索引
        // 3. - overscan: 减去预渲染数量，提前渲染上方的元素，避免滚动时白屏
        // 4. Math.max(0, ...): 确保索引不小于 0，避免负数索引
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        
        // 结束索引计算：
        // 1. scrollTop + containerHeight: 计算可见区域底部的滚动位置
        // 2. / itemHeight: 计算该位置对应的元素索引（可能是小数）
        // 3. Math.ceil(): 向上取整，得到可见区域底部的元素索引
        // 4. + overscan: 加上预渲染数量，提前渲染下方的元素
        // 5. Math.min(items.length, ...): 确保索引不超过数组长度，避免越界
        const endIndex = Math.min(
            items.length, 
            Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
        );
        
        return { startIndex, endIndex };
    }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);

    // 计算顶部和底部 padding
    const paddingTop: number = visibleRange.startIndex * itemHeight;
    // 修正：paddingBottom 应该是 (总项数 - 结束索引) * 每项高度
    // 当结束索引等于总项数时，paddingBottom 为 0
    const paddingBottom: number = Math.max(0, (items.length - visibleRange.endIndex) * itemHeight);
    // 节流函数引用
    const rafRef = useRef<number | null>(null);

    /**
     * 处理滚动事件
     * 
     * @remarks
     * 使用 requestAnimationFrame 节流，避免滚动时频繁更新状态
     * 提升滚动性能，减少卡顿
     */
    const handleScroll: () => void = useCallback(() => {
        // 1. 取消之前的动画帧：
        // 如果存在未执行的动画帧回调，取消它
        // 避免在滚动过程中积累多个未执行的回调，确保只有最近的一次滚动事件会被处理
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
        }
        
        // 2. 请求新的动画帧：
        // 将回调函数推迟到下一次浏览器重绘之前执行
        // 浏览器通常以 60fps 的频率重绘，这样可以限制滚动事件的处理频率
        // 避免过度计算，提高滚动流畅度
        rafRef.current = requestAnimationFrame(() => {
            try {
                // 3. 获取并更新滚动位置：
                // 检查容器引用是否存在，然后获取当前滚动位置
                // 更新 scrollTop 状态，这会触发可见范围的重新计算
                if (containerRef.current) {
                    setScrollTop(containerRef.current.scrollTop);
                }
            } catch (error) {
                // 4. 错误处理：
                // 捕获并记录可能的错误，提高代码的容错能力
                console.error('Error handling scroll:', error);
            } finally {
                // 5. 重置动画帧引用：
                // 无论如何都会重置 rafRef.current 为 null
                // 确保下次滚动事件可以正确处理
                rafRef.current = null;
            }
        });
    }, []);

    /***
     * 监听容器大小变化
     * 
     * @remarks
     * 使用 ResizeObserver API 监听容器大小变化，
     * 支持动态调整容器高度，增强组件的灵活性
     */
    useEffect(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current.clientHeight);
        }
        const resizeObserver = new ResizeObserver((entries) => {
            if(entries[0]) {
                setContainerHeight(entries[0].contentRect.height);
            }
        });
        if(containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => {
            if(containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
       
    }, []); // 依赖项为空数组，只在组件挂载时执行一次

    /**
     * 组件卸载时清理
     * 
     * @remarks
     * 取消未执行的 requestAnimationFrame，避免内存泄漏
     */
    useEffect(() => {
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return (
        // 滚动容器
        <div
            ref={containerRef}
            className={`virtual-list-fixed ${className}`}
            onScroll={handleScroll}
            style={{
                height: `${height}px`,
                overflowY: 'auto',
                position: 'relative',
                willChange: 'transform',
            }}
        >
            {/* 内容容器 */}
            <div
                className="virtual-list-fixed-content"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    paddingTop: `${paddingTop}px`,
                    paddingBottom: `${paddingBottom}px`,
                }}
            >
                {/* 渲染可见元素 */}
                {items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => {
                    // 计算实际索引
                    const itemIndex: number = visibleRange.startIndex + index;
                    // 渲染列表项
                    return (
                        <div
                            key={itemIndex} 
                            className={`virtual-list-fixed-item ${itemClassName}`}
                            style={{
                                position: 'absolute',
                                top: `${itemIndex * itemHeight}px`,
                                left: 0,
                                width: '100%',
                                height: `${itemHeight}px`,
                                boxSizing: 'border-box',
                                overflow: 'hidden',
                            }}
                        >
                            {renderItem(item, itemIndex)}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export type {VirtualListFixedProps};
export default VirtualListFixed;