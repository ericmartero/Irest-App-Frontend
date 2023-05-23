import React, { useEffect, useRef, useState } from 'react';
import { ORDER_STATUS } from '../../../utils/constants';
import { useParams, useHistory } from 'react-router-dom';
import { Header } from '../../../components/Client';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { map, size } from "lodash";
import moment from 'moment';
import 'moment/locale/es';
import '../../../scss/AlignComponent.scss';
import './OrdersTracking.scss';

export function OrdersTracking(props) {

    const { table, orders, onRefreshOrders, loadingOrders, payment } = props;

    const intervalRef = useRef();
    const paramsURL = useParams();
    const history = useHistory();

    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

    useEffect(() => {
        const autoRefreshTables = () => {
            onRefreshOrders();
        }

        if (autoRefreshEnabled) {
            intervalRef.current = setInterval(autoRefreshTables, 10000);
        }

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [onRefreshOrders, autoRefreshEnabled]);

    const getSeverity = (order) => {
        switch (order.status) {
            case ORDER_STATUS.DELIVERED:
                return 'success';

            case ORDER_STATUS.PENDING:
                return 'warning';

            case ORDER_STATUS.PREPARED:
                return 'warning';

            default:
                return null;
        }
    };

    const goBack = () => {
        history.push(`/client/table=${paramsURL.idTable}`);
    };

    return (
        <div className="card">
            {loadingOrders ?
                <div className="align-content-mobile">
                    <ProgressSpinner />
                </div>
                :
                <Header
                    name="Pedidos mesa"
                    isMain={false}
                    isOrderTracking={true}
                    goBack={goBack}
                    orders={orders}
                    table={table}
                    onRefreshOrders={onRefreshOrders}
                    payment={payment}
                    setAutoRefreshEnabled={setAutoRefreshEnabled}
                />
            }
            <>
                {size(orders) === 0 ?
                    <div className='noOrders-container'>
                        <div className='noOrder_container'>
                            <p>No hay pedidos actualmente</p>
                        </div>
                    </div>
                    :
                    <div className='orders-container'>
                        <div
                            className={classNames({
                                "orders-payment-tracking-container": payment,
                            })}
                        >
                            {map(orders, (order) => (
                                <div key={order.id} className='order_container'>
                                    <div className='content_order'>
                                        <img className="w-4 sm:w-8rem xl:w-8rem block xl:block border-round" src={order.product.image} alt={order.product.title} />
                                        <div className='content_order_info'>
                                            <span className="font-bold text-900">{order.product.title}</span>
                                            <span>{moment(order.createdAt).format('HH:mm')}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <Tag value={order.status === ORDER_STATUS.PENDING ? 'PENDIENTE'
                                            : order.status === ORDER_STATUS.DELIVERED ? 'ENTREGADO' : 'PREPARADO'}
                                            severity={getSeverity(order)}
                                        ></Tag>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </>
        </div>
    )
}
