import { Module } from '../../core/decorators/module';
import { VehicleAirProvider } from './vehicle.air.provider';
import { VehicleCarWashProvider } from './vehicle.carwash.provider';
import { VehicleConditionProvider } from './vehicle.condition.provider';
import { VehicleCustomProvider } from './vehicle.custom.provider';
import { VehicleDamageProvider } from './vehicle.damage.provider';
import { VehicleDealershipProvider } from './vehicle.dealership.provider';
import { VehicleElectricProvider } from './vehicle.electric.provider';
import { VehicleFuelProvider } from './vehicle.fuel.provider';
import { VehicleGarageProvider } from './vehicle.garage.provider';
import { VehicleItemProvider } from './vehicle.item.provider';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleMenuProvider } from './vehicle.menu.provider';
import { VehiclePitStopProvider } from './vehicle.pitstop.provider';
import { VehiclePoliceLocator } from './vehicle.police.locator.provider';
import { VehicleRadarProvider } from './vehicle.radar.provider';
import { VehicleSeatbeltProvider } from './vehicle.seatbelt.provider';
import { VehicleSpawnProvider } from './vehicle.spawn.provider';
import { VehicleStateProvider } from './vehicle.state.provider';
import { VehicleTowProvider } from './vehicle.tow.provider';
import { VehicleOffroadProvider } from './vehicule.offroad.provider';

@Module({
    providers: [
        VehicleAirProvider,
        VehicleCarWashProvider,
        VehicleConditionProvider,
        VehicleCustomProvider,
        VehicleDamageProvider,
        VehicleDealershipProvider,
        VehicleFuelProvider,
        VehicleGarageProvider,
        VehicleItemProvider,
        VehicleLockProvider,
        VehicleMenuProvider,
        VehicleSeatbeltProvider,
        VehicleSpawnProvider,
        VehicleRadarProvider,
        VehicleElectricProvider,
        VehicleStateProvider,
        VehiclePoliceLocator,
        VehiclePitStopProvider,
        VehicleTowProvider,
        VehicleOffroadProvider,
    ],
})
export class VehicleModule {}
