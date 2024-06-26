import React, {useEffect, useRef} from "react";
import {FixedSizeList as List} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import {Scrollbars} from "react-custom-scrollbars";

export default function UsersVirtualizedList({hasNextPage, isNextPageLoading, items, loadNextPage, isSearching}) {
    const infiniteLoaderRef = useRef(null);
    const hasMountedRef = useRef(false);

    const itemCount = hasNextPage ? items.length + 1 : items.length;

    const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

    const isItemLoaded = index => !hasNextPage || index < items.length;

    const Item = ({ index, style }) => {
        let content;
        if (!isItemLoaded(index)) {
            content =
                <>
                    <div>
                        <div
                            className='mb-3 ps-3 d-flex align-items-center justify-content-between'
                            style={{backgroundColor: '#fff', height: '48px'}}>
                            <p className='m-0' style={{color:"#000"}}>Loading...</p>
                        </div>
                    </div>
                </>
        } else {
            content =
                <>
                    <a key={items[index].id} href={'user/'+items[index].id} className="w-100" style={{display: "contents"}}>
                        <div
                            className="d-flex p-0 flex-column"
                            style={{color: "white"}}
                        >
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <p className='m-0 p-3'>{items[index].id}</p>
                                    <p className='m-0 p-3'>{items[index].username}</p>
                                </div>
                                <p className='m-0 p-3'>{items[index].role}</p>
                            </div>
                            <span className="align-self-center" style={{backgroundColor: "#757575", height:"1px", width: "100%"}}/>
                        </div>
                    </a>
                </>

        }

        return <div style={style}>{content}</div>;
    };

    useEffect(() => {
        if (hasMountedRef.current) {
            if (infiniteLoaderRef.current) {
                infiniteLoaderRef.current.resetloadMoreItemsCache();
            }
        }
        hasMountedRef.current = true;
    }, [isSearching]);

    return (
        <AutoSizer>
            {({ height, width }) => (
                <InfiniteLoader
                    ref={infiniteLoaderRef}
                    isItemLoaded={isItemLoaded}
                    itemCount={itemCount}
                    loadMoreItems={loadMoreItems}
                >
                    {({ onItemsRendered, ref }) => (
                        <List
                            className="List"
                            outerElementType={Scrollbars}
                            style={{overflow: 'hidden'}}
                            height={height}
                            itemCount={itemCount}
                            itemSize={60}
                            onItemsRendered={onItemsRendered}
                            ref={ref}
                            width={width}
                        >
                            {Item}
                        </List>
                    )}
                </InfiniteLoader>
            )}
        </AutoSizer>
    );
}
