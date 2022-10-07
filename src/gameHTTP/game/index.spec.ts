import { test, expect, vi } from 'vitest';
import { createGame } from './index';

test('game shold emit "player-added" when addPlayer has called', (ctx) => {
    const game = createGame();

    const listener = vi.fn();

    game.on('player-added', listener);

    game.createPlayer();

    expect(listener).toHaveBeenCalled();
});

test('game shold emit "tick" when running', async (ctx) => {
    const game = createGame();

    const promise = new Promise<boolean>(res => {

        game.on('tick', () => res(true));

        setTimeout(() => res(false), 100);
    });

    game.run();

    await expect(promise).resolves.toBeTruthy();
});

test('game sholdn\'t emit "player-removed" if game has no players or id dont exist', (ctx) => {
    const game = createGame();

    const listener = vi.fn();

    game.on('player-removed', listener);

    game.removePlayer('0');

    expect(listener).not.toHaveBeenCalled();
});

test('game shold emit "player-removed" if a player has removed', (ctx) => {
    const game = createGame();

    const playerAddedListener = vi.fn();
    const playerRemovedListener = vi.fn();

    game.on('player-added', playerAddedListener);
    game.on('player-removed', playerRemovedListener);

    const player = game.createPlayer();
    
    player.id = 'ID';

    const removedPlayer = game.removePlayer(player.id);

    expect(playerRemovedListener).toHaveBeenCalled();
});