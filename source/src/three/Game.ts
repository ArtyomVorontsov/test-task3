export enum DIRECTION {
  TL = "TL",
  TR = "TR",
  T = "T",
  B = "B",
  BL = "BL",
  BR = "BR",
}

type Tile = {
  q: number;
  r: number;
  value: number;
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

  constructor(private radius: number) {
    this.createBoard();

    window.addEventListener("keydown", this.handleKeyboard.bind(this));

    this.addRandomTile();
    this.addRandomTile();
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
        });
      }
    }
  }

  public getMap(): Tile[] {
    return Array.from(this.tiles.values());
  }

  private handleKeyboard(event: KeyboardEvent) {
    console.log(this.getMap());

    switch (event.code) {
      case "KeyQ":
        this.move(DIRECTION.BR);
        break;

      case "KeyE":
        this.move(DIRECTION.TR);
        break;

      case "KeyW":
        this.move(DIRECTION.T);
        break;

      case "KeyS":
        this.move(DIRECTION.B);
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

    for (const line of lines) {
      const tiles = line.map((pos) => this.tiles.get(this.key(pos.q, pos.r))!);

      const values = tiles.filter((tile) => tile.value > 0);

      const merged = this.merge(values);

      for (let i = 0; i < line.length; i++) {
        const tile = this.tiles.get(this.key(line[i].q, line[i].r))!;

        const value = merged[i]?.value ?? 0;

        if (tile.value !== value) {
          moved = true;
        }

        tile.value = value;
      }
    }

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

  private merge(tiles: Tile[]): Tile[] {
    const result: Tile[] = [];

    for (let i = 0; i < tiles.length; i++) {
      const current = tiles[i];

      if (i + 1 < tiles.length && current.value === tiles[i + 1].value) {
        const newValue = current.value * 2;

        this.stats.score += newValue;

        this.stats.highestTile = Math.max(this.stats.highestTile, newValue);

        result.push({
          ...current,
          value: newValue,
        });

        i++;
      } else {
        result.push(current);
      }
    }

    return result;
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

  public getStats() {
    return {
      ...this.stats,
    };
  }
}
