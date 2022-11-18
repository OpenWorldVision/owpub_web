import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number")
  x = 0;

  @type("number")
  y = 0;

  @type("boolean")
  isStop = false;
}

export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}
