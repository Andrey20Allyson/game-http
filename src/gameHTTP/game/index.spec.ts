import { test, expect, vi } from 'vitest';
import { createGame } from './index';

test('game emit "player-added" when addPlayer has called', (ctx) => {
    const game = createGame();

    const listener = vi.fn();

    game.on('player-added', listener);

    game.addPlayer();

    expect(listener).toHaveBeenCalled();
});

test('game emit "tick" when running', async (ctx) => {
    const game = createGame();

    const promise = new Promise<boolean>(res => {

        game.on('tick', () => res(true));

        setTimeout(() => res(false), 100);
    });

    game.run();

    await expect(promise).resolves.toBeTruthy();
});