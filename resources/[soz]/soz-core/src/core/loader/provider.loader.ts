import { Inject } from '../decorators/injectable';
import { ProviderMetadata, ProviderMetadataKey } from '../decorators/provider';
import { Logger } from '../logger';
import { CommandLoader } from './command.loader';
import { EventLoader } from './event.loader';
import { ExportLoader } from './exports.loader';
import { OnceLoader } from './once.loader';
import { PlayerLoader } from './player.loader';
import { RpcLoader } from './rpc.loader';
import { SelectorLoader } from './selector.loader';
import { TickLoader } from './tick.loader';

export abstract class ProviderLoader {
    @Inject(TickLoader)
    private tickLoader: TickLoader;

    @Inject(EventLoader)
    private eventLoader: EventLoader;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(ExportLoader)
    private exportLoader: ExportLoader;

    @Inject(Logger)
    private logger: Logger;

    @Inject(CommandLoader)
    private commandLoader: CommandLoader;

    @Inject(RpcLoader)
    private rpcLoader: RpcLoader;

    @Inject(SelectorLoader)
    private selectorLoader: SelectorLoader;

    @Inject(PlayerLoader)
    private playerLoader: PlayerLoader;

    public load(provider): void {
        const providerMetadata = Reflect.getMetadata(ProviderMetadataKey, provider) as ProviderMetadata;
        this.logger.debug('[provider] register:', providerMetadata.name);

        this.tickLoader.load(provider);
        this.eventLoader.load(provider);
        this.onceLoader.load(provider);
        this.exportLoader.load(provider);
        this.commandLoader.load(provider);
        this.rpcLoader.load(provider);
        this.selectorLoader.load(provider);
        this.playerLoader.load(provider);
    }

    public unload(): void {
        this.tickLoader.unload();
        this.eventLoader.unload();
        this.onceLoader.unload();
        this.exportLoader.unload();
        this.commandLoader.unload();
        this.rpcLoader.unload();
        this.selectorLoader.unload();
        this.playerLoader.unload();
    }
}
