import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.scss';

interface VirtualListHooksProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  overscan: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
}

function TraditionalVirtualListHooks<T>(props: VirtualListHooksProps<T>) {
    const {
        items,
        height,
        itemHeight,
        overscan,
        renderItem,
        className = '',
        itemClassName = '',
    } = props;
    // 滚动容器引用
    const containerRef = useRef<HTMLDivElement>(null);
    // 状态
    const [scrollTop, setScrollTop] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(height);
    // 可见范围
    const [visibleRange, setVisibleRange] = useState({
        startIndex: 0,
        endIndex: 0,
    });

    // 用于节流的状态
    const lastScrollTopRef = useRef<number>(0);
    const throttleDelay = 16; // 节流延迟时间（毫秒）

    //计算可见范围
    const updateVisibleRange = useCallback(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);
        console.log('startIndex', startIndex, 'endIndex', endIndex);
        setVisibleRange({ startIndex, endIndex });
    }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

    // 滚动事件处理（节流）
    const handleScroll: () => void = useCallback(() => {
        const now = Date.now ? Date.now() : new Date().getTime();
        if (now - lastScrollTopRef.current >= throttleDelay) {
            lastScrollTopRef.current = now;
            if (containerRef.current) {
                console.log('scrollTop', containerRef.current?.scrollTop);
                const currentScrollTop = containerRef.current.scrollTop;
                if (currentScrollTop !== scrollTop) {
                    setScrollTop(currentScrollTop);
                }
            }
        }
    }, [scrollTop]);

    // 窗口大小变化处理
    const handleResize: () => void = useCallback(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current?.offsetHeight);
        }
    }, []);

    // 计算顶部和底部 padding
    const paddingTop = visibleRange.startIndex * itemHeight;
    const paddingBottom = Math.max(0, (items.length - visibleRange.endIndex) * itemHeight);

    // 滚动事件监听
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
            // 窗口大小变化事件
            window.addEventListener('resize', handleResize);
            // 初始计算容器高度
            setContainerHeight(containerRef.current?.offsetHeight);
            return () => {
                containerRef.current?.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleResize);
            }
        }

    }, [handleScroll, handleResize]);
       

    // 当滚动容器高度变化时，更新可见范围
    useEffect(() => {
        updateVisibleRange();
    }, [scrollTop, containerHeight, updateVisibleRange]);

    return (
        // 滚动容器
        <div
            ref={containerRef}
            className={`virtual-list-hooks ${className}`}
            style={{
                height: `${height}px`,
                overflowY: 'auto',
                position: 'relative',
                // willChange: 'transform',
            }}
        >
            {/* 内容容器 */}
            <div
                className="virtual-list-hooks-content"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    paddingTop: `${paddingTop}px`,
                    paddingBottom: `${paddingBottom}px`,
                }}
            >
                {/* 渲染可见元素 */}
                <div
                    className="virtual-list-hooks-visible"
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        transform: `translateY(${paddingTop}px)`,
                    }}
                >
                    {items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => {
                        // 计算实际索引
                        const itemIndex: number = visibleRange.startIndex + index;
                        // 渲染列表项
                        return (
                            <div
                                key={itemIndex} 
                                className={`virtual-list-hooks-item ${itemClassName}`}
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: `${itemHeight}px`,
                                    boxSizing: 'border-box',
                                }}
                            >
                                {renderItem(item, itemIndex)}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default TraditionalVirtualListHooks;
