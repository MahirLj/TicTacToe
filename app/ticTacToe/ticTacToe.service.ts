export class TicTacToeService {
    public games: any = [];

    configTypeDefs() {
        let typeDefs = `
        type Player {
            value: Int,
            playerId: Int,
            history: Int
        }

        type TicTacToe {
            id: Int,
            fields: [Player],
            singlePlayer: Boolean,
            message: String
        }
        `

        typeDefs += `
        extend type Query {
            games: [TicTacToe],
            game(id: Int): TicTacToe
        }`

        typeDefs += `
        extend type Mutation {
            createGame(field: Int, playerId: Int, singlePlayer: Boolean): TicTacToe!
            updateGame(id: Int, field: Int, playerId: Int, character: Int): TicTacToe!
        }`;
        return typeDefs
    }

    configResolvers(resolvers: any) {
        resolvers.Query.games = () => {
            return this.games;
        }
        resolvers.Query.game = (_: any, req: any) => {
            return this.games.filter((x: any) => x.id === req.id)[0]
        }
        resolvers.Mutation.createGame = (_: any, req: any) => {
            let allFields: { playerId: number, value: number, history: number }[] = [{ playerId: -1, value: -1, history: -1 }, { playerId: -1, value: -1, history: -1 }, { playerId: -1, value: -1, history: -1 }, { playerId: -1, value: -1, history: -1 }, { playerId: -1, value: -1, history: -1 }, { playerId: -1, value: -1, history: -1 }, { playerId: -1, value: -1, history: -1 }, { playerId: -1, value: -1, history: -1 }, { playerId: -1, value: -1, history: -1 }];
            if (req.singlePlayer) {
                allFields[req.field - 1].value = 1;
                allFields[req.field - 1].playerId = 1;
                allFields[req.field - 1].history = 0;
                const found: number = allFields.findIndex(x => x.value === -1);
                allFields[found].value = 0;
                allFields[found].playerId = 0;
                allFields[found].history = 1;
                const game: { id: number, fields: { playerId: number, value: number, history: number }[], singlePlayer: boolean } = { id: this.games.length + 1, fields: allFields, singlePlayer: true };
                this.games.push(game);
                return game;
            } else {
                allFields[req.field - 1].value = 1;
                allFields[req.field - 1].playerId = req.playerId;
                allFields[req.field - 1].history = 0;
                const game: { id: number, fields: { playerId: number, value: number, history: number }[], singlePlayer: boolean } = { id: this.games.length + 1, fields: allFields, singlePlayer: false };
                this.games.push(game);
                return game;
            }
        }
        resolvers.Mutation.updateGame = (_: any, req: any) => {
            const game: { id: number, message: string, fields: { playerId: number, value: number, history: number }[], singlePlayer: boolean } = this.games[req.id - 1];
            if (game.fields[req.field - 1].value !== -1) {
                throw new Error("Already filled cell!");
            }
            const lastPlayerPlayed: number = (game.fields.filter((x: any) => x.history !== -1)).length + 1
            if (game.singlePlayer) {
                game.fields[req.field - 1].value = 1;
                game.fields[req.field - 1].playerId = 1
                game.fields[req.field - 1].history = lastPlayerPlayed;
                game.message = checkWinner(game);
                if (game.message !== '') return game;
                const found: number = game.fields.findIndex((x: any) => x.value === -1);
                game.fields[found].value = 0;
                game.fields[found].playerId = 0;
                game.fields[found].history = lastPlayerPlayed + 1;
            } else {
                game.fields[req.field - 1].value = req.character;
                game.fields[req.field - 1].playerId = req.playerId;
                game.fields[req.field - 1].history = lastPlayerPlayed;
            }
            game.message = checkWinner(game);
            this.games[req.id - 1] = game;
            return game;
        }
    }
}

function checkWinner(game: { id: number, fields: { playerId: number, value: number, history: number }[], singlePlayer: boolean }) {
    if ((game.fields[0].value == game.fields[1].value) && (game.fields[2].value == game.fields[1].value) && game.fields[1].value !== -1) return `Player ${game.fields[1].playerId} wins!`
    if ((game.fields[3].value == game.fields[4].value) && (game.fields[5].value == game.fields[4].value) && game.fields[4].value !== -1) return `Player ${game.fields[4].playerId} wins!`
    if ((game.fields[6].value == game.fields[7].value) && (game.fields[8].value == game.fields[7].value) && game.fields[7].value !== -1) return `Player ${game.fields[7].playerId} wins!`
    if ((game.fields[0].value == game.fields[3].value) && (game.fields[6].value == game.fields[3].value) && game.fields[3].value !== -1) return `Player ${game.fields[3].playerId} wins!`
    if ((game.fields[1].value == game.fields[4].value) && (game.fields[4].value == game.fields[7].value) && game.fields[7].value !== -1) return `Player ${game.fields[7].playerId} wins!`
    if ((game.fields[2].value == game.fields[5].value) && (game.fields[5].value == game.fields[8].value) && game.fields[8].value !== -1) return `Player ${game.fields[8].playerId} wins!`
    if ((game.fields[0].value == game.fields[4].value) && (game.fields[8].value == game.fields[4].value) && game.fields[4].value !== -1) return `Player ${game.fields[4].playerId} wins!`
    if ((game.fields[2].value == game.fields[4].value) && (game.fields[6].value == game.fields[4].value) && game.fields[4].value !== -1) return `Player ${game.fields[4].playerId} wins!`
    return '';
}