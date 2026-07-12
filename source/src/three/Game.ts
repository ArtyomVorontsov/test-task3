import _ from "lodash";

export enum DIRECTION {
  TL = "TL",
  TR = "TR",
  T = "T",
  B = "B",
  BL = "BL",
  BR = "BR",
}

export type Tile = {
  q: number;
  r: number;
  value: number;
  merged: boolean;
};

type Position = {
  q: number;
  r: number;
};

const DIRECTION_VECTOR: Record<DIRECTION, Position> = {
  [DIRECTION.TL]: { q: -1, r: 0 },
  [DIRECTION.TR]: { q: 0, r: -1 },
  [DIRECTION.T]: { q: 1, r: -1 },

  [DIRECTION.B]: { q: -1, r: 1 },
  [DIRECTION.BL]: { q: 0, r: 1 },
  [DIRECTION.BR]: { q: 1, r: 0 },
};

export class Game {
  private tiles = new Map<string, Tile>();

  private stats = {
    score: 0,
    moves: 0,
    highestTile: 0,
    startedAt: Date.now(),
    gameOver: false,
  };

  private frames: Map<string, Tile>[] = [];

  private handleKeyboardBound: (event: KeyboardEvent) => void;

  constructor(private radius: number) {
    this.createBoard();

    this.addTile(1, 2);
    this.pushFrame(this.tiles);
    this.addTile(2, 2);
    this.pushFrame(this.tiles);
    this.addTile(3, 4);
    this.pushFrame(this.tiles);

    this.handleKeyboardBound = this.handleKeyboard.bind(this);

    window.addEventListener("keydown", this.handleKeyboardBound);
  }

  private pushFrame(frame: Map<string, Tile>) {
    this.frames.push(
      new Map(
        Array.from(frame.entries()).map(([k, t]) => [
          k,
          { q: t.q, r: t.r, value: t.value, merged: t.merged },
        ])
      )
    );
  }

  private key(q: number, r: number): string {
    return `${q},${r}`;
  }

  private createBoard() {
    for (let q = -this.radius; q <= this.radius; q++) {
      const rMin = Math.max(-this.radius, -q - this.radius);

      const rMax = Math.min(this.radius, -q + this.radius);

      for (let r = rMin; r <= rMax; r++) {
        this.tiles.set(this.key(q, r), {
          q,
          r,
          value: 0,
          merged: false,
        });
      }
    }

    this.pushFrame(this.tiles);
  }

  public getMap(): Tile[] {
    return Array.from(this.tiles.values());
  }

  public getCurrentFrame(): Tile[] {
    if (this.frames.length) {
      let f = this.frames.shift();

      const frame = [...f!.values()];
      f?.clear();
      return frame;
    }

    return this.getMap();
  }

