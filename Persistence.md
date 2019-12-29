PERSISTENCE
===========

The game requires *persistence*.

If you create something, it stays. And in the end, other people can pick it up and use it. 
Thus persistence and multiplayer are connected. Persistence is designed with multiplayer in mind: each persisting item is stored somewhere—someone is owning it.

Ownership
---------

Textnet is peer-to-peer: a player owns her own world. 

Player's avatar and its artifact body are stored on the computer of the player herself. Artifact holds a world where other artifacts are placed, and some artifacts might be 
placed inside other artifacts and so on. All they are stored on the local computer.


Transferring ownership
----------------------

It is easy to see that if player Alice picks an artifact somewhere—while visiting another 
player Bob—and then moves back to her world and drops the artifact there, the artifact is 
‘stolen’. Now Alice owns the artifact, and Bob has just lost it.

Why is it important? Because sometimes players are going offline.


Accessibility
-------------

If a player is online, her world is accessible to other players who were invited to it.
There are different ways to get to worlds of other players: by entering them as artifacts,
by invoking *Spoken Word*, by using *portals*.

If a player is offline, her world is no longer accessible. There is no way any other player 
can visit that world, let alone alter it. Players who were visiting are moved into their own
worlds (they can try to ‘leave’ them and if their hosting world is back online, they'll get back).


Identity
--------

Identity is a major problem in P2P world; probably the best way to handle it is to employ 
some blockchain-based contract system. That would be too much for this small game.

So, instead, each distribution of the game has its own identifier which looks 
roughly like this:

    trusted:7a55470fe36c62ca1804d5e99c2c6b5f4cc543e5

As there is no central authority that confirms that particular distribution is the 
rightful owner by a certain hash, we have to rely on trust and good will of players. For now.
When things will get out of hands, we'll switch to contracts or something.


Storage
-------

These things are stored on the local computer of each player:

1. Player account: id
2. Player avatar data: inventory, stack of visits
3. Artifacts' data




