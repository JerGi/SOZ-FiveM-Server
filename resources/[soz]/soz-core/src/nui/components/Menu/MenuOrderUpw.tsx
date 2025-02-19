import { fetchNui } from '@public/nui/fetch';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { UpwConfig, UpwOrder, UpwOrderMenuData } from '@public/shared/job/upw';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent, useState } from 'react';

import { TaxType } from '../../../shared/bank';
import { useGetPrice } from '../../hook/price';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type UpwOrderMenuProps = {
    data?: UpwOrderMenuData;
};

export const UpwOrderMenu: FunctionComponent<UpwOrderMenuProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_upw';
    const [orders, setOrders] = useState<UpwOrder[]>([]);
    const getPrice = useGetPrice();

    useNuiEvent('upw_order_menu', 'SetOrders', (orders: UpwOrder[]) => {
        setOrders(orders);
    });

    useState(() => {
        fetchNui(NuiEvent.UpwGetOrders).then();
    });

    const sortedCatalog = Object.values(data.catalog).sort((a, b) => a.model.localeCompare(b.model));

    return (
        <Menu type={MenuType.UpwOrderMenu}>
            <MainMenu>
                <MenuTitle banner={banner}>Gestion des commandes</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="order">➕ Commander un véhicule</MenuItemSubMenuLink>
                    {orders
                        .sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())
                        .map(order => {
                            const remainingMinutes = Math.floor(
                                (new Date(order.orderDate).getTime() +
                                    1000 * 60 * UpwConfig.Order.waitingTime -
                                    Date.now()) /
                                    1000 /
                                    60
                            );
                            return (
                                <MenuItemButton
                                    onConfirm={async () => {
                                        await fetchNui(NuiEvent.UpwCancelOrder, order.uuid);
                                    }}
                                    key={order.uuid}
                                >
                                    {remainingMinutes > 0 && (
                                        <span>❌ {order.model.toUpperCase() + ' - ' + remainingMinutes} minutes</span>
                                    )}
                                    {remainingMinutes <= 0 && (
                                        <span>
                                            ❌ {order.model.toUpperCase() + ' - ' + 'Arrive dans quelques instants'}
                                        </span>
                                    )}
                                </MenuItemButton>
                            );
                        })}
                </MenuContent>
            </MainMenu>
            <SubMenu id="order">
                <MenuTitle banner={banner}>Catalogue des véhicules éléctriques</MenuTitle>
                <MenuContent>
                    {sortedCatalog.map(vehicle => (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.UpwOrder, vehicle.model);
                            }}
                            key={vehicle.model}
                        >
                            <div className="pr-2 flex items-center justify-between">
                                <span> {vehicle.name} </span>
                                <span>💸 ${getPrice(vehicle.price * 0.01)} </span>
                            </div>
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
