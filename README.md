-----------------------
How to run the project:
position where package.json is and run:
npm install
npm start

node version: v11.15.0
npm version: 6.7.0
-----------------------

We will create object array because I want to reduce memory usage.

Create singlePlayer game:

mutation {
  createGame(field:6, singlePlayer:true) {
    id,
    fields {
      playerId,
      value,
      history
    }
  }
}

Field is number of the box which user clicked.

We are creating object array:
[
    { playerId: -1, value: -1, history: -1 },
    { playerId: -1, value: -1, history: -1 },
    ....
]
where default value is -1. With this approach we will know which field is
empty and which not. In this case playerId will always be 1, and computer's id
will be 0.


-----------------------
- join an existing game
- make a new move
- get live results via subscription
Update singlePlayer game:

mutation {
  updateGame(id:2, field:8) {
    id
    message,
    fields {
      playerId,
      value,
      history,
    }
  }
}

Where id is id of game and field is number of the box which user clicked.

-----------------------
Create multiPlayer game:

mutation {
  createGame(field:6, playerId:0, singlePlayer:false) {
    id,
    fields {
      playerId,
      value,
      history
    }
  }
}

field is number of the box which user clicked.
playerId is user id.

In this case an object array with default value is created:

[
    { playerId: -1, value: -1, history: -1 },
    { playerId: -1, value: -1, history: -1 },
    ....
]

When we send api call from a client, game will be created.

-----------------------
- join an existing game
- make a new move
- get live results via subscription
Update multiPlayer game:

mutation {
  updateGame(id:2, field:3, playerId: 1, character: 0) {
    id
    fields {
      playerId,
      value,
      history
    }
  }
}

Where id is id of game and field is number of the box which user clicked.
Character value represents x(1) or o(0) depending of which user is currently playing.

-----------------------
Get all games:

query {
  games {
    id,
    fields {
      playerId,
      history,
      value
    }
  }
}

-----------------------
- get live results via subscription
- get history for a game by id
Get game by id:

query {
  game(id:1) {
    id,
    message,
    fields {
      playerId,
      history,
      value
    }
  }
}

After data is received history data can be checked in fields>history.
History represents moves.



