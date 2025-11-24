import { PluginComponent } from './PluginComponent';
import { EventEmitter } from './EventEmitter';
import { MiddlewareCollection, DefaultEvents, Events } from './interfaces';

export abstract class PluginHook<T extends Events = DefaultEvents> extends PluginComponent {
  declare middlewareCollection: MiddlewareCollection<T | DefaultEvents>;
  declare $emitter: EventEmitter<T | DefaultEvents>;

  /**
   * Abstract install function to hook into events.
   */
  abstract install(): void;
}
