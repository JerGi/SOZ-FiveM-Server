import { DrugSeedlingRepository } from '@private/server/resources/drug.seedling.repository';
import { DrugSellLocationRepository } from '@private/server/resources/drug.sell.location.repository';

import { Once, OnceStep } from '../../core/decorators/event';
import { Post } from '../../core/decorators/http';
import { Inject, MultiInject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick } from '../../core/decorators/tick';
import { Request } from '../../core/http/request';
import { Response } from '../../core/http/response';
import { OnceLoader } from '../../core/loader/once.loader';
import { ClientEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { BillboardRepository } from './billboard.repository';
import { ClothingShopRepository } from './cloth.shop.repository';
import { FuelStationRepository } from './fuel.station.repository';
import { GarageRepository } from './garage.repository';
import { GloveShopRepository } from './glove.shop.repository';
import { HousingRepository } from './housing.repository';
import { ObjectRepository } from './object.repository';
import { RaceRepository } from './race.repository';
import { Repository, RepositoryLegacy } from './repository';
import { TowRopeRepository } from './tow.rope.repository';
import { UnderTypesShopRepository } from './under_types.shop.repository';
import { UpwChargerRepository } from './upw.charger.repository';
import { UpwStationRepository } from './upw.station.repository';
import { VehicleRepository } from './vehicle.repository';

@Provider()
export class RepositoryProvider {
    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(FuelStationRepository)
    private fuelStationRepository: FuelStationRepository;

    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    @Inject(UpwStationRepository)
    private upwStationRepository: UpwStationRepository;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(TowRopeRepository)
    private towRopeRepository: TowRopeRepository;

    @Inject(ObjectRepository)
    private objectRepository: ObjectRepository;

    @Inject(DrugSeedlingRepository)
    private drugSeedlingRepository: DrugSeedlingRepository;

    @Inject(DrugSellLocationRepository)
    private drugSellLocationRepository: DrugSellLocationRepository;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(GloveShopRepository)
    private gloveShopRepository: GloveShopRepository;

    @Inject(UnderTypesShopRepository)
    private underTypesShopRepository: UnderTypesShopRepository;

    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(RaceRepository)
    private raceRepository: RaceRepository;

    @Inject(BillboardRepository)
    private billboardRepository: BillboardRepository;

    private legacyRepositories: Record<string, RepositoryLegacy<any>> = {};

    @MultiInject(Repository)
    private repositories: Repository<any>[];

    @Once()
    public setup() {
        this.legacyRepositories['garage'] = this.garageRepository;
        this.legacyRepositories['vehicle'] = this.vehicleRepository;
        this.legacyRepositories['fuelStation'] = this.fuelStationRepository;
        this.legacyRepositories['upwCharger'] = this.upwChargerRepository;
        this.legacyRepositories['upwStation'] = this.upwStationRepository;
        this.legacyRepositories['object'] = this.objectRepository;
        this.legacyRepositories['clothingShop'] = this.clothingShopRepository;
        this.legacyRepositories['gloveShop'] = this.gloveShopRepository;
        this.legacyRepositories['underTypesShop'] = this.underTypesShopRepository;
        this.legacyRepositories['drugSeedling'] = this.drugSeedlingRepository;
        this.legacyRepositories['drugSellLocation'] = this.drugSellLocationRepository;
        this.legacyRepositories['race'] = this.raceRepository;
        this.legacyRepositories['billboard'] = this.billboardRepository;
    }

    @Once(OnceStep.DatabaseConnected)
    public async init() {
        for (const repositoryName of Object.keys(this.legacyRepositories)) {
            await this.legacyRepositories[repositoryName].init();
        }

        for (const repository of this.repositories) {
            await repository.init();
        }

        this.onceLoader.trigger(OnceStep.RepositoriesLoaded);
    }

    @Tick(500)
    public synchronizeData() {
        for (const repository of this.repositories) {
            const patch = repository.observe();

            if (patch && patch.length > 0) {
                TriggerLatentClientEvent(ClientEvent.REPOSITORY_PATCH_DATA, -1, 16 * 1024, repository.type, patch);
            }
        }
    }

    @Rpc(RpcServerEvent.REPOSITORY_GET_DATA)
    public async getLegacyData(source: number, repositoryName: string): Promise<any> {
        if (this.legacyRepositories[repositoryName]) {
            return await this.legacyRepositories[repositoryName].get();
        }

        return null;
    }

    @Rpc(RpcServerEvent.REPOSITORY_GET_DATA_2)
    public async getData(source: number, type: string): Promise<Record<any, any>> {
        const repository = this.repositories.find(repository => repository.type === type);

        if (!repository) {
            return null;
        }

        return repository.raw();
    }

    public async refresh(repositoryName: string): Promise<any | null> {
        if (this.legacyRepositories[repositoryName]) {
            const data = await this.legacyRepositories[repositoryName].refresh();

            TriggerLatentClientEvent(ClientEvent.REPOSITORY_SYNC_DATA, -1, 16 * 1024, repositoryName, data);

            return data;
        }

        return null;
    }

    @Post('/repository/refresh')
    public async refreshRepository(request: Request): Promise<Response> {
        const data = JSON.parse(await request.body);
        const repositoryName = data.repository;

        if (this.legacyRepositories[repositoryName]) {
            await this.refresh(repositoryName);
            return Response.ok();
        }

        for (const repository of this.repositories) {
            if (repository.type === repositoryName) {
                await repository.refresh();
                return Response.ok();
            }
        }

        return Response.notFound('Repository not found');
    }
}
