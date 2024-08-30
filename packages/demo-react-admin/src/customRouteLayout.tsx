import * as React from 'react';
import {
    useGetList,
    Datagrid,
    TextField,
    Title,
    ResourceContextProvider,
} from 'react-admin';
import type { SortPayload } from 'react-admin';

const sort = { field: 'published_at', order: 'DESC' } as SortPayload;

const CustomRouteLayout = ({ title = 'Posts', children }) => {
    // useAuthenticated();

    const { data, total, isLoading } = useGetList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort,
    });

    return !isLoading ? (
        <div>
            <Title title="Example Admin" />
            <h1>{title}</h1>
            <p>
                Found <span className="total">{total}</span> posts !
            </p>
            <ResourceContextProvider value="posts">
                <Datagrid
                    sort={sort}
                    data={data}
                    isLoading={isLoading}
                    total={total}
                    rowClick="edit"
                    bulkActionButtons={false}
                >
                    <TextField source="id" sortable={false} />
                    <TextField source="title" sortable={false} />
                </Datagrid>
            </ResourceContextProvider>
            {children ?? null}
        </div>
    ) : null;
};

export default CustomRouteLayout;