  private handleKeyboard(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyQ":
        this.move(DIRECTION.BR);
        break;

      case "KeyE":
        this.move(DIRECTION.TR);
        break;

      case "KeyW":
        this.move(DIRECTION.B);
        break;

      case "KeyS":
        this.move(DIRECTION.T);
        break;

      case "KeyA":
        this.move(DIRECTION.BL);
        break;

      case "KeyD":
        this.move(DIRECTION.TL);
        break;
    }
  }

  private move(direction: DIRECTION) {
    if (this.stats.gameOver) {
      return;
    }

    this.stats.moves++;

    const lines = this.getLines(direction);

    let moved = false;

    let mergeFinished: boolean[] = [];

    this.frames = [];

    this.tiles.forEach((t) => {
      t.merged = false;
    });

    do {
      mergeFinished = [];

      this.pushFrame(this.tiles);

      for (const line of lines) {
        const tiles = line.map(
          (pos) => this.tiles.get(this.key(pos.q, pos.r))!
        );

        const values = tiles;

        let step = this.mergeStep(values, direction);
        console.log(step);

        mergeFinished.push(step.mergeFinished);

        for (let i = 0; i < line.length; i++) {
          const tile = this.tiles.get(this.key(line[i].q, line[i].r))!;
          tile.merged = step.tiles[i].merged;
          const value = step.tiles[i]?.value ?? 0;

          if (tile.value !== value) {
            moved = true;
          }

          tile.value = value;
        }
      }
    } while (mergeFinished.filter((a) => a === false).length !== 0);

    this.stats.score = 0;
    this.tiles.forEach((t) => {
      this.stats.score += t.value;
      this.stats.highestTile =
        this.stats.highestTile < t.value ? t.value : this.stats.highestTile;
    });

    if (moved) {
      this.addRandomTile();

      if (!this.canMove()) {
        this.stats.gameOver = true;
      }
    }
  }

  private canMove(): boolean {
    for (const tile of this.tiles.values()) {
      // empty space exists
      if (tile.value === 0) {
        return true;
      }

      // check neighbours
      for (const direction of Object.values(DIRECTION_VECTOR)) {
        const neighbour = this.tiles.get(
          this.key(tile.q + direction.q, tile.r + direction.r)
        );

        if (neighbour && neighbour.value === tile.value) {
          return true;
        }
      }
    }

    return false;
  }

  private moveTilesIntoEmptySpaces(ordered: Tile[], result: Tile[]) {
    for (let i = 0; i < ordered.length; i++) {
      const current = ordered[i];

      if (current.value === 0) {
        continue;
      }

      for (let j = i + 1; j < ordered.length; j++) {
        const next = ordered[j];

        if (next.value === 0) {
          next.value = current.value;
          current.value = 0;

          return {
            mergeFinished: false,
            tiles: result,
          };
        }

        // another tile blocks movement
        break;
      }
    }
  }

  private mergeStep(
    tiles: Tile[],
    direction: DIRECTION
  ): {
    mergeFinished: boolean;
    tiles: Tile[];
  } {
    const result = tiles.map((tile) => ({ ...tile }));

    const ordered = [...result].sort((a, b) => {
      switch (direction) {
        case DIRECTION.BR:
          return b.q - a.q;

        case DIRECTION.BL:
          return b.r - a.r;

        case DIRECTION.T:
          return b.q + b.r - (a.q + a.r);

        case DIRECTION.B:
          return a.q + a.r - (b.q + b.r);

        case DIRECTION.TL:
          return a.q - b.q;

        case DIRECTION.TR:
          return a.r - b.r;

        default:
          return 0;
      }
    });

    // 1. Move tiles into empty spaces
    let movedTiles = this.moveTilesIntoEmptySpaces(ordered, result);
    if (movedTiles) {
      return movedTiles;
    }

    // 2. Merge tiles after movement is complete
    for (let i = 0; i < ordered.length - 1; i++) {
      const current = ordered[i];
      const next = ordered[i + 1];
      const nextNext = ordered[i + 2];

      if (
        current.value &&
        next.value &&
        nextNext &&
        nextNext.value &&
        next.value == nextNext.value
      ) {
        continue;
      }

      if (current.value !== 0 && current.value === next.value) {
        next.value *= 2;
        next.merged = true;
        current.value = 0;
        break;
      }
    }

    movedTiles = this.moveTilesIntoEmptySpaces(ordered, result);

    if (movedTiles) {
      return movedTiles;
    }

    return {
      mergeFinished: true,
      tiles: result,
    };
  }
  private addRandomTile() {
    const emptyTiles = Array.from(this.tiles.values()).filter(
      (tile) => tile.value === 0
    );

    if (emptyTiles.length === 0) {
      return;
    }

    const tile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    tile.value = Math.random() < 0.9 ? 2 : 4;
  }

  private addTile(tileId: number, tileValue: number) {
    const emptyTiles = Array.from(this.tiles.values()).filter(
      (tile) => tile.value === 0
    );

    if (emptyTiles.length === 0) {
      return;
    }

    const tile = emptyTiles[tileId];

    tile.value = tileValue;
  }

  private getLines(direction: DIRECTION): Position[][] {
    const vector = DIRECTION_VECTOR[direction];

    const lines: Position[][] = [];

    const exists = (q: number, r: number) => this.tiles.has(this.key(q, r));

    for (const tile of this.tiles.values()) {
      const previousQ = tile.q - vector.q;

      const previousR = tile.r - vector.r;

      // this is the beginning of a line
      if (!exists(previousQ, previousR)) {
        const line: Position[] = [];

        let q = tile.q;
        let r = tile.r;

        while (exists(q, r)) {
          line.push({
            q,
            r,
          });

          q += vector.q;
          r += vector.r;
        }

        if (line.length > 1) {
          lines.push(line);
        }
      }
    }

    return lines;
  }

  public dispose() {
    window.removeEventListener("keydown", this.handleKeyboardBound);
  }

  public getStats() {
    return {
      ...this.stats,
    };
  }
}
